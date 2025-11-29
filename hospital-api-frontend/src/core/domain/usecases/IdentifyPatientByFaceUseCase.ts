import type { PatientRepository, PatientMatch, TemporaryAccessToken } from '../repositories/PatientRepository.tsx';

import { FacialRecognitionService } from '../../infrastructure/services/FacialRecognitionService.jsx';
import { EncryptionService } from '../../infrastructure/services/EncryptionService.jsx';
import { AgentCommunicationService } from '../../infrastructure/services/AgentCommunicationService.jsx';

export interface IdentifyPatientInput {
  faceImageFile: File;
  doctorId: string;
  organizationId: string;
  sessionTTLMinutes?: number;
}

export interface IdentifyPatientOutput {
  success: boolean;
  matches?: PatientMatch[];
  temporaryToken?: TemporaryAccessToken;
  error?: string;
  noMatchesFound?: boolean;
}

export class IdentifyPatientByFaceUseCase {
  constructor(
    private patientRepository: PatientRepository,
    private facialRecognitionService: FacialRecognitionService,
    private encryptionService: EncryptionService,
    private agentCommunication: AgentCommunicationService
  ) {}

  async execute(input: IdentifyPatientInput): Promise<IdentifyPatientOutput> {
    try {
      if (!input.faceImageFile) {
        return {
          success: false,
          error: 'Se requiere una imagen facial para identificación'
        };
      }

      const faceVector = await this.facialRecognitionService.convertImageToFaceVector(
        input.faceImageFile
      );

      if (!faceVector) {
        return {
          success: false,
          error: 'No se pudo detectar un rostro válido en la imagen. Por favor, intente nuevamente.'
        };
      }

      const faceQuality = await this.facialRecognitionService.validateFaceQuality(
        input.faceImageFile
      );

      if (faceQuality < 0.6) {
        return {
          success: false,
          error: 'La calidad de la imagen es insuficiente para identificación confiable.'
        };
      }

      const encryptedVector = this.encryptionService.encryptFaceVector(faceVector);

      const matches = await this.patientRepository.findByFaceVector(
        encryptedVector,
        input.organizationId
      );

      if (!matches || matches.length === 0) {
        await this.agentCommunication.sendToAgent({
          action: 'PATIENT_IDENTIFICATION_FAILED',
          data: {
            doctorId: input.doctorId,
            organizationId: input.organizationId,
            timestamp: new Date().toISOString(),
            reason: 'NO_MATCHES_FOUND'
          }
        }, {
          priority: 'LOW',
          requiresResponse: false
        });

        return {
          success: true,
          matches: [],
          noMatchesFound: true
        };
      }

      const highConfidenceMatches = matches.filter(m => m.matchConfidence >= 0.75);

      if (highConfidenceMatches.length === 0) {
        return {
          success: true,
          matches: [],
          noMatchesFound: true,
          error: 'No se encontraron coincidencias con suficiente confianza'
        };
      }

      const ttlMinutes = input.sessionTTLMinutes || 20;
      const temporaryToken = await this.patientRepository.getTemporaryMatches(
        highConfidenceMatches,
        input.doctorId,
        ttlMinutes
      );

      await this.agentCommunication.sendToAgent({
        action: 'PATIENT_IDENTIFICATION_SUCCESS',
        data: {
          doctorId: input.doctorId,
          organizationId: input.organizationId,
          matchesCount: highConfidenceMatches.length,
          timestamp: new Date().toISOString()
        }
      }, {
        priority: 'NORMAL',
        requiresResponse: false
      });

      return {
        success: true,
        matches: highConfidenceMatches,
        temporaryToken
      };

    } catch (error) {
      console.error('Error identifying patient:', error);
      
      await this.agentCommunication.sendToAgent({
        action: 'PATIENT_IDENTIFICATION_ERROR',
        data: {
          doctorId: input.doctorId,
          organizationId: input.organizationId,
          timestamp: new Date().toISOString(),
          errorType: error instanceof Error ? error.name : 'UNKNOWN'
        }
      }, {
        priority: 'HIGH',
        requiresResponse: false
      });

      return {
        success: false,
        error: 'Error al identificar paciente. Por favor, intente nuevamente.'
      };
    }
  }
}
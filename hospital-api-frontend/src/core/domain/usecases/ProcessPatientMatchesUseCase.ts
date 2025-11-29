import type { PatientRepository, FullPatientData } from '../repositories/PatientRepository.jsx';
import { AgentCommunicationService } from '../../infrastructure/services/AgentCommunicationService.jsx';

export interface ProcessMatchesInput {
  selectedPatientId: string;
  temporaryAccessToken: string;
  doctorId: string;
  organizationId: string;
  accessReason?: string;
}

export interface ProcessMatchesOutput {
  success: boolean;
  patientData?: FullPatientData;
  error?: string;
  accessExpiresAt?: Date;
  remainingTimeMinutes?: number;
}

export class ProcessPatientMatchesUseCase {
  constructor(
    private patientRepository: PatientRepository,
    private agentCommunication: AgentCommunicationService
  ) {}

  async execute(input: ProcessMatchesInput): Promise<ProcessMatchesOutput> {
    try {
      const isTokenValid = await this.patientRepository.validateAccessToken(
        input.temporaryAccessToken
      );

      if (!isTokenValid) {
        return {
          success: false,
          error: 'El token de acceso ha expirado o es inválido. Por favor, identifique al paciente nuevamente.'
        };
      }

      const patientData = await this.patientRepository.getFullPatientData(
        input.selectedPatientId,
        input.temporaryAccessToken
      );

      if (!patientData) {
        return {
          success: false,
          error: 'No se pudo obtener la información del paciente. Verifique los permisos de acceso.'
        };
      }

      const now = new Date();
      const expiresAt = patientData.accessExpiresAt;
      const remainingTimeMs = expiresAt.getTime() - now.getTime();
      const remainingTimeMinutes = Math.floor(remainingTimeMs / (1000 * 60));

      await this.agentCommunication.sendToAgent({
        action: 'PATIENT_DATA_ACCESSED',
        data: {
          patientId: input.selectedPatientId,
          doctorId: input.doctorId,
          organizationId: input.organizationId,
          accessReason: input.accessReason || 'MEDICAL_CONSULTATION',
          timestamp: new Date().toISOString(),
          expiresAt: expiresAt.toISOString()
        }
      }, {
        priority: 'HIGH',
        requiresResponse: false
      });

      if (remainingTimeMinutes <= 5) {
        await this.agentCommunication.sendToAgent({
          action: 'ACCESS_EXPIRING_SOON',
          data: {
            patientId: input.selectedPatientId,
            doctorId: input.doctorId,
            remainingMinutes: remainingTimeMinutes,
            timestamp: new Date().toISOString()
          }
        }, {
          priority: 'NORMAL',
          requiresResponse: false
        });
      }

      return {
        success: true,
        patientData,
        accessExpiresAt: expiresAt,
        remainingTimeMinutes
      };

    } catch (error) {
      console.error('Error processing patient matches:', error);
      
      await this.agentCommunication.sendToAgent({
        action: 'PATIENT_DATA_ACCESS_ERROR',
        data: {
          patientId: input.selectedPatientId,
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
        error: 'Error al procesar la información del paciente. Por favor, intente nuevamente.'
      };
    }
  }

  async revokeAccess(temporaryAccessToken: string, doctorId: string): Promise<boolean> {
    try {
      await this.patientRepository.revokeTemporaryAccess(temporaryAccessToken);
      
      await this.agentCommunication.sendToAgent({
        action: 'ACCESS_REVOKED',
        data: {
          doctorId,
          timestamp: new Date().toISOString(),
          reason: 'MANUAL_REVOCATION'
        }
      }, {
        priority: 'NORMAL',
        requiresResponse: false
      });

      return true;
    } catch (error) {
      console.error('Error revoking access:', error);
      return false;
    }
  }
}
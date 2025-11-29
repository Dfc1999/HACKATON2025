import { PatientEntity } from '../entities/Patient.jsx';
import type { PatientRepository, PatientRegistrationData } from '../repositories/PatientRepository.jsx';
import { FacialRecognitionService } from '../../infrastructure/services/FacialRecognitionService.jsx';
import { EncryptionService } from '../../infrastructure/services/EncryptionService.jsx';
import { AgentCommunicationService } from '../../infrastructure/services/AgentCommunicationService.jsx';

export interface RegisterPatientInput {
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: Date;
  documentNumber: string;
  phoneNumber: string;
  faceImageFile: File;
  medicalInfo: {
    bloodType?: string;
    allergies: string[];
    chronicConditions: string[];
    medications: string[];
    insuranceNumber?: string;
    insuranceProvider?: string;
  };
  emergencyContacts: Array<{
    name: string;
    relationship: string;
    phoneNumber: string;
    alternativePhone?: string;
  }>;
  organizationId: string;
  consentGiven: boolean;
}

export interface RegisterPatientOutput {
  success: boolean;
  patient?: PatientEntity;
  error?: string;
  validationErrors?: Record<string, string>;
}

export class RegisterPatientUseCase {
  constructor(
    private patientRepository: PatientRepository,
    private facialRecognitionService: FacialRecognitionService,
    private encryptionService: EncryptionService,
    private agentCommunication: AgentCommunicationService
  ) {}

  async execute(input: RegisterPatientInput): Promise<RegisterPatientOutput> {
    try {
      const validationErrors = this.validateInput(input);
      if (Object.keys(validationErrors).length > 0) {
        return {
          success: false,
          validationErrors
        };
      }

      const faceVector = await this.facialRecognitionService.convertImageToFaceVector(
        input.faceImageFile
      );

      if (!faceVector) {
        return {
          success: false,
          error: 'No se pudo detectar un rostro válido en la imagen. Por favor, intente nuevamente con mejor iluminación.'
        };
      }

      const faceQuality = await this.facialRecognitionService.validateFaceQuality(
        input.faceImageFile
      );

      if (faceQuality < 0.7) {
        return {
          success: false,
          error: 'La calidad de la imagen facial es insuficiente. Por favor, capture una imagen con mejor calidad.'
        };
      }

      const encryptedVector = this.encryptionService.encryptFaceVector(faceVector);
      const vectorHash = this.encryptionService.hashSensitiveData(
        JSON.stringify(Array.from(faceVector))
      );

      const registrationData: PatientRegistrationData = {
        firstName: input.firstName,
        lastName: input.lastName,
        email: input.email,
        dateOfBirth: input.dateOfBirth,
        documentNumber: input.documentNumber,
        phoneNumber: input.phoneNumber,
        encryptedFaceVector: encryptedVector,
        faceVectorHash: vectorHash,
        medicalInfo: input.medicalInfo,
        emergencyContacts: input.emergencyContacts,
        organizationId: input.organizationId,
        consentGiven: input.consentGiven,
        consentDate: new Date()
      };

      await this.agentCommunication.sendToAgent({
        action: 'PATIENT_REGISTRATION',
        data: {
          patientName: `${input.firstName} ${input.lastName}`,
          organizationId: input.organizationId,
          timestamp: new Date().toISOString()
        }
      }, {
        priority: 'NORMAL',
        requiresResponse: false
      });

      const patient = await this.patientRepository.register(registrationData);

      return {
        success: true,
        patient
      };

    } catch (error) {
      console.error('Error registering patient:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido al registrar paciente'
      };
    }
  }

  private validateInput(input: RegisterPatientInput): Record<string, string> {
    const errors: Record<string, string> = {};

    if (!input.firstName || input.firstName.trim().length === 0) {
      errors.firstName = 'El nombre es requerido';
    }

    if (!input.lastName || input.lastName.trim().length === 0) {
      errors.lastName = 'El apellido es requerido';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!input.email || !emailRegex.test(input.email)) {
      errors.email = 'Email inválido';
    }

    if (!input.documentNumber || input.documentNumber.trim().length === 0) {
      errors.documentNumber = 'El número de documento es requerido';
    }

    if (!input.phoneNumber || input.phoneNumber.length < 8) {
      errors.phoneNumber = 'Número de teléfono inválido';
    }

    if (!input.faceImageFile) {
      errors.faceImage = 'La imagen facial es requerida';
    }

    if (input.emergencyContacts.length === 0) {
      errors.emergencyContacts = 'Se requiere al menos un contacto de emergencia';
    }

    if (!input.consentGiven) {
      errors.consent = 'Debe aceptar el consentimiento informado';
    }

    return errors;
  }
}
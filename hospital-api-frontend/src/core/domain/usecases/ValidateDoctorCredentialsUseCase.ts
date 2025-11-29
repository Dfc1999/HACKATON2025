import type { DoctorRepository, DoctorValidationData } from '../repositories/DoctorRepository.jsx';
import { OCRService } from '../../infrastructure/services/OCRService.jsx';
import { AgentCommunicationService } from '../../infrastructure/services/AgentCommunicationService.jsx';

export interface ValidateDoctorInput {
  doctorId: string;
  credentialImages: File[];
  expectedLicenseNumber: string;
  organizationId: string;
}

export interface ValidateDoctorOutput {
  success: boolean;
  isValid?: boolean;
  extractedLicenseNumber?: string | undefined;
  confidence?: number;
  error?: string;
  validationDetails?: {
    ocrMatches: boolean;
    licenseNumberValid: boolean;
    documentQuality: number;
  };
}

export class ValidateDoctorCredentialsUseCase {
  constructor(
    private doctorRepository: DoctorRepository,
    private ocrService: OCRService,
    private agentCommunication: AgentCommunicationService
  ) {}

  async execute(input: ValidateDoctorInput): Promise<ValidateDoctorOutput> {
    try {
      if (!input.credentialImages || input.credentialImages.length === 0) {
        return {
          success: false,
          error: 'Se requiere al menos una imagen de credencial'
        };
      }

      const documentImagesBase64: string[] = [];
      for (const image of input.credentialImages) {
        const base64 = await this.convertImageToBase64(image);
        documentImagesBase64.push(base64);
      }

      const ocrResults = await Promise.all(
        input.credentialImages.map(img => this.ocrService.extractTextFromDocument(img))
      );

      const allExtractedText = ocrResults.join(' ');

      const licenseValidation = await this.ocrService.validateProfessionalLicense(
        allExtractedText,
        input.expectedLicenseNumber
      );

      if (!licenseValidation.isValid) {
        await this.agentCommunication.sendToAgent({
          action: 'DOCTOR_VALIDATION_FAILED',
          data: {
            doctorId: input.doctorId,
            organizationId: input.organizationId,
            reason: 'LICENSE_NUMBER_MISMATCH',
            timestamp: new Date().toISOString()
          }
        }, {
          priority: 'NORMAL',
          requiresResponse: false
        });

        return {
          success: true,
          isValid: false,
          extractedLicenseNumber: licenseValidation.extractedNumber,
          confidence: licenseValidation.confidence,
          validationDetails: {
            ocrMatches: false,
            licenseNumberValid: false,
            documentQuality: licenseValidation.documentQuality
          }
        };
      }

      const validationData: DoctorValidationData = {
        documentImages: documentImagesBase64,
        professionalLicenseNumber: input.expectedLicenseNumber,
        additionalInfo: JSON.stringify({
          extractedText: allExtractedText.substring(0, 500),
          confidence: licenseValidation.confidence,
          validatedAt: new Date().toISOString()
        })
      };

      const isCredentialValid = await this.doctorRepository.validateCredentials(
        input.doctorId,
        validationData
      );

      await this.agentCommunication.sendToAgent({
        action: 'DOCTOR_VALIDATION_SUCCESS',
        data: {
          doctorId: input.doctorId,
          organizationId: input.organizationId,
          licenseNumber: input.expectedLicenseNumber,
          confidence: licenseValidation.confidence,
          timestamp: new Date().toISOString()
        }
      }, {
        priority: 'NORMAL',
        requiresResponse: true
      });

      return {
        success: true,
        isValid: isCredentialValid,
        extractedLicenseNumber: licenseValidation.extractedNumber,
        confidence: licenseValidation.confidence,
        validationDetails: {
          ocrMatches: true,
          licenseNumberValid: true,
          documentQuality: licenseValidation.documentQuality
        }
      };

    } catch (error) {
      console.error('Error validating doctor credentials:', error);
      return {
        success: false,
        error: 'Error al validar credenciales. Por favor, intente nuevamente.'
      };
    }
  }

  private convertImageToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result.split(',')[1] ?? '');
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
}
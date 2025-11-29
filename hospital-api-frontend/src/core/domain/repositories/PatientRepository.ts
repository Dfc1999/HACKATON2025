import { PatientEntity } from '../entities/Patient.jsx';

export interface PatientRegistrationData {
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: Date;
  documentNumber: string;
  phoneNumber: string;
  encryptedFaceVector: string;
  faceVectorHash: string;
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
  consentDate: Date;
}

export interface PatientMatch {
  patientId: string;
  firstName: string;
  lastName: string;
  matchConfidence: number;
  organizationId: string;
  lastUpdated: Date;
}

export interface TemporaryAccessToken {
  token: string;
  patientIds: string[];
  expiresAt: Date;
  doctorId: string;
}

export interface FullPatientData extends PatientEntity {
  accessGrantedAt: Date;
  accessExpiresAt: Date;
  accessedBy: string;
}

export interface PatientRepository {
  register(data: PatientRegistrationData): Promise<PatientEntity>;
  
  findByFaceVector(encryptedVector: string, organizationId: string): Promise<PatientMatch[]>;
  
  getTemporaryMatches(
    matches: PatientMatch[], 
    doctorId: string, 
    ttlMinutes: number
  ): Promise<TemporaryAccessToken>;
  
  getFullPatientData(
    patientId: string, 
    accessToken: string
  ): Promise<FullPatientData | null>;
  
  validateAccessToken(token: string): Promise<boolean>;
  
  revokeTemporaryAccess(token: string): Promise<void>;
  
  findByDocumentNumber(
    documentNumber: string, 
    organizationId: string
  ): Promise<PatientEntity | null>;
  
  updatePatientInfo(
    patientId: string, 
    data: Partial<PatientRegistrationData>
  ): Promise<PatientEntity>;
}
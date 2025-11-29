import { UserEntity, UserRole } from './User.jsx';

export interface MedicalInfo {
  bloodType?: string;
  allergies: string[];
  chronicConditions: string[];
  medications: string[];
  insuranceNumber?: string;
  insuranceProvider?: string;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phoneNumber: string;
  alternativePhone?: string;
}

export interface Patient {
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  documentNumber: string;
  phoneNumber: string;
  faceVectorHash: string;
  medicalInfo: MedicalInfo;
  emergencyContacts: EmergencyContact[];
  consentGiven: boolean;
  consentDate?: Date | null | undefined;
}

export class PatientEntity extends UserEntity implements Patient {
  constructor(
    id: string,
    email: string,
    organizationId: string,
    createdAt: Date,
    isActive: boolean,
    public firstName: string,
    public lastName: string,
    public dateOfBirth: Date,
    public documentNumber: string,
    public phoneNumber: string,
    public faceVectorHash: string,
    public medicalInfo: MedicalInfo,
    public emergencyContacts: EmergencyContact[],
    public consentGiven: boolean,
    public consentDate?: Date,
    lastLogin?: Date
  ) {
    super(id, email, UserRole.PATIENT, organizationId, createdAt, isActive, lastLogin);
    this.validatePatientData();
  }

  private validatePatientData(): void {
    if (!this.firstName || this.firstName.trim().length === 0) {
      throw new Error('First name is required');
    }
    if (!this.lastName || this.lastName.trim().length === 0) {
      throw new Error('Last name is required');
    }
    if (!this.documentNumber || this.documentNumber.trim().length === 0) {
      throw new Error('Document number is required');
    }
    if (!this.phoneNumber || this.phoneNumber.trim().length < 8) {
      throw new Error('Valid phone number is required');
    }
    if (!this.faceVectorHash || this.faceVectorHash.length === 0) {
      throw new Error('Face vector hash is required');
    }
    if (!this.consentGiven) {
      throw new Error('Patient consent is required');
    }
    if (this.emergencyContacts.length === 0) {
      throw new Error('At least one emergency contact is required');
    }
    this.validateAge();
  }

  private validateAge(): void {
    const today = new Date();
    const age = today.getFullYear() - this.dateOfBirth.getFullYear();
    if (age < 0 || age > 150) {
      throw new Error('Invalid date of birth');
    }
  }

  getFullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  getAge(): number {
    const today = new Date();
    let age = today.getFullYear() - this.dateOfBirth.getFullYear();
    const monthDiff = today.getMonth() - this.dateOfBirth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < this.dateOfBirth.getDate())) {
      age--;
    }
    return age;
  }

  hasAllergies(): boolean {
    return this.medicalInfo.allergies.length > 0;
  }

  hasCriticalMedicalInfo(): boolean {
    return this.hasAllergies() || 
           this.medicalInfo.chronicConditions.length > 0 ||
           this.medicalInfo.medications.length > 0;
  }
}
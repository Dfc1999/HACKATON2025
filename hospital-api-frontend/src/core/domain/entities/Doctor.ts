import { UserEntity, UserRole } from './User.js';

export enum VerificationStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  SUSPENDED = 'SUSPENDED'
}

export enum MedicalSpecialty {
  GENERAL_MEDICINE = 'GENERAL_MEDICINE',
  EMERGENCY_MEDICINE = 'EMERGENCY_MEDICINE',
  CARDIOLOGY = 'CARDIOLOGY',
  NEUROLOGY = 'NEUROLOGY',
  PEDIATRICS = 'PEDIATRICS',
  SURGERY = 'SURGERY',
  NURSING = 'NURSING',
  OTHER = 'OTHER'
}

export interface Credentials {
  professionalLicenseNumber: string;
  specialty: MedicalSpecialty;
  licenseExpirationDate?: Date;
  documentImageHash?: string;
  verificationDocuments?: string[];
}

export interface Doctor {
  firstName: string;
  lastName: string;
  credentials: Credentials;
  verificationStatus: VerificationStatus;
  verifiedAt: Date | null;
verifiedBy: string | null;
rejectionReason: string | null;
}

export class DoctorEntity extends UserEntity implements Doctor {
  constructor(
    id: string,
    email: string,
    organizationId: string,
    createdAt: Date,
    isActive: boolean,
    role: UserRole.DOCTOR | UserRole.NURSE,
    public firstName: string,
    public lastName: string,
    public credentials: Credentials,
    public verificationStatus: VerificationStatus,
    public verifiedAt: Date | null,
    public verifiedBy: string | null,
    public rejectionReason: string | null,
    lastLogin?: Date
  ) {
    super(id, email, role, organizationId, createdAt, isActive, lastLogin);
    this.validateDoctorData();
  }

  private validateDoctorData(): void {
    if (!this.firstName || this.firstName.trim().length === 0) {
      throw new Error('First name is required');
    }
    if (!this.lastName || this.lastName.trim().length === 0) {
      throw new Error('Last name is required');
    }
    if (!this.credentials.professionalLicenseNumber || 
        this.credentials.professionalLicenseNumber.trim().length === 0) {
      throw new Error('Professional license number is required');
    }
    this.validateLicenseExpiration();
  }

  private validateLicenseExpiration(): void {
    if (this.credentials.licenseExpirationDate) {
      const today = new Date();
      if (this.credentials.licenseExpirationDate < today) {
        throw new Error('Professional license has expired');
      }
    }
  }

  getFullName(): string {
    return `Dr. ${this.firstName} ${this.lastName}`;
  }

  isVerified(): boolean {
    return this.verificationStatus === VerificationStatus.APPROVED;
  }

  isPending(): boolean {
    return this.verificationStatus === VerificationStatus.PENDING;
  }

  isRejected(): boolean {
    return this.verificationStatus === VerificationStatus.REJECTED;
  }

  isSuspended(): boolean {
    return this.verificationStatus === VerificationStatus.SUSPENDED;
  }

  canAccessPatientData(): boolean {
    return super.canAccessPatientData() && this.isVerified() && this.isActive;
  }

  approve(verifiedBy: string): void {
    this.verificationStatus = VerificationStatus.APPROVED;
    this.verifiedAt = new Date();
    this.verifiedBy = verifiedBy;
this.rejectionReason = null;
  }

  reject(reason: string): void {
    this.verificationStatus = VerificationStatus.REJECTED;
    this.rejectionReason = reason;
    this.verifiedAt = null;
    this.verifiedBy = null;
  }

  suspend(reason: string): void {
    this.verificationStatus = VerificationStatus.SUSPENDED;
    this.rejectionReason = reason;
  }
}
import { DoctorEntity, VerificationStatus } from '../entities/Doctor.js';
import type { Credentials } from '../entities/Doctor.jsx';
import { UserRole } from '../entities/User.js';

export interface DoctorRegistrationRequest {
  firstName: string;
  lastName: string;
  email: string;
  credentials: Credentials;
  organizationId: string;
  role: UserRole.DOCTOR | UserRole.NURSE;
}

export interface DoctorValidationData {
  documentImages: string[];
  professionalLicenseNumber: string;
  additionalInfo?: string;
}

export interface PendingDoctorRequest {
  doctorId: string;
  firstName: string;
  lastName: string;
  email: string;
  credentials: Credentials;
  requestedAt: Date;
  organizationId: string;
}

export interface DoctorApprovalData {
  doctorId: string;
  approvedBy: string;
  notes?: string;
}

export interface DoctorRejectionData {
  doctorId: string;
  rejectedBy: string;
  reason: string;
}

export interface DoctorRepository {
  requestVerification(request: DoctorRegistrationRequest): Promise<DoctorEntity>;
  
  validateCredentials(
    doctorId: string, 
    validationData: DoctorValidationData
  ): Promise<boolean>;
  
  listPending(organizationId: string): Promise<PendingDoctorRequest[]>;
  
  approve(approvalData: DoctorApprovalData): Promise<DoctorEntity>;
  
  reject(rejectionData: DoctorRejectionData): Promise<DoctorEntity>;
  
  findById(doctorId: string): Promise<DoctorEntity | null>;
  
  findByLicenseNumber(
    licenseNumber: string, 
    organizationId: string
  ): Promise<DoctorEntity | null>;
  
  updateVerificationStatus(
    doctorId: string, 
    status: VerificationStatus
  ): Promise<DoctorEntity>;
  
  listByOrganization(organizationId: string): Promise<DoctorEntity[]>;
  
  suspendDoctor(
    doctorId: string, 
    reason: string, 
    suspendedBy: string
  ): Promise<DoctorEntity>;
}
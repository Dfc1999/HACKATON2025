export enum UserRole {
  ADMINISTRATOR = 'ADMINISTRATOR',
  DOCTOR = 'DOCTOR',
  NURSE = 'NURSE',
  PATIENT = 'PATIENT'
}

export interface User {
  id: string;
  email: string;
  role: UserRole;
  organizationId: string;
  createdAt: Date;
  lastLogin?: Date | null | undefined;
  isActive: boolean;
}

export class UserEntity implements User {
  constructor(
    public id: string,
    public email: string,
    public role: UserRole,
    public organizationId: string,
    public createdAt: Date,
    public isActive: boolean,
    public lastLogin?: Date
  ) {
    this.validateEmail(email);
    this.validateId(id);
    this.validateOrganizationId(organizationId);
  }

  private validateEmail(email: string): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Invalid email format');
    }
  }

  private validateId(id: string): void {
    if (!id || id.trim().length === 0) {
      throw new Error('User ID cannot be empty');
    }
  }

  private validateOrganizationId(orgId: string): void {
    if (!orgId || orgId.trim().length === 0) {
      throw new Error('Organization ID cannot be empty');
    }
  }

  isDoctor(): boolean {
    return this.role === UserRole.DOCTOR || this.role === UserRole.NURSE;
  }

  isAdmin(): boolean {
    return this.role === UserRole.ADMINISTRATOR;
  }

  isPatient(): boolean {
    return this.role === UserRole.PATIENT;
  }

  canAccessPatientData(): boolean {
    return this.isDoctor() || this.isAdmin();
  }
}
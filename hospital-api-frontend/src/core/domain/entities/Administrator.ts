import { UserEntity, UserRole } from './User.jsx';

export enum AdminPermission {
  MANAGE_DOCTORS = 'MANAGE_DOCTORS',
  MANAGE_PATIENTS = 'MANAGE_PATIENTS',
  MANAGE_ORGANIZATION = 'MANAGE_ORGANIZATION',
  VIEW_ANALYTICS = 'VIEW_ANALYTICS',
  MANAGE_SECURITY = 'MANAGE_SECURITY',
  APPROVE_REGISTRATIONS = 'APPROVE_REGISTRATIONS',
  SYSTEM_CONFIGURATION = 'SYSTEM_CONFIGURATION'
}

export interface Administrator {
  firstName: string;
  lastName: string;
  permissions: AdminPermission[];
  canApproveRegistrations: boolean;
  canManageSecurity: boolean;
}

export class AdministratorEntity extends UserEntity implements Administrator {
  constructor(
    id: string,
    email: string,
    organizationId: string,
    createdAt: Date,
    isActive: boolean,
    public firstName: string,
    public lastName: string,
    public permissions: AdminPermission[],
    lastLogin?: Date
  ) {
    super(id, email, UserRole.ADMINISTRATOR, organizationId, createdAt, isActive, lastLogin);
    this.validateAdminData();
  }

  private validateAdminData(): void {
    if (!this.firstName || this.firstName.trim().length === 0) {
      throw new Error('First name is required');
    }
    if (!this.lastName || this.lastName.trim().length === 0) {
      throw new Error('Last name is required');
    }
    if (!this.permissions || this.permissions.length === 0) {
      throw new Error('Administrator must have at least one permission');
    }
  }

  getFullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  hasPermission(permission: AdminPermission): boolean {
    return this.permissions.includes(permission);
  }

  get canApproveRegistrations(): boolean {
    return this.hasPermission(AdminPermission.APPROVE_REGISTRATIONS) ||
           this.hasPermission(AdminPermission.MANAGE_DOCTORS);
  }

  get canManageSecurity(): boolean {
    return this.hasPermission(AdminPermission.MANAGE_SECURITY);
  }

  canManageDoctors(): boolean {
    return this.hasPermission(AdminPermission.MANAGE_DOCTORS);
  }

  canManagePatients(): boolean {
    return this.hasPermission(AdminPermission.MANAGE_PATIENTS);
  }

  canViewAnalytics(): boolean {
    return this.hasPermission(AdminPermission.VIEW_ANALYTICS);
  }

  canManageOrganization(): boolean {
    return this.hasPermission(AdminPermission.MANAGE_ORGANIZATION);
  }

  canConfigureSystem(): boolean {
    return this.hasPermission(AdminPermission.SYSTEM_CONFIGURATION);
  }

  addPermission(permission: AdminPermission): void {
    if (!this.hasPermission(permission)) {
      this.permissions.push(permission);
    }
  }

  removePermission(permission: AdminPermission): void {
    this.permissions = this.permissions.filter(p => p !== permission);
    if (this.permissions.length === 0) {
      throw new Error('Administrator must have at least one permission');
    }
  }
}
export enum OrganizationType {
  HOSPITAL = 'HOSPITAL',
  CLINIC = 'CLINIC',
  EMERGENCY_CENTER = 'EMERGENCY_CENTER',
  EVENT_VENUE = 'EVENT_VENUE',
  SPORTS_FACILITY = 'SPORTS_FACILITY',
  RESEARCH_CENTER = 'RESEARCH_CENTER'
}

export interface SecuritySettings {
  requireTwoFactorAuth: boolean;
  sessionTimeoutMinutes: number;
  maxFailedLoginAttempts: number;
  passwordExpirationDays: number;
  allowedDomains?: string[];
}

export interface DataRetentionSettings {
  temporaryDataTTLMinutes: number;
  patientDataRetentionYears: number;
  logRetentionDays: number;
  anonymizeAfterDays?: number;
}

export interface OrganizationSettings {
  security: SecuritySettings;
  dataRetention: DataRetentionSettings;
  enableFacialRecognition: boolean;
  requirePatientConsent: boolean;
  allowMultipleOrganizationAccess: boolean;
}

export interface Organization {
  id: string;
  name: string;
  type: OrganizationType;
  address: string;
  city: string;
  country: string;
  phone: string;
  email: string;
  settings: OrganizationSettings;
  isActive: boolean;
  createdAt: Date;
  licenseExpirationDate?: Date | null | undefined; 
}

export class OrganizationEntity implements Organization {
  constructor(
    public id: string,
    public name: string,
    public type: OrganizationType,
    public address: string,
    public city: string,
    public country: string,
    public phone: string,
    public email: string,
    public settings: OrganizationSettings,
    public isActive: boolean,
    public createdAt: Date,
    public licenseExpirationDate?: Date | null | undefined
  ) {
    this.validateOrganizationData();
    this.setDefaultSettings();
  }

  private validateOrganizationData(): void {
    if (!this.name || this.name.trim().length === 0) {
      throw new Error('Organization name is required');
    }
    if (!this.email || !this.isValidEmail(this.email)) {
      throw new Error('Valid organization email is required');
    }
    if (!this.phone || this.phone.trim().length < 8) {
      throw new Error('Valid phone number is required');
    }
    if (!this.address || this.address.trim().length === 0) {
      throw new Error('Organization address is required');
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private setDefaultSettings(): void {
    if (!this.settings.security) {
      this.settings.security = {
        requireTwoFactorAuth: true,
        sessionTimeoutMinutes: 20,
        maxFailedLoginAttempts: 5,
        passwordExpirationDays: 90
      };
    }
    if (!this.settings.dataRetention) {
      this.settings.dataRetention = {
        temporaryDataTTLMinutes: 20,
        patientDataRetentionYears: 10,
        logRetentionDays: 365
      };
    }
  }

  isLicenseValid(): boolean {
    if (!this.licenseExpirationDate) return true;
    return this.licenseExpirationDate > new Date();
  }

  daysUntilLicenseExpiration(): number | null {
    if (!this.licenseExpirationDate) return null;
    const today = new Date();
    const diffTime = this.licenseExpirationDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  isLicenseExpiringSoon(daysThreshold: number = 30): boolean {
    const daysUntil = this.daysUntilLicenseExpiration();
    return daysUntil !== null && daysUntil <= daysThreshold && daysUntil > 0;
  }

  canOperateFacialRecognition(): boolean {
    return this.isActive && 
           this.isLicenseValid() && 
           this.settings.enableFacialRecognition;
  }

  updateSecuritySettings(newSettings: Partial<SecuritySettings>): void {
    this.settings.security = {
      ...this.settings.security,
      ...newSettings
    };
  }

  updateDataRetentionSettings(newSettings: Partial<DataRetentionSettings>): void {
    this.settings.dataRetention = {
      ...this.settings.dataRetention,
      ...newSettings
    };
  }
}
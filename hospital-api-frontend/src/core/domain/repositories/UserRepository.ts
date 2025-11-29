import { UserEntity } from '../entities/User.jsx';

export interface AuthenticationCredentials {
  email: string;
  password: string;
  organizationId: string;
}

export interface AuthenticationResult {
  user: UserEntity;
  token: string;
  refreshToken: string;
  expiresAt: Date;
}

export interface SessionUpdate {
  userId: string;
  lastActivity: Date;
  deviceInfo?: string;
  ipAddress?: string;
}

export interface UserRepository {
  findById(id: string): Promise<UserEntity | null>;
  
  findByEmail(email: string, organizationId: string): Promise<UserEntity | null>;
  
  authenticate(credentials: AuthenticationCredentials): Promise<AuthenticationResult>;
  
  updateSession(update: SessionUpdate): Promise<void>;
  
  refreshToken(refreshToken: string): Promise<AuthenticationResult>;
  
  logout(userId: string): Promise<void>;
  
  validateToken(token: string): Promise<boolean>;
  
  updateLastLogin(userId: string): Promise<void>;
}
export interface AuthUser {
  sub: string;       // El ID del usuario en MongoDB
  email: string;
  organizationId?: string; // Puede ser undefined si aún no creó la empresa
}

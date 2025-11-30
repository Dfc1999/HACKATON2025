// src/users/user.model.ts
export interface User {
  _id?: string;
  email: string;
  password: string; // Se guardará encriptada
  name: string;
  organizationId?: string; // Se llenará cuando cree la org
}

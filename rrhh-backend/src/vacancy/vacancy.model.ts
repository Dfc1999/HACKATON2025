import { ObjectId } from 'mongodb';

export interface Vacancy {
  _id?: ObjectId;
  codigo_vacante: string;
  titulo: string;
  requisitos_texto: string;
  organizationId: string; // Para asociar la vacante a la empresa
  createdAt: Date;
  updatedAt?: Date;
  estado?: 'activa' | 'pausada' | 'cerrada'; // Estado de la vacante
}

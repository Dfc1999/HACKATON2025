import { Injectable, Inject, ConflictException } from '@nestjs/common';
import { Db } from 'mongodb';
import { Organization } from './organization.model';
import { UsersService } from '../users/users.service';

@Injectable()
export class OrganizationService {
  constructor(
    @Inject('DATABASE_CONNECTION') private db: Db,
    private usersService: UsersService
  ) {}

  // CAMBIO AQUÍ: En lugar de Partial<Organization>, definimos explícitamente los campos requeridos
  async create(data: { name: string; industry: string; description: string }, userId: string) {
    const collection = this.db.collection<Organization>('Organizations');

    // 1. Verificar si este usuario ya tiene una empresa registrada
    const existing = await collection.findOne({ ownerId: userId });
    if (existing) {
      throw new ConflictException('Este usuario ya tiene una organización registrada');
    }

    // 2. Crear la organización
    // Ahora TypeScript no se queja porque sabe que 'data.name' siempre es un string
    const newOrg: Organization = {
      name: data.name,
      industry: data.industry,
      description: data.description,
      ownerId: userId,
      createdAt: new Date(),
    };

    const result = await collection.insertOne(newOrg);
    const newOrgId = result.insertedId.toString();

    // 3. Actualizar al usuario
    await this.usersService.updateOrganization(userId, newOrgId);

    return { ...newOrg, _id: result.insertedId };
  }

  async findByOwner(userId: string) {
    return this.db.collection<Organization>('Organizations').findOne({ ownerId: userId });
  }
}

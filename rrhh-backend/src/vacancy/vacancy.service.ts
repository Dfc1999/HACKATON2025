// src/vacancy/vacancy.service.ts
import { Injectable, Inject, ConflictException, NotFoundException } from '@nestjs/common';
import { Db, ObjectId } from 'mongodb';
import { Vacancy } from './vacancy.model';

@Injectable()
export class VacancyService {
  constructor(@Inject('DATABASE_CONNECTION') private db: Db) {}

  async create(data: { codigo_vacante: string; titulo: string; requisitos_texto: string }, organizationId: string) {
    const collection = this.db.collection<Vacancy>('Vacantes');

    // Verificar si el código de vacante ya existe para esta organización
    const existing = await collection.findOne({
      codigo_vacante: data.codigo_vacante,
      organizationId
    });

    if (existing) {
      throw new ConflictException('Ya existe una vacante con este código en tu organización');
    }

    const newVacancy: Vacancy = {
      ...data,
      organizationId,
      estado: 'activa',
      createdAt: new Date(),
    };

    const result = await collection.insertOne(newVacancy);
    return { ...newVacancy, _id: result.insertedId };
  }

  async findAll(organizationId: string) {
    const collection = this.db.collection<Vacancy>('Vacantes');
    return collection.find({ organizationId }).sort({ createdAt: -1 }).toArray();
  }

  async findOne(id: string, organizationId: string) {
    const collection = this.db.collection<Vacancy>('Vacantes');
    const vacancy = await collection.findOne({
      _id: new ObjectId(id),
      organizationId
    });

    if (!vacancy) {
      throw new NotFoundException('Vacante no encontrada');
    }

    return vacancy;
  }

  async update(id: string, data: Partial<Vacancy>, organizationId: string) {
    const collection = this.db.collection<Vacancy>('Vacantes');

    // Si se intenta cambiar el código, verificar que no exista otro con ese código
    if (data.codigo_vacante) {
      const existing = await collection.findOne({
        codigo_vacante: data.codigo_vacante,
        organizationId,
        _id: { $ne: new ObjectId(id) }
      });

      if (existing) {
        throw new ConflictException('Ya existe otra vacante con este código');
      }
    }

    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(id), organizationId },
      { $set: { ...data, updatedAt: new Date() } },
      { returnDocument: 'after' }
    );

    if (!result) {
      throw new NotFoundException('Vacante no encontrada');
    }

    return result;
  }

  async delete(id: string, organizationId: string) {
    const collection = this.db.collection<Vacancy>('Vacantes');
    const result = await collection.deleteOne({
      _id: new ObjectId(id),
      organizationId
    });

    if (result.deletedCount === 0) {
      throw new NotFoundException('Vacante no encontrada');
    }

    return { message: 'Vacante eliminada exitosamente' };
  }

  async updateStatus(id: string, estado: 'activa' | 'pausada' | 'cerrada', organizationId: string) {
    const collection = this.db.collection<Vacancy>('Vacantes');
    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(id), organizationId },
      { $set: { estado, updatedAt: new Date() } },
      { returnDocument: 'after' }
    );

    if (!result) {
      throw new NotFoundException('Vacante no encontrada');
    }

    return result;
  }
}

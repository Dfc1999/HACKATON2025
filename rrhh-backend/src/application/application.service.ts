import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Db, ObjectId } from 'mongodb';
import { ApplicationTracking } from './application.model';

@Injectable()
export class ApplicationService {
  constructor(@Inject('DATABASE_CONNECTION') private db: Db) {}

  // Crear nueva postulación
  async create(data: { email: string; nombre: string; vacante_codigo: string }) {
    const collection = this.db.collection<ApplicationTracking>('Postulaciones');

    const newApplication: ApplicationTracking = {
      ...data,
      estado: 'enviado',
      cv_enviado: true,
      fecha_envio: new Date(),
      fecha_actualizacion: new Date(),
      timeline: [
        {
          fecha: new Date(),
          estado: 'enviado',
          mensaje: 'CV enviado correctamente',
          detalles: `Tu postulación para ${data.vacante_codigo} ha sido recibida. Te notificaremos cuando sea procesada.`
        }
      ]
    };

    const result = await collection.insertOne(newApplication);
    return { ...newApplication, _id: result.insertedId };
  }

  // Actualizar estado desde Logic Apps
  async updateFromWebhook(data: {
    email: string;
    vacante_codigo: string;
    estado: string;
    mensaje: string;
    detalles?: string;
  }) {
    const collection = this.db.collection<ApplicationTracking>('Postulaciones');

    let codigoLimpio = data.vacante_codigo;

    if (codigoLimpio.includes(' - ')) {
        const partes = codigoLimpio.split(' - ');
        codigoLimpio = partes[1] || partes[0];
    }

    codigoLimpio = codigoLimpio
        .replace(/^(RE:|RV:|FW:|CV:)\s*/i, '')
        .trim();

    console.log(`📋 Código original: "${data.vacante_codigo}"`);
    console.log(`📋 Código limpio: "${codigoLimpio}"`);

    const application = await collection.findOne({
      email: data.email,
      vacante_codigo: codigoLimpio
    });

    if (!application) {
      throw new NotFoundException('Postulación no encontrada');
    }

    const nuevoEvento = {
      fecha: new Date(),
      estado: data.estado,
      mensaje: data.mensaje,
      detalles: data.detalles
    };

    await collection.updateOne(
      { _id: application._id },
      {
        $set: {
          estado: data.estado as any,
          fecha_actualizacion: new Date()
        },
        $push: { timeline: nuevoEvento }
      }
    );

    return { success: true, message: 'Estado actualizado' };
  }

  // Obtener tracking por email
  async getByEmail(email: string) {
    const collection = this.db.collection<ApplicationTracking>('Postulaciones');
    return collection
      .find({ email })
      .sort({ fecha_envio: -1 })
      .toArray();
  }

  // Obtener una postulación específica
  async getOne(email: string, vacante_codigo: string) {
    const collection = this.db.collection<ApplicationTracking>('Postulaciones');
    const application = await collection.findOne({
      email,
      vacante_codigo
    });

    if (!application) {
      throw new NotFoundException('Postulación no encontrada');
    }

    return application;
  }

  // Marcar como en examen (cuando el candidato inicia la prueba)
  async markAsInExam(email: string) {
    const collection = this.db.collection<ApplicationTracking>('Postulaciones');

    const nuevoEvento = {
      fecha: new Date(),
      estado: 'en_examen',
      mensaje: 'Evaluación técnica iniciada',
      detalles: 'El candidato ha comenzado su prueba técnica'
    };

    await collection.updateOne(
      { email },
      {
        $set: {
          estado: 'en_examen',
          fecha_actualizacion: new Date()
        },
        $push: { timeline: nuevoEvento }
      }
    );
  }

  // Finalizar con resultado
  async finalizeWithResult(email: string, resultado: { aprobado: boolean; nota?: number; feedback?: string }) {
    const collection = this.db.collection<ApplicationTracking>('Postulaciones');

    const nuevoEvento = {
      fecha: new Date(),
      estado: 'finalizado',
      mensaje: resultado.aprobado ? '✅ Proceso completado - APROBADO' : '❌ Proceso completado - NO APROBADO',
      detalles: resultado.feedback
    };

    await collection.updateOne(
      { email },
      {
        $set: {
          estado: 'finalizado',
          resultado,
          fecha_actualizacion: new Date()
        },
        $push: { timeline: nuevoEvento }
      }
    );
  }
}

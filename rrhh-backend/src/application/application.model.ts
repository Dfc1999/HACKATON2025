import { ObjectId } from 'mongodb';

export interface ApplicationTracking {
  _id?: ObjectId;
  email: string;
  nombre: string;
  vacante_codigo: string;
  vacante_titulo?: string;

  estado: 'enviado' | 'recibido' | 'procesando_cv' | 'evaluando_ia' | 'aprobado' | 'rechazado' | 'en_examen' | 'finalizado';

  timeline: {
    fecha: Date;
    estado: string;
    mensaje: string;
    detalles?: string;
  }[];

  cv_enviado: boolean;
  fecha_envio: Date;
  fecha_actualizacion: Date;

  resultado?: {
    aprobado: boolean;
    nota?: number;
    feedback?: string;
  };
}

import { ObjectId } from 'mongodb';

export interface EvaluacionTecnica {
  _id?: ObjectId;

  candidatoId: ObjectId;
  email: string;

  examen_generado: {
    seccion_conocimiento: {
       id: number;
       pregunta: string;
       opciones: string[];
       correcta_index: number;
    }[];
    seccion_aprendizaje: {
       id: number;
       pregunta: string;
       opciones: string[];
       correcta_index: number;
    }[];
  };

  respuestas_candidato?: {
    conocimiento: number[];
    aprendizaje: number[];
  };

  resultado?: {
    nota: number;
    estado: string;        // "Aprobado_Tecnico", "Rechazado_Tecnico", "Rechazado_Fraude"
    feedback: string;
    motivo_fraude?: string;
  };

  // Tiempos
  fecha_inicio: Date;
  fecha_fin?: Date;
}

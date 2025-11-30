import { ObjectId } from 'mongodb';

export interface Candidato {
  _id?: string | ObjectId;
  nombre: string;
  email: string;

  // 👇 Estructura estricta original
  perfil_tecnico: {
    resumen_perfil: string;
    experiencia_anios: number;
    ingles: string;
    razon_aprobacion: string;
    "url-cv": string;
  };

  detalles_avanzados: {
    historial_laboral_completo: {
      cargo: string;
      empresa: string;
      periodo: string;
      responsabilidades_clave: string;
    }[]; // 👈 Array tipado correctamente
    skills_detectadas: {
      tecnicas: string[];
      blandas: string[];
    };
  };

  referencias: {
    nombre: string;
    cargo: string;
    empresa: string;
    contacto: string;
  }[]; // 👈 Array tipado correctamente

  estado: string; // Ej: "Aprobado_Fase1", "En_Prueba_Tecnica"
}

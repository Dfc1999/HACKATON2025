export interface Opcion {
  id: string;
  texto: string;
}

export interface Pregunta {
  id: number;
  texto: string;
  opciones: string[];
  correcta: number;
}

export interface CasoPractico {
  titulo: string;
  descripcion: string;
}

export interface ExamenResponse {
  candidato: string;
  perfil: any;
  examen: {
    preguntas: Pregunta[];
    caso?: CasoPractico;
  };
}

// Esquema del agente de reconocimiento de caras para MongoDB Atlas
// Define la estructura de los documentos en la colección "agente_reconocimiento_caras"

export const agenteReconocimientoSchema = {
  nombre: { type: "string", required: true },
  apellido: { type: "string", required: true },
  direccion: { type: "string", required: true },
  numero: { type: "string", required: true },
  referencia_nombre: { type: "string", required: true },
  referencia_numero: { type: "string", required: true },
  vectores: { type: "array", required: true }, // Representación de la foto en vectores
  datos_medicos: {
    type: "object",
    required: false,
    properties: {
      tipo_sangre: { type: "string" },
      alergias: { type: "string" },
      otros: { type: "string" }
    }
  },
  enfermedades_base: { type: "array", required: false },
  createdAt: { type: "date", default: new Date() }
};
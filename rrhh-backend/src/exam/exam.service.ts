import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { Db, ObjectId } from 'mongodb';
import axios from 'axios';
import { Candidato } from 'src/candidate/candidate.model';
import { EvaluacionTecnica } from './technical-exam.model';

@Injectable()
export class ExamService {
  private openAiEndpoint = process.env.AZURE_OPENAI_ENDPOINT;
  private openAiKey = process.env.AZURE_OPENAI_KEY;
  private deployment = process.env.AZURE_OPENAI_DEPLOYMENT;

  constructor(@Inject('DATABASE_CONNECTION') private db: Db) {}

  // ==========================================
  // 1. GENERAR EXAMEN (O RECUPERAR)
  // ==========================================
  async generateExam(email: string) {
    // A. Buscar al candidato (Solo lectura)
    const candidato = await this.db.collection<Candidato>('Candidatos').findOne({ email });
    if (!candidato) {
        throw new HttpException('Candidato no encontrado', HttpStatus.NOT_FOUND);
    }

    // B. Verificar si YA tiene una evaluación creada en la otra colección
    const evaluacionExistente = await this.db.collection<EvaluacionTecnica>('EvaluacionesTecnicas')
      .findOne({ email: email });

    // Si ya existe y NO ha terminado, devolvemos el examen existente (Resume)
    if (evaluacionExistente) {
        // Si ya tiene resultado, significa que ya terminó. No permitimos entrar de nuevo.
        if (evaluacionExistente.resultado) {
             throw new HttpException('El candidato ya finalizó su prueba.', HttpStatus.CONFLICT);
        }

        // Devolvemos el examen existente (Sanitizado sin respuestas correctas)
        return {
            examenId: evaluacionExistente._id,
            candidato: candidato.nombre,
            data: this.sanitizeExamForFrontend(evaluacionExistente.examen_generado),
            recuperado: true
        };
    }

    // C. Si no existe, generamos uno nuevo con IA
    // Buscamos la vacante (Hardcoded para el ejemplo, pero podrías buscarla dinámicamente)
    const vacante = await this.db.collection('Vacantes').findOne({ codigo_vacante: 'TEST-JAVA' });

    // 👇 VALIDACIÓN CRÍTICA PARA TYPESCRIPT (Fix 'possibly null')
    if (!vacante) {
        throw new HttpException('Error Interno: La vacante configurada no existe.', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    // Extraemos datos del candidato según TU estructura exacta
    const { resumen_perfil, experiencia_anios } = candidato.perfil_tecnico;

    // Obtenemos las skills uniéndolas por comas (Manejo seguro si el array viniera vacío)
    const skills = candidato.detalles_avanzados?.skills_detectadas?.tecnicas?.join(', ') || "Tecnologías generales";

    // Prompt optimizado para 2 secciones
    const prompt = `
      Eres un Reclutador Técnico Experto.

      PERFIL DEL CANDIDATO:
      - Nombre: ${candidato.nombre}
      - Experiencia: ${experiencia_anios} años
      - Stack Actual: ${skills}

      VACANTE A CUBRIR:
      - Título: ${vacante.titulo}
      - Requisitos: ${vacante.requisitos_texto}

      TU TAREA:
      Genera un examen técnico JSON con exactamente dos secciones:
      1. "seccion_conocimiento" (5 preguntas): Basadas en lo que el candidato YA SABE (${skills}). Objetivo: Validar veracidad del CV.
      2. "seccion_aprendizaje" (5 preguntas): Basadas en los REQUISITOS DE LA VACANTE que quizás no domine. Objetivo: Medir lógica y potencial de aprendizaje.

      REGLAS DE FORMATO:
      - Devuelve SOLO un JSON válido.
      - Cada pregunta debe tener: "id", "pregunta", "opciones" (Array de 4 strings), "correcta_index" (número 0-3).

      ESTRUCTURA JSON:
      {
        "seccion_conocimiento": [{ "id": 1, "pregunta": "...", "opciones": ["A", "B", "C", "D"], "correcta_index": 0 }],
        "seccion_aprendizaje": [{ "id": 6, "pregunta": "...", "opciones": ["A", "B", "C", "D"], "correcta_index": 2 }]
      }
    `;

    const generatedJson = await this.callOpenAI(prompt);

    // D. Guardar en la NUEVA colección 'EvaluacionesTecnicas'
    const nuevaEvaluacion: EvaluacionTecnica = {
        candidatoId: new ObjectId(candidato._id), // Aseguramos que sea ObjectId
        email: candidato.email,
        examen_generado: generatedJson,
        fecha_inicio: new Date()
    };

    const result = await this.db.collection('EvaluacionesTecnicas').insertOne(nuevaEvaluacion);

    // E. Actualizar estado del candidato en su colección original (Trazabilidad)
    await this.db.collection('Candidatos').updateOne(
        { _id: new ObjectId(candidato._id) },
        { $set: { estado: 'En_Prueba_Tecnica' } }
    );

    return {
      examenId: result.insertedId,
      candidato: candidato.nombre,
      data: this.sanitizeExamForFrontend(generatedJson)
    };
  }

  // ==========================================
  // 2. EVALUAR Y GUARDAR RESULTADOS
  // ==========================================
  async submitExam(email: string, respuestasUsuario: any, motivoFraude?: string) {
    // Buscamos la evaluación activa en la colección nueva
    const evaluacion = await this.db.collection<EvaluacionTecnica>('EvaluacionesTecnicas')
        .findOne({ email });

    if (!evaluacion) {
        throw new HttpException('No se encontró evaluación activa para este correo', HttpStatus.NOT_FOUND);
    }

    let notaFinal = 0;
    let estadoFinal = "Desconocido";
    let feedbackIA = "";

    // CASO 1: FRAUDE DETECTADO
    if (motivoFraude) {
        notaFinal = 0;
        estadoFinal = "Rechazado_Fraude";
        feedbackIA = `El sistema de proctoring detectó una infracción grave: ${motivoFraude}. El examen fue anulado automáticamente.`;
    }
    // CASO 2: EVALUACIÓN NORMAL
    else {
        let aciertos = 0;
        let total = 0;
        const examen = evaluacion.examen_generado;

        // Evaluar Conocimiento
        examen.seccion_conocimiento.forEach((p: any, i: number) => {
            total++;
            if (respuestasUsuario.conocimiento[i] === p.correcta_index) aciertos++;
        });

        // Evaluar Aprendizaje
        examen.seccion_aprendizaje.forEach((p: any, i: number) => {
            total++;
            if (respuestasUsuario.aprendizaje[i] === p.correcta_index) aciertos++;
        });

        notaFinal = Math.round((aciertos / total) * 100);

        // Regla de Negocio: >= 70 aprueba
        estadoFinal = notaFinal >= 70 ? "Aprobado_Tecnico" : "Rechazado_Tecnico";

        // Generar Feedback cualitativo con IA
        const promptFeedback = `
           El candidato obtuvo ${notaFinal}/100 en su evaluación técnica.
           Estado: ${estadoFinal}.
           Genera un resumen ejecutivo de 2 líneas para el reclutador indicando si el candidato cumple con el perfil técnico esperado.
        `;
        feedbackIA = await this.callOpenAI(promptFeedback, true);
    }

    // 3. ACTUALIZAR COLECCIÓN DE EVALUACIONES (Guardar histórico detallado)
    await this.db.collection('EvaluacionesTecnicas').updateOne(
        { _id: evaluacion._id },
        {
            $set: {
                resultado: {
                    nota: notaFinal,
                    estado: estadoFinal,
                    feedback: feedbackIA,
                    motivo_fraude: motivoFraude || null
                },
                respuestas_candidato: respuestasUsuario,
                fecha_fin: new Date()
            }
        }
    );

    // 4. ACTUALIZAR ESTADO EN COLECCIÓN DE CANDIDATOS (Para el dashboard general)
    await this.db.collection('Candidatos').updateOne(
        { email },
        { $set: { estado: estadoFinal } }
    );

    return {
        nota: notaFinal,
        estado: estadoFinal,
        feedback: feedbackIA,
        mensaje: motivoFraude
    };
  }

  // ==========================================
  // MÉTODOS PRIVADOS (Helpers)
  // ==========================================

  // Limpia el JSON para que el frontend no reciba las respuestas correctas
  private sanitizeExamForFrontend(jsonOriginal: any) {
      const copy = JSON.parse(JSON.stringify(jsonOriginal));
      if(copy.seccion_conocimiento) {
          copy.seccion_conocimiento.forEach((p: any) => delete p.correcta_index);
      }
      if(copy.seccion_aprendizaje) {
          copy.seccion_aprendizaje.forEach((p: any) => delete p.correcta_index);
      }
      return copy;
  }

  // Llamada centralizada a OpenAI
  private async callOpenAI(prompt: string, textOnly = false): Promise<any> {
    try {
      const url = `${this.openAiEndpoint}/openai/deployments/${this.deployment}/chat/completions?api-version=2024-02-15-preview`;

      const response = await axios.post(url, {
        messages: [
          { role: 'system', content: 'Eres un sistema experto en evaluación técnica de RRHH.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3,
        max_tokens: 2000
      }, { headers: { 'api-key': this.openAiKey } });

      const content = response.data.choices[0].message.content;

      if (textOnly) return content;

      // Limpieza de Markdown si la IA responde con bloques de código
      const cleanJson = content.replace(/```json|```/g, '').trim();
      return JSON.parse(cleanJson);

    } catch (e) {
       console.error("Error en OpenAI Service:", e.response?.data || e.message);
       throw new HttpException('Error generando contenido con IA', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}

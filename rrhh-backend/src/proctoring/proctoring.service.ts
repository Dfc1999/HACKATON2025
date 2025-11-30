import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class ProctoringService {
  private visionUrl = process.env.AZURE_VISION_ENDPOINT;
  private visionKey = process.env.AZURE_VISION_KEY;

  async analyzeFrame(imageBase64: string) {
    console.log("🔍 [Proctoring] Iniciando análisis de frame...");

    try {
      // Limpieza del Base64
      const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");
      const buffer = Buffer.from(base64Data, 'base64');

      console.log(`📊 [Proctoring] Tamaño de imagen: ${(buffer.length / 1024).toFixed(2)} KB`);

      const url = `${this.visionUrl}/computervision/imageanalysis:analyze?api-version=2024-02-01&features=people,objects,tags`;

      console.log(`📡 [Proctoring] Enviando a Azure Vision: ${this.visionUrl}`);

      const response = await axios.post(url, buffer, {
        headers: {
          'Ocp-Apim-Subscription-Key': this.visionKey,
          'Content-Type': 'application/octet-stream'
        },
        timeout: 15000 // Timeout de 15 segundos
      });

      console.log("✅ [Proctoring] Respuesta recibida de Azure");

      // Extraer datos
      const allObjects = response.data.objectsResult?.values || [];
      const allTags = response.data.tagsResult?.values || [];
      const rawPeople = response.data.peopleResult?.values || [];

      // Logs de depuración detallados
      console.log("👥 [Proctoring] Personas detectadas (raw):", rawPeople.length);
      console.log("📦 [Proctoring] Objetos detectados:", allObjects.length);
      console.log("🏷️ [Proctoring] Tags detectados:", allTags.length);

      // ⬅️ AJUSTE: Confianza mínima más razonable
      const MIN_CONFIDENCE = 0.65; // 50% de confianza

      // Filtrar personas con confianza suficiente
      const people = rawPeople.filter((p: any) => {
        const confidence = p.confidence || 0;
        console.log(`  👤 Persona detectada con confianza: ${(confidence * 100).toFixed(1)}%`);
        return confidence > MIN_CONFIDENCE;
      });

      // Detectar teléfonos con múltiples términos
      const phoneKeywords = [
        'cell phone',
        'mobile phone',
        'telephone',
        'smartphone',
        'electronic device',
        'phone'
      ];

      const phones = allObjects.filter((o: any) =>
        o.tags.some((t: any) => {
          const isPhone = phoneKeywords.some(keyword =>
            t.name.toLowerCase().includes(keyword)
          );
          const meetsConfidence = t.confidence > MIN_CONFIDENCE;

          if (isPhone && meetsConfidence) {
            console.log(`  📱 Teléfono detectado: ${t.name} (${(t.confidence * 100).toFixed(1)}%)`);
          }

          return isPhone && meetsConfidence;
        })
      );

      // También verificar en tags
      const phoneTags = allTags.filter((t: any) => {
        const isPhone = phoneKeywords.some(keyword =>
          t.name.toLowerCase().includes(keyword)
        );
        const meetsConfidence = t.confidence > MIN_CONFIDENCE;

        if (isPhone && meetsConfidence) {
          console.log(`  📱 Tag de teléfono: ${t.name} (${(t.confidence * 100).toFixed(1)}%)`);
        }

        return isPhone && meetsConfidence;
      });

      let fraud = false;
      let reason: string | null = null;

      // REGLAS DE FRAUDE
      if (people.length === 0) {
        console.warn("⚠️ [Proctoring] FRAUDE: No se detectó ningún rostro");
        fraud = true;
        reason = "Rostro no detectado. Asegúrate de estar frente a la cámara.";
      }
      else if (people.length > 1) {
        console.warn(`⚠️ [Proctoring] FRAUDE: Múltiples personas (${people.length})`);
        fraud = true;
        reason = `Múltiples personas detectadas (${people.length}). Solo debe estar el candidato.`;
      }
      else if (phones.length > 0 || phoneTags.length > 0) {
        console.warn("⚠️ [Proctoring] FRAUDE: Dispositivo móvil detectado");
        fraud = true;
        reason = "Dispositivo móvil detectado. No se permiten celulares durante la evaluación.";
      }
      else {
        console.log("✅ [Proctoring] Todo normal - Sin fraude detectado");
      }

      // Preparar datos de debug para el frontend
      const debugObjects = allObjects.map((o: any) =>
        `${o.tags[0]?.name || 'unknown'} (${Math.round((o.tags[0]?.confidence || 0) * 100)}%)`
      );

      const debugTags = allTags
        .filter((t: any) => t.confidence > 0.5)
        .slice(0, 5)
        .map((t: any) => `${t.name} (${Math.round(t.confidence * 100)}%)`);

      return {
        fraud,
        reason,
        debug: {
          peopleCount: people.length,
          objects: debugObjects.length > 0 ? debugObjects : ['Ninguno relevante'],
          topTags: debugTags,
          timestamp: new Date().toISOString()
        }
      };

    } catch (error) {
      console.error("❌ [Proctoring] ERROR:", error);

      const errMsg = axios.isAxiosError(error)
        ? JSON.stringify(error.response?.data || error.message)
        : (error as Error).message;

      console.error("📋 [Proctoring] Detalles del error:", errMsg);

      // ⬅️ IMPORTANTE: En caso de error, NO declarar fraude automáticamente
      // Esto evita falsos positivos por problemas de conexión
      return {
        fraud: false,
        reason: null,
        error: "Error temporal en el análisis. Reintentando...",
        debug: {
          error: errMsg,
          timestamp: new Date().toISOString()
        }
      };
    }
  }
}

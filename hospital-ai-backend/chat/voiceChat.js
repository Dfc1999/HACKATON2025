// Azure Function para chat de voz usando Azure VoiceLive SDK
// Adaptación del asistente de voz original a JavaScript

import { AzureKeyCredential } from "@azure/core-auth";
import { connect } from "@azure/ai-voicelive";
import dotenv from "dotenv";
import { Readable } from "stream";
import { Buffer } from "buffer";
import pyaudio from "naudiodon"; // alternativa Node.js para audio
import { ServerEventType, RequestSession, ServerVad, AzureStandardVoice, Modality, AudioFormat } from "@azure/ai-voicelive";

dotenv.config();

export async function voiceChat(context, req) {
  context.log("Iniciando chat de voz con Azure VoiceLive...");

  const apiKey = process.env.AZURE_VOICELIVE_API_KEY;
  const endpoint = process.env.AZURE_VOICELIVE_ENDPOINT || "wss://api.voicelive.com/v1";
  const model = process.env.VOICELIVE_MODEL || "gpt-4o-realtime-preview";
  const voice = process.env.VOICELIVE_VOICE || "en-US-AvaNeural";
  const instructions =
    process.env.VOICELIVE_INSTRUCTIONS ||
    "Eres un asistente de voz útil y conversacional. Responde de forma natural y concisa.";

  if (!apiKey) {
    context.res = {
      status: 400,
      body: "Falta la clave de API de Azure VoiceLive.",
    };
    return;
  }

  try {
    const credential = new AzureKeyCredential(apiKey);
    const connection = await connect(endpoint, credential, model, {
      max_msg_size: 10 * 1024 * 1024,
      heartbeat: 20,
      timeout: 20,
    });

    context.log("Conectado a Azure VoiceLive.");

    // Configurar sesión
    const voiceConfig = new AzureStandardVoice({ name: voice, type: "azure-standard" });
    const turnDetection = new ServerVad({ threshold: 0.5, prefix_padding_ms: 300, silence_duration_ms: 500 });

    const sessionConfig = new RequestSession({
      modalities: [Modality.TEXT, Modality.AUDIO],
      instructions,
      voice: voiceConfig,
      input_audio_format: AudioFormat.PCM16,
      output_audio_format: AudioFormat.PCM16,
      turn_detection: turnDetection,
    });

    await connection.session.update({ session: sessionConfig });
    context.log("Sesión configurada correctamente.");

    // Captura de audio desde micrófono
    const ai = pyaudio.AudioIO({
      inOptions: {
        channelCount: 1,
        sampleFormat: pyaudio.SampleFormat16Bit,
        sampleRate: 24000,
        deviceId: -1,
      },
    });

    ai.start();

    ai.on("data", async (chunk) => {
      const audioBase64 = Buffer.from(chunk).toString("base64");
      await connection.input_audio_buffer.append({ audio: audioBase64 });
    });

    // Procesar eventos del servidor
    for await (const event of connection) {
      switch (event.type) {
        case ServerEventType.SESSION_UPDATED:
          context.log("Sesión lista para conversación.");
          break;
        case ServerEventType.RESPONSE_AUDIO_DELTA:
          const audioData = Buffer.from(event.delta, "base64");
          const playback = pyaudio.AudioIO({
            outOptions: {
              channelCount: 1,
              sampleFormat: pyaudio.SampleFormat16Bit,
              sampleRate: 24000,
              deviceId: -1,
            },
          });
          playback.start();
          playback.write(audioData);
          break;
        case ServerEventType.RESPONSE_DONE:
          context.log("Respuesta completada.");
          break;
        case ServerEventType.ERROR:
          context.log(`Error: ${event.error.message}`);
          break;
        default:
          context.log(`Evento no manejado: ${event.type}`);
      }
    }

    context.res = {
      status: 200,
      body: "Chat de voz iniciado correctamente.",
    };
  } catch (error) {
    context.log.error("Error en chat de voz:", error);
    context.res = {
      status: 500,
      body: `Error al iniciar chat de voz: ${error.message}`,
    };
  }
}
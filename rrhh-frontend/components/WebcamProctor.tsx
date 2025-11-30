"use client";

import React, { useRef, useEffect, useState } from "react";
import Webcam from "react-webcam";
import axios from "axios";

interface ProctorProps {
  onFraud: (reason: string) => void;
}

export default function WebcamProctor({ onFraud }: ProctorProps) {
  const webcamRef = useRef<Webcam>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Estados para la UI
  const [status, setStatus] = useState("🔄 Inicializando...");
  const [statusColor, setStatusColor] = useState("bg-blue-600");
  const [lastCheck, setLastCheck] = useState<string>("---");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [captureCount, setCaptureCount] = useState(0);

  // Estado para depuración
  const [debugData, setDebugData] = useState<string>("Esperando inicialización...");
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  console.log("🎬 WebcamProctor component rendered");

  // Callback cuando la cámara está lista
  const handleUserMedia = () => {
    console.log("✅✅✅ CÁMARA LISTA Y FUNCIONANDO ✅✅✅");
    setCameraReady(true);
    setStatus("🟢 Cámara activada - Esperando primer análisis");
    setStatusColor("bg-green-600");
    setDebugData("Cámara activada correctamente. Primer análisis en 5 segundos...");
  };

  // Callback cuando hay error de cámara
  const handleUserMediaError = (error: any) => {
    console.error("❌❌❌ ERROR DE CÁMARA:", error);
    setStatus("🔴 Error: Permiso denegado");
    setStatusColor("bg-red-800");
    setDebugData(`ERROR: ${error.name || error.message || 'Permiso denegado'}`);
  };

  // Función de análisis separada para mejor control
  const analyzeFrame = async () => {
    const captureNum = captureCount + 1;
    setCaptureCount(captureNum);

    console.log(`\n🎯 ===== INICIO ANÁLISIS #${captureNum} =====`);
    console.log(`⏰ Hora: ${new Date().toLocaleTimeString()}`);

    // 1. Verificar referencia de webcam
    if (!webcamRef.current) {
      console.error("❌ webcamRef.current es NULL");
      setDebugData("❌ Error: Referencia de cámara perdida");
      return;
    }
    console.log("✅ webcamRef.current existe");

    // 2. Intentar capturar screenshot
    let imageSrc: string | null = null;
    try {
      imageSrc = webcamRef.current.getScreenshot();
      console.log("📸 getScreenshot() ejecutado");
    } catch (err) {
      console.error("❌ Error en getScreenshot():", err);
      setDebugData("❌ Error capturando imagen");
      return;
    }

    if (!imageSrc) {
      console.error("❌ imageSrc es NULL - La cámara no devolvió imagen");
      setStatus("🔴 CÁMARA SIN IMAGEN");
      setStatusColor("bg-red-800");
      setDebugData("❌ No se pudo obtener frame (¿Cámara bloqueada?)");
      return;
    }

    const imageSize = (imageSrc.length / 1024).toFixed(2);
    console.log(`✅ Screenshot capturado: ${imageSize} KB`);

    const horaActual = new Date().toLocaleTimeString();
    setLastCheck(horaActual);

    // 3. Preparar envío al backend
    try {
      setIsAnalyzing(true);
      setStatus("📡 Analizando con IA...");
      setStatusColor("bg-yellow-500");

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const endpoint = `${apiUrl}/proctoring/analyze`;

      console.log(`📡 Enviando POST a: ${endpoint}`);
      console.log(`📦 Payload size: ${imageSize} KB`);

      const startTime = Date.now();

      const response = await axios.post(endpoint, {
        image: imageSrc
      }, {
        timeout: 20000,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const duration = Date.now() - startTime;
      console.log(`✅ Respuesta recibida en ${duration}ms`);
      console.log("📊 Data recibida:", JSON.stringify(response.data, null, 2));

      const data = response.data;

      // Actualizar debug info
      if (data.debug) {
        const debugInfo = `
Análisis #${captureNum} completado
Personas: ${data.debug.peopleCount}
Objetos: ${data.debug.objects?.join(', ') || 'Ninguno'}
Tags: ${data.debug.topTags?.join(', ') || 'N/A'}
        `.trim();
        setDebugData(debugInfo);
        console.log("🔍 Debug actualizado:", debugInfo);
      }

      // Verificar fraude
      if (data.fraud) {
        console.warn("🚨🚨🚨 FRAUDE DETECTADO:", data.reason);
        setStatus("⚠️ FRAUDE DETECTADO");
        setStatusColor("bg-red-600");
        setAlertMessage(data.reason || "Comportamiento sospechoso detectado");

        // Detener el intervalo
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          console.log("⛔ Intervalo detenido por fraude");
        }

        // Notificar después de 2 segundos
        setTimeout(() => {
          console.log("🚨 Ejecutando callback onFraud");
          onFraud(data.reason);
        }, 2000);

      } else {
        console.log("✅ Sin fraude - Todo normal");
        setStatus(`🟢 Vigilancia Activa (${captureNum} análisis)`);
        setStatusColor("bg-green-600");
        setAlertMessage(null);
      }

    } catch (error: any) {
      console.error("❌❌❌ ERROR EN ANÁLISIS:", error);

      let errorMsg = "Error desconocido";

      if (axios.isAxiosError(error)) {
        console.error("🔍 Es un error de Axios");
        console.error("   - Code:", error.code);
        console.error("   - Message:", error.message);
        console.error("   - Response:", error.response?.data);

        if (error.code === 'ECONNABORTED') {
          errorMsg = "⏱️ Timeout - Azure no respondió";
        } else if (error.code === 'ERR_NETWORK') {
          errorMsg = "🌐 Error de red - Backend no responde en puerto 3001";
        } else if (error.code === 'ECONNREFUSED') {
          errorMsg = "🔌 Conexión rechazada - ¿Backend corriendo?";
        } else if (error.response) {
          errorMsg = `HTTP ${error.response.status}: ${error.response.statusText}`;
        } else {
          errorMsg = error.message;
        }
      } else {
        console.error("🔍 Error NO es de Axios:", error);
        errorMsg = error.message || error.toString();
      }

      setStatus("⚠️ Error de Conexión");
      setStatusColor("bg-orange-600");
      setDebugData(`❌ ${errorMsg}`);

    } finally {
      setIsAnalyzing(false);
      console.log(`🏁 ===== FIN ANÁLISIS #${captureNum} =====\n`);
    }
  };

  // Effect principal
  useEffect(() => {
    console.log(`\n🔄 useEffect ejecutado - cameraReady: ${cameraReady}`);

    if (!cameraReady) {
      console.log("⏳ Esperando que cameraReady sea true...");
      return;
    }

    console.log("🚀🚀🚀 INICIANDO SISTEMA DE PROCTORING 🚀🚀🚀");
    console.log("⏱️  Intervalo: cada 5 segundos");
    console.log("📹 Resolución: 640x480");

    // Primer análisis inmediato para testing
    console.log("🎬 Ejecutando primer análisis INMEDIATAMENTE...");
    analyzeFrame();

    // Luego cada 5 segundos
    intervalRef.current = setInterval(() => {
      console.log("\n⏰ Timer activado - Ejecutando analyzeFrame()");
      analyzeFrame();
    }, 5000);

    console.log("✅ Intervalo configurado con ID:", intervalRef.current);

    // Cleanup
    return () => {
      console.log("🛑 Limpieza: Deteniendo intervalo");
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [cameraReady]); // Solo depende de cameraReady

  return (
    <div className="flex flex-col items-center w-full">
      {/* Marco de la Cámara */}
      <div className={`relative border-4 rounded-lg overflow-hidden shadow-lg bg-black w-full max-w-xs transition-colors duration-300
          ${status.includes("FRAUDE") || status.includes("Error") ? "border-red-600 shadow-red-500/50" : "border-blue-600"}`}>

        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          videoConstraints={{
            width: 640,
            height: 480,
            facingMode: "user"
          }}
          className="w-full opacity-90"
          onUserMedia={handleUserMedia}
          onUserMediaError={handleUserMediaError}
          mirrored={true}
        />

        {/* Badge de Estado */}
        <div className={`absolute top-0 left-0 w-full text-center text-xs font-bold p-2 text-white transition-colors duration-500 ${statusColor}`}>
          {status}
        </div>

        {/* Indicador de Análisis */}
        {isAnalyzing && (
          <div className="absolute bottom-0 left-0 w-full bg-black/70 text-white text-[10px] text-center p-1 animate-pulse">
            📡 Analizando con Azure Vision...
          </div>
        )}

        {/* Contador de capturas */}
        <div className="absolute bottom-0 right-0 bg-black/50 text-white text-[10px] px-2 py-1 m-1 rounded">
          📸 {captureCount}
        </div>
      </div>

      {/* Alerta de Fraude */}
      {alertMessage && (
        <div className="mt-3 w-full bg-red-100 border-l-4 border-red-600 text-red-700 p-3 rounded shadow-md animate-pulse">
          <p className="font-bold text-sm">⛔ ALERTA DE SEGURIDAD</p>
          <p className="text-xs mt-1">{alertMessage}</p>
        </div>
      )}

      {/* Panel de Debug */}
      <div className="mt-3 w-full bg-gray-100 p-2 rounded border border-gray-300 text-xs text-gray-700">
        <div className="flex justify-between mb-1">
          <span className="font-bold">Estado cámara:</span>
          <span className={cameraReady ? "text-green-600" : "text-orange-600"}>
            {cameraReady ? "✅ Lista" : "⏳ Inicializando"}
          </span>
        </div>
        <div className="flex justify-between mb-1">
          <span className="font-bold">Último análisis:</span>
          <span>{lastCheck}</span>
        </div>
        <div className="flex justify-between mb-1">
          <span className="font-bold">Total capturas:</span>
          <span>{captureCount}</span>
        </div>
        <div className="border-t border-gray-300 pt-1 mt-1">
          <span className="font-bold block mb-1">Info de IA:</span>
          <code className="block bg-gray-200 p-1 rounded text-blue-800 break-words text-[10px] whitespace-pre-wrap">
            {debugData}
          </code>
        </div>
      </div>

      <p className="text-[10px] text-gray-400 mt-2 text-center">
        🔍 Análisis automático cada 5 segundos | Abre la consola (F12) para logs detallados
      </p>
    </div>
  );
}

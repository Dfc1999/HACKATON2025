"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import axios from 'axios';
import WebcamProctor from '@/components/WebcamProctor';

export default function ExamPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get('email');

  // Estados
  const [examData, setExamData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(30 * 60);
  const [respuestas, setRespuestas] = useState({ conocimiento: {}, aprendizaje: {} });
  const [examTerminated, setExamTerminated] = useState(false);

  // 👇 NUEVO: Estado para mostrar la pantalla de resultados final
  const [results, setResults] = useState<{ nota: number, estado: string, feedback: string, mensaje?: string } | null>(null);

  const sentRef = useRef(false);

  // 1. CARGA DEL EXAMEN
  useEffect(() => {
    if (!email) return;
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/exam/generate?email=${email}`)
      .then(res => {
        setExamData(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        alert("Error cargando examen. Verifica la conexión.");
      });
  }, [email]);

  // 2. FUNCIÓN DE ENVÍO FINAL
  const submitExam = useCallback(async (fraudeReason?: string) => {
    if (sentRef.current) return;
    sentRef.current = true;
    setExamTerminated(true);

    try {
      const payload = {
        email,
        respuestas: {
            conocimiento: Object.values(respuestas.conocimiento),
            aprendizaje: Object.values(respuestas.aprendizaje)
        },
        fraude: fraudeReason
      };

      // Enviamos al backend
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/exam/submit`, payload);

      // 👇 EN LUGAR DE REDIRIGIR, GUARDAMOS LOS RESULTADOS PARA MOSTRARLOS
      setResults(response.data);

    } catch (e) {
      console.error(e);
      alert("Error al enviar. Se intentará guardar el estado.");
    }
  }, [email, respuestas]);

  // 3. SEGURIDAD: DETECCIÓN DE CAMBIO DE PESTAÑA
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && !examTerminated) {
        submitExam("Salida de pantalla detectada (Tab switch/Minimizar).");
      }
    };

    const handleBlur = () => {
       if (!examTerminated) {
         submitExam("Pérdida de foco (Click fuera de la ventana).");
       }
    };

    if (!loading && !results) {
        document.addEventListener("visibilitychange", handleVisibilityChange);
        window.addEventListener("blur", handleBlur);
    }

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleBlur);
    };
  }, [submitExam, examTerminated, loading, results]);

  // 4. TEMPORIZADOR
  useEffect(() => {
    if (loading || examTerminated || results) return; // Detener si ya hay resultados
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          submitExam("Tiempo agotado.");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [loading, examTerminated, submitExam, results]);

  // 5. BLOQUEO DE COPIADO
  const preventCopy = (e: any) => {
    e.preventDefault();
  };

  const handleOptionChange = (section: string, index: number, val: number) => {
    setRespuestas(prev => ({
        ...prev,
        [section]: { ...prev[section as keyof typeof prev], [index]: val }
    }));
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // --- VISTA DE CARGA ---
  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center font-bold text-xl text-blue-800">Generando Examen Adaptativo con IA...</div>
    </div>
  );

  // --- VISTA DE RESULTADOS (FINAL) ---
  if (results) {
    const esFraude = results.estado === 'Rechazado_Fraude';
    const esAprobado = results.estado === 'Aprobado_Tecnico';

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full overflow-hidden text-center">

                {/* Encabezado de Color según resultado */}
                <div className={`p-6 ${esFraude ? 'bg-red-600' : esAprobado ? 'bg-green-600' : 'bg-yellow-500'} text-white`}>
                    <h1 className="text-3xl font-bold uppercase tracking-wider">
                        {esFraude ? 'Examen Anulado' : 'Examen Finalizado'}
                    </h1>
                    <p className="mt-2 opacity-90">Evaluación Técnica completada</p>
                </div>

                <div className="p-8 text-gray-800">

                    {/* Sección de Nota */}
                    <div className="mb-8">
                        <span className="text-sm text-gray-500 uppercase tracking-widest">Calificación Obtenida</span>
                        <div className={`text-6xl font-black mt-2 ${esFraude ? 'text-red-600' : 'text-blue-900'}`}>
                            {results.nota}/100
                        </div>
                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold mt-4
                            ${esFraude ? 'bg-red-100 text-red-800' : esAprobado ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                            Estado: {results.estado.replace('_', ' ')}
                        </span>
                    </div>

                    {/* Reporte de Sospecha / Fraude */}
                    {esFraude && (
                        <div className="bg-red-50 border-l-4 border-red-500 text-left p-4 mb-6 rounded shadow-sm">
                            <h3 className="font-bold text-red-700 flex items-center">
                                <span className="text-xl mr-2">🚨</span> Actividad Sospechosa Detectada
                            </h3>
                            <p className="text-red-900 mt-1 text-sm">
                                {results.mensaje || results.feedback}
                            </p>
                            <p className="text-xs text-red-500 mt-2 italic">
                                Este incidente ha sido reportado al equipo de reclutamiento automáticamente.
                            </p>
                        </div>
                    )}

                    {/* Feedback de la IA */}
                    {!esFraude && results.feedback && (
                         <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg text-left mb-6">
                            <h3 className="font-bold text-blue-800 mb-2">Análisis de Desempeño (IA):</h3>
                            <p className="text-gray-700 italic text-sm">"{results.feedback}"</p>
                         </div>
                    )}

                    <button
                        onClick={() => router.push('/')}
                        className="w-full bg-gray-900 text-white font-bold py-3 rounded hover:bg-black transition-colors"
                    >
                        Volver al Inicio
                    </button>
                </div>
            </div>
        </div>
    );
  }

  // --- VISTA DEL EXAMEN (ACTIVO) ---
  return (
    <div
      className="min-h-screen bg-gray-50 flex flex-col select-none"
      onCopy={preventCopy}
      onPaste={preventCopy}
      onContextMenu={preventCopy}
    >
      <header className="bg-blue-900 text-white p-4 flex justify-between items-center sticky top-0 z-50 shadow-md">
        <div>
           <h1 className="font-bold text-lg">Evaluación Técnica: {examData.candidato}</h1>
           <span className="text-xs text-blue-200">No cambies de pestaña o el examen finalizará.</span>
        </div>
        <div className={`text-2xl font-mono font-bold ${timeLeft < 300 ? 'text-red-400' : 'text-white'}`}>
          {formatTime(timeLeft)}
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* ÁREA DEL EXAMEN */}
        <div className="w-3/4 p-8 overflow-y-auto h-[calc(100vh-80px)] bg-gray-50">
            <form onSubmit={(e) => { e.preventDefault(); submitExam(); }}>

                {/* SECCIÓN A */}
                <div className="mb-8">
                    <h2 className="text-xl font-bold text-gray-800 mb-4 border-b border-gray-300 pb-2">I. Prueba de Conocimiento</h2>
                    {examData.data.seccion_conocimiento.map((p: any, idx: number) => (
                        <div key={idx} className="mb-6 bg-white p-6 rounded shadow border-l-4 border-blue-500 text-gray-900">
                            <p className="font-medium text-lg mb-3">{idx + 1}. {p.pregunta}</p>
                            <div className="grid grid-cols-1 gap-2">
                                {p.opciones.map((opt: string, optIdx: number) => (
                                    <label key={optIdx} className="flex items-center space-x-3 p-3 rounded hover:bg-gray-100 cursor-pointer border border-transparent hover:border-gray-200 transition">
                                        <input
                                            type="radio"
                                            name={`conocimiento-${idx}`}
                                            value={optIdx}
                                            onChange={() => handleOptionChange('conocimiento', idx, optIdx)}
                                            className="h-5 w-5 text-blue-600 focus:ring-blue-500"
                                        />
                                        <span className="text-gray-800">{opt}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* SECCIÓN B */}
                <div className="mb-8">
                    <h2 className="text-xl font-bold text-gray-800 mb-4 border-b border-gray-300 pb-2">II. Prueba de Aprendizaje</h2>
                    {examData.data.seccion_aprendizaje.map((p: any, idx: number) => (
                        <div key={idx} className="mb-6 bg-white p-6 rounded shadow border-l-4 border-green-500 text-gray-900">
                            <p className="font-medium text-lg mb-3">{idx + 1}. {p.pregunta}</p>
                            <div className="grid grid-cols-1 gap-2">
                                {p.opciones.map((opt: string, optIdx: number) => (
                                    <label key={optIdx} className="flex items-center space-x-3 p-3 rounded hover:bg-gray-100 cursor-pointer border border-transparent hover:border-gray-200 transition">
                                        <input
                                            type="radio"
                                            name={`aprendizaje-${idx}`}
                                            value={optIdx}
                                            onChange={() => handleOptionChange('aprendizaje', idx, optIdx)}
                                            className="h-5 w-5 text-green-600 focus:ring-green-500"
                                        />
                                        <span className="text-gray-800">{opt}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <button type="submit" className="w-full bg-blue-800 text-white font-bold py-4 rounded-lg hover:bg-blue-700 transition shadow-lg mb-10">
                    Finalizar Evaluación
                </button>
            </form>
        </div>

        {/* PROCTORING */}
        <div className="w-1/4 bg-gray-100 p-4 border-l border-gray-300 h-[calc(100vh-80px)] overflow-y-auto">
            <div className="sticky top-0">
                <h3 className="font-bold text-gray-700 mb-4 text-center text-lg">Supervisión Activa</h3>
                <WebcamProctor onFraud={(reason) => submitExam(`Fraude Visual: ${reason}`)} />

                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-900 shadow-sm">
                    <strong className="block mb-2 text-yellow-800">⚠️ Reglas estrictas:</strong>
                    <ul className="list-disc pl-4 space-y-2">
                        <li>Tiempo límite: 30 minutos.</li>
                        <li>No salir de esta pantalla.</li>
                        <li>No copiar/pegar texto.</li>
                        <li>Cámara encendida siempre.</li>
                    </ul>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}

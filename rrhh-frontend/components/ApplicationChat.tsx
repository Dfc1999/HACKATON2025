"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';

interface TimelineEvent {
  fecha: string;
  estado: string;
  mensaje: string;
  detalles?: string;
}

interface Application {
  _id: string;
  email: string;
  nombre: string;
  vacante_codigo: string;
  vacante_titulo?: string;
  estado: string;
  timeline: TimelineEvent[];
  fecha_envio: string;
  resultado?: {
    aprobado: boolean;
    nota?: number;
    feedback?: string;
  };
}

export default function ApplicationChat() {
  // Estados de autenticación
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [candidateEmail, setCandidateEmail] = useState('');
  const [emailInput, setEmailInput] = useState('');

  // Estados de la app
  const [step, setStep] = useState<'auth' | 'form' | 'tracking'>('auth');
  const [nombre, setNombre] = useState('');
  const [vacanteId, setVacanteId] = useState('');
  const [cvFile, setCvFile] = useState<File | null>(null);

  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  // Verificar si ya está autenticado (localStorage)
  useEffect(() => {
    const savedEmail = localStorage.getItem('candidate_email');
    if (savedEmail) {
      setCandidateEmail(savedEmail);
      setIsAuthenticated(true);
      setStep('tracking');
    }
  }, []);

  // Polling para actualizar el estado cada 10 segundos
  useEffect(() => {
    if (step === 'tracking' && candidateEmail) {
      loadApplications();
      const interval = setInterval(loadApplications, 10000);
      return () => clearInterval(interval);
    }
  }, [step, candidateEmail]);

  const loadApplications = async () => {
    try {
      const response = await axios.get(`${apiUrl}/applications/track?email=${candidateEmail}`);
      setApplications(response.data);
    } catch (err) {
      console.error('Error cargando postulaciones:', err);
    }
  };

  // Autenticación simple por email
  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput.trim() && emailInput.includes('@')) {
      localStorage.setItem('candidate_email', emailInput);
      setCandidateEmail(emailInput);
      setIsAuthenticated(true);
      setStep('tracking');
    } else {
      setError('Por favor ingresa un email válido');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('candidate_email');
    setCandidateEmail('');
    setIsAuthenticated(false);
    setStep('auth');
    setApplications([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!cvFile) {
      setError('Por favor adjunta tu CV');
      setLoading(false);
      return;
    }

    try {
      // Registrar en BD
      await axios.post(`${apiUrl}/applications`, {
        email: candidateEmail,
        nombre,
        vacante_codigo: vacanteId
      });

      // Instrucciones para enviar el correo
      const mailtoLink = `mailto:damondev123@outlook.com?subject=CV - ${vacanteId} - ${nombre}&body=Hola,%0D%0A%0D%0AMe postulo para la vacante ${vacanteId}.%0D%0A%0D%0ANombre: ${nombre}%0D%0AEmail: ${candidateEmail}%0D%0A%0D%0AAdjunto mi CV.%0D%0A%0D%0ASaludos.`;

      alert(`✅ Postulación registrada!\n\nAhora se abrirá tu cliente de correo para enviar el CV.\n\n📧 Para: damondev123@outlook.com\n📋 Asunto: CV - ${vacanteId}\n\n⚠️ IMPORTANTE: Adjunta tu CV al correo antes de enviarlo.`);

      // Abrir cliente de correo
      window.location.href = mailtoLink;

      setStep('tracking');
      setNombre('');
      setVacanteId('');
      setCvFile(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al registrar postulación');
    } finally {
      setLoading(false);
    }
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'enviado': return 'bg-blue-100 text-blue-800';
      case 'recibido': return 'bg-indigo-100 text-indigo-800';
      case 'procesando_cv': return 'bg-yellow-100 text-yellow-800';
      case 'evaluando_ia': return 'bg-purple-100 text-purple-800';
      case 'aprobado': return 'bg-green-100 text-green-800';
      case 'rechazado': return 'bg-red-100 text-red-800';
      case 'en_examen': return 'bg-orange-100 text-orange-800';
      case 'finalizado': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case 'enviado': return '📤';
      case 'recibido': return '📥';
      case 'procesando_cv': return '⚙️';
      case 'evaluando_ia': return '🤖';
      case 'aprobado': return '✅';
      case 'rechazado': return '❌';
      case 'en_examen': return '📝';
      case 'finalizado': return '🏁';
      default: return '📋';
    }
  };

  // ============================================
  // VISTA: AUTENTICACIÓN
  // ============================================
  if (step === 'auth') {
    return (
      <div className="max-w-md mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">👤</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Portal de Postulantes</h2>
            <p className="text-sm text-gray-600">Ingresa tu email para ver tus postulaciones</p>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Correo Electrónico
              </label>
              <input
                type="email"
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white text-gray-900"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="tu@email.com"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Continuar →
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200 text-center">
            <p className="text-xs text-gray-500">
              💡 No necesitas crear cuenta. Solo usa tu email para hacer seguimiento a tus postulaciones.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ============================================
  // VISTA: FORMULARIO
  // ============================================
  if (step === 'form') {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-1">Nueva Postulación</h2>
              <p className="text-sm text-gray-600">Email: {candidateEmail}</p>
            </div>
            <button
              onClick={handleLogout}
              className="text-sm text-red-600 hover:text-red-700 underline"
            >
              Salir
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo *</label>
              <input
                type="text"
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white text-gray-900"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Juan Pérez"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Código de Vacante *</label>
              <input
                type="text"
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white text-gray-900"
                value={vacanteId}
                onChange={(e) => setVacanteId(e.target.value.toUpperCase())}
                placeholder="Ej: TEST-JAVA"
              />
              <p className="text-xs text-gray-500 mt-1">Este código aparece en la oferta de trabajo</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Adjuntar CV *</label>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                required
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                onChange={(e) => setCvFile(e.target.files?.[0] || null)}
              />
              <p className="text-xs text-gray-500 mt-1">Formatos aceptados: PDF, DOC, DOCX</p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-900 font-medium mb-2">📧 ¿Cómo funciona?</p>
              <ol className="text-xs text-blue-800 space-y-1 list-decimal list-inside">
                <li>Completa este formulario</li>
                <li>Se abrirá tu cliente de correo automáticamente</li>
                <li>Adjunta tu CV al correo</li>
                <li>Envía el correo a damondev123@outlook.com</li>
                <li>Vuelve aquí para ver el progreso en tiempo real</li>
              </ol>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep('tracking')}
                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition-colors"
              >
                ← Volver
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
              >
                {loading ? 'Procesando...' : '📤 Enviar Postulación'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // ============================================
  // VISTA: TRACKING
  // ============================================
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Mis Postulaciones</h2>
            <p className="text-sm text-gray-600">Email: {candidateEmail}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setStep('form')}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              + Nueva Postulación
            </button>
            <button
              onClick={handleLogout}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors text-sm"
            >
              Salir
            </button>
          </div>
        </div>

        {applications.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed">
            <span className="text-5xl mb-4 block">📭</span>
            <p className="text-gray-500 text-lg mb-2">No tienes postulaciones registradas</p>
            <p className="text-gray-400 text-sm mb-6">Crea tu primera postulación para comenzar</p>
            <button
              onClick={() => setStep('form')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium"
            >
              Crear Primera Postulación
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {applications.map((app) => (
              <div key={app._id} className="border rounded-lg p-6 bg-gray-50 hover:shadow-md transition-shadow">
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">{app.vacante_codigo}</h3>
                    <p className="text-sm text-gray-600">
                      Postulante: {app.nombre}
                    </p>
                    <p className="text-xs text-gray-500">
                      Enviado: {new Date(app.fecha_envio).toLocaleString('es-ES', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${getEstadoColor(app.estado)}`}>
                    {getEstadoIcon(app.estado)} {app.estado.toUpperCase().replace('_', ' ')}
                  </span>
                </div>

                {/* Timeline */}
                <div className="bg-white rounded-lg p-4 space-y-3">
                  {app.timeline.map((event, idx) => (
                    <div key={idx} className="flex gap-3 items-start">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-sm">
                        {getEstadoIcon(event.estado)}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-800 text-sm">{event.mensaje}</p>
                        {event.detalles && (
                          <p className="text-xs text-gray-600 mt-1">{event.detalles}</p>
                        )}
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(event.fecha).toLocaleString('es-ES')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Resultado Final */}
                {app.resultado && (
                  <div className={`mt-4 p-4 rounded-lg ${app.resultado.aprobado ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                    <p className="font-bold text-sm">
                      {app.resultado.aprobado ? '✅ APROBADO' : '❌ NO APROBADO'}
                    </p>
                    {app.resultado.nota !== undefined && (
                      <p className="text-sm mt-1">Nota: {app.resultado.nota}/100</p>
                    )}
                    {app.resultado.feedback && (
                      <p className="text-xs mt-2 italic">{app.resultado.feedback}</p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 text-center pt-4 border-t">
          <button
            onClick={loadApplications}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            🔄 Actualizar estado
          </button>
          <p className="text-xs text-gray-400 mt-2">
            ℹ️ El estado se actualiza automáticamente cada 10 segundos
          </p>
        </div>
      </div>
    </div>
  );
}

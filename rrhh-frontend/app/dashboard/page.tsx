"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import VacancyManager from '@/components/VacancyManager';
import DocumentUploader from '@/components/DocumentUploader';

export default function DashboardPage() {
  const { user, token, logout, loading } = useAuth();
  const router = useRouter();
  const [hasOrganization, setHasOrganization] = useState(false);
  const [checkingOrg, setCheckingOrg] = useState(true);

  useEffect(() => {
    if (loading) return;

    if (!user || !token) {
      router.push('/login');
      return;
    }

    // Verificar si tiene organización
    const checkOrganization = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/organization/me`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.data.hasOrganization) {
          setHasOrganization(true);
        } else {
          router.push('/onboarding');
        }
      } catch (error) {
        console.error('Error verificando organización:', error);
      } finally {
        setCheckingOrg(false);
      }
    };

    checkOrganization();
  }, [user, token, loading, router]);

  if (loading || checkingOrg) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-800 mb-2">Cargando...</div>
        </div>
      </div>
    );
  }

  if (!hasOrganization) {
    return null; // Redirigirá a onboarding
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Service Desk RRHH</h1>
            <p className="text-sm text-gray-600">Bienvenido, {user?.name || user?.email}</p>
          </div>
          <button
            onClick={logout}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
          >
            Cerrar Sesión
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid gap-8">

          {/* Sección de Vacantes */}
          <section>
            <VacancyManager />
          </section>

          {/* Sección de Documentos (opcional) */}
          <section>
            <DocumentUploader />
          </section>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="font-bold text-blue-900 mb-2 flex items-center">
              <span className="text-2xl mr-2">💡</span>
              Cómo funciona el sistema
            </h3>
            <ul className="text-sm text-blue-800 space-y-2 ml-8">
              <li>✓ <strong>Paso 1:</strong> Crea vacantes con los requisitos técnicos necesarios</li>
              <li>✓ <strong>Paso 2:</strong> Logic Apps procesa automáticamente los CVs que llegan a tu correo</li>
              <li>✓ <strong>Paso 3:</strong> Los candidatos aprobados reciben un enlace para su evaluación técnica</li>
              <li>✓ <strong>Paso 4:</strong> La IA genera exámenes personalizados basados en los requisitos de la vacante</li>
              <li>✓ <strong>Paso 5:</strong> Recibe resultados automáticos con proctoring de video</li>
            </ul>
          </div>

        </div>
      </main>
    </div>
  );
}

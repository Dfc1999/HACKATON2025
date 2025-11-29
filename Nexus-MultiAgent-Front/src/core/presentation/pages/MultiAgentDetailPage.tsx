import { useMultiAgentDetail } from '../hooks/useMultiAgentDetail';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { MultiAgentDetailHeader } from '../components/features/multiagent/MultiAgentDetailHeader';
import { MultiAgentDescription } from '../components/features/multiagent/MultiAgentDescription';
import { CapabilitiesList } from '../components/features/multiagent/CapabilitiesList';
import { DomainsList } from '../components/features/multiagent/DomainsList';
import { PerformanceMetrics } from '../components/features/multiagent/PerformanceMetrics';
import { DemoSection } from '../components/features/multiagent/DemoSection';
import { useEffect } from 'react';

export const MultiAgentDetailPage = () => {
  const { multiAgent, isLoading, error, refetch } = useMultiAgentDetail();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Adaptación de tipos para evitar errores de asignación
  const performanceMetrics = [
    { label: 'Precisión', value: '99.8%', description: 'Exactitud del reconocimiento facial en condiciones óptimas.' },
    { label: 'Latencia', value: '50ms', description: 'Tiempo promedio de respuesta por identificación.' },
    { label: 'Escalabilidad', value: 'Alta', description: 'Capacidad de procesar múltiples solicitudes simultáneamente.' }
  ];

  const responsibleAI = {
    description: 'Escalación automática a verificación humana en casos de baja confianza.',
    transparency: 'Explicabilidad de decisiones basada en score de confianza.',
    fairness: 'Evaluación equitativa sin sesgos demográficos.',
    privacy: 'Protección de datos biométricos mediante cifrado y anonimización.'
  };

  const demoAccount = {
    username: 'demo@azure.com',
    password: 'demo123'
  };

  if (multiAgent) {
    multiAgent.performanceMetrics = performanceMetrics;
    multiAgent.responsibleAI = responsibleAI;
    multiAgent.demoAccount = demoAccount;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-dark">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-secondary text-lg">Cargando información del sistema...</p>
      </div>
    );
  }

  if (error || !multiAgent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark p-6">
        <div className="max-w-lg w-full">
          <ErrorMessage 
            message={error || 'No se pudo cargar el multiagente'}
            onRetry={refetch}
          />
        </div>
      </div>
    );
  }

  const title = multiAgent.title || multiAgent.name;

  return (
    <div className="min-h-screen">
      <MultiAgentDetailHeader
        title={title}
        logo={multiAgent.logo}
        shortDescription={multiAgent.shortDescription}
      />

      <MultiAgentDescription
        description={multiAgent.description}
        fullDescription={multiAgent.fullDescription}
      />

      {multiAgent.capabilities && multiAgent.capabilities.length > 0 && (
        <CapabilitiesList capabilities={multiAgent.capabilities} />
      )}

      {multiAgent.domains && multiAgent.domains.length > 0 && (
        <DomainsList domains={multiAgent.domains} />
      )}

      <PerformanceMetrics
        performanceMetrics={multiAgent.performanceMetrics}
        responsibleAI={multiAgent.responsibleAI}
      />

      <DemoSection
        demoUrl={multiAgent.demoUrl}
        demoAccount={multiAgent.demoAccount}
        title={title}
      />
    </div>
  );
};
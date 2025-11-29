import { useMultiAgents } from '../../../hooks/useMultiAgents';
import { MultiAgentCard } from './MultiAgentCard';
import { LoadingSpinner } from '../../common/LoadingSpinner';
import { ErrorMessage } from '../../common/ErrorMessage';

export const MultiAgentGrid = () => {
  const { multiAgents, isLoading, error, refetch } = useMultiAgents();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-neutral text-sm">Cargando sistemas multiagente...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12">
        <ErrorMessage 
          message={error}
          onRetry={refetch}
        />
      </div>
    );
  }

  if (multiAgents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center mb-4">
          <svg 
            className="w-8 h-8 text-neutral" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" 
            />
          </svg>
        </div>
        <p className="text-neutral text-center">
          No hay sistemas multiagente disponibles en este momento
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {multiAgents.map((multiAgent, index) => (
        <MultiAgentCard
          key={multiAgent.id}
          multiAgent={multiAgent}
          delay={index * 0.1}
        />
      ))}
    </div>
  );
};
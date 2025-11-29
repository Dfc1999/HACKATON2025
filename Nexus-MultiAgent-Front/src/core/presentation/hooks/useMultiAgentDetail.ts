import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { MultiAgent } from '../../domain/entities/MultiAgent.entity';
import { MultiAgentRepository } from '../../infrastructure/repositories/MultiAgentRepository';
import { useMultiAgentStore } from '../stores/multiAgentStore';

const multiAgentRepository = new MultiAgentRepository();

export const useMultiAgentDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { selectedMultiAgent, setSelectedMultiAgent, setLoading, setError } = useMultiAgentStore();
  const [multiAgent, setMultiAgent] = useState<MultiAgent | null>(null);
  const [isLoading, setIsLoadingState] = useState(false);
  const [error, setErrorState] = useState<string | null>(null);

  useEffect(() => {
    const fetchMultiAgent = async () => {
      if (!id) {
        setErrorState('ID de multiagente no proporcionado');
        return;
      }

      setIsLoadingState(true);
      setLoading(true);
      setErrorState(null);
      setError(null);

      try {
        const fetchedMultiAgent = await multiAgentRepository.getById(id);
        
        if (fetchedMultiAgent) {
          setMultiAgent(fetchedMultiAgent);
          setSelectedMultiAgent(fetchedMultiAgent);
        } else {
          setErrorState('Multiagente no encontrado');
          setError('Multiagente no encontrado');
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error al cargar el multiagente';
        setErrorState(errorMessage);
        setError(errorMessage);
      } finally {
        setIsLoadingState(false);
        setLoading(false);
      }
    };

    fetchMultiAgent();
  }, [id, setSelectedMultiAgent, setLoading, setError]);

  const refetch = () => {
    if (id) {
      setIsLoadingState(false);
      setErrorState(null);
    }
  };

  return {
    multiAgent: multiAgent || selectedMultiAgent,
    isLoading,
    error,
    refetch,
  };
};
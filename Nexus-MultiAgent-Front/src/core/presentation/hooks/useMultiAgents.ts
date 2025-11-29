import { useState, useEffect } from 'react';
import { MultiAgentRepository } from '../../infrastructure/repositories/MultiAgentRepository';
import { useMultiAgentStore } from '../stores/multiAgentStore';

const multiAgentRepository = new MultiAgentRepository();

export const useMultiAgents = () => {
  const {
    multiAgents,
    isLoading,
    error,
    setMultiAgents,
    setLoading,
    setError
  } = useMultiAgentStore();

  const [hasAttemptedFetch, setHasAttemptedFetch] = useState(false);

  const fetchMultiAgents = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const fetchedAgents = await multiAgentRepository.getAvailable();
      setMultiAgents(fetchedAgents);
      setHasAttemptedFetch(true);
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'Error al cargar los multiagentes';
      setError(errorMessage);
      setHasAttemptedFetch(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!hasAttemptedFetch && multiAgents.length === 0) {
      fetchMultiAgents();
    }
  }, [hasAttemptedFetch, multiAgents.length]);

  const refetch = () => {
    setHasAttemptedFetch(false);
    fetchMultiAgents();
  };

  return {
    multiAgents,
    isLoading,
    error,
    refetch
  };
};
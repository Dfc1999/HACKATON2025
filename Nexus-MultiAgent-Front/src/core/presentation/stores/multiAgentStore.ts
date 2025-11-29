import { create } from 'zustand';
import { MultiAgent } from '../../domain/entities/MultiAgent.entity';

interface MultiAgentState {
  multiAgents: MultiAgent[];
  selectedMultiAgent: MultiAgent | null;
  isLoading: boolean;
  error: string | null;
  
  setMultiAgents: (multiAgents: MultiAgent[]) => void;
  setSelectedMultiAgent: (multiAgent: MultiAgent | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  reset: () => void;
}

const initialState = {
  multiAgents: [],
  selectedMultiAgent: null,
  isLoading: false,
  error: null
};

export const useMultiAgentStore = create<MultiAgentState>((set) => ({
  ...initialState,

  setMultiAgents: (multiAgents) => set({ multiAgents }),

  setSelectedMultiAgent: (multiAgent) => set({ selectedMultiAgent: multiAgent }),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  clearError: () => set({ error: null }),

  reset: () => set(initialState)
}));
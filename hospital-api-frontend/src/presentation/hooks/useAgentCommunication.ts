import { useState, useCallback, useRef, useEffect } from 'react';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'agent';
  timestamp: number;
  context?: Record<string, any>;
}

interface AgentResponse {
  success: boolean;
  data?: any;
  message?: string;
  error?: string;
}

interface UseAgentCommunicationReturn {
  isConnected: boolean;
  isWaiting: boolean;
  lastResponse: AgentResponse | null;
  error: string | null;
  messages: Message[];
  sendMessage: (content: string, context?: Record<string, any>) => Promise<AgentResponse>;
  waitForResponse: (timeout?: number) => Promise<AgentResponse>;
  handleStreamingResponse: (callback: (chunk: string) => void) => void;
  clearMessages: () => void;
  reconnect: () => Promise<void>;
}

const useAgentCommunication = (
  agentEndpoint: string = '/api/agent'
): UseAgentCommunicationReturn => {
  const [isConnected, setIsConnected] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);
  const [lastResponse, setLastResponse] = useState<AgentResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  const abortControllerRef = useRef<AbortController | null>(null);
  const streamCallbackRef = useRef<((chunk: string) => void) | null>(null);

  const generateMessageId = useCallback((): string => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  const checkConnection = useCallback(async (): Promise<boolean> => {
    try {
      const response = await fetch(`${agentEndpoint}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const isHealthy = response.ok;
      setIsConnected(isHealthy);
      return isHealthy;
    } catch (err) {
      setIsConnected(false);
      return false;
    }
  }, [agentEndpoint]);

  const reconnect = useCallback(async (): Promise<void> => {
    setError(null);
    const connected = await checkConnection();
    
    if (!connected) {
      setError('No se pudo reconectar con el agente');
      throw new Error('Reconexión fallida');
    }
  }, [checkConnection]);

  useEffect(() => {
    checkConnection();
    
    const interval = setInterval(() => {
      checkConnection();
    }, 30000);

    return () => {
      clearInterval(interval);
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [checkConnection]);

  const sendMessage = useCallback(async (
    content: string,
    context?: Record<string, any>
  ): Promise<AgentResponse> => {
    try {
      setIsWaiting(true);
      setError(null);

      if (!isConnected) {
        await reconnect();
      }

      const userMessage: Message = {
        id: generateMessageId(),
        content,
        role: 'user',
        timestamp: Date.now(),
        context: context ?? {},
      };

      setMessages(prev => [...prev, userMessage]);

      abortControllerRef.current = new AbortController();

      const response = await fetch(`${agentEndpoint}/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: content,
          context,
          conversationId: messages.length > 0 ? messages[0]?.id : undefined,
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error(`Error del servidor: ${response.status}`);
      }

      const data = await response.json();

      const agentMessage: Message = {
        id: generateMessageId(),
        content: data.message || data.response || '',
        role: 'agent',
        timestamp: Date.now(),
      };

      setMessages(prev => [...prev, agentMessage]);

      const agentResponse: AgentResponse = {
        success: true,
        data: data.data,
        message: data.message || data.response,
      };

      setLastResponse(agentResponse);
      return agentResponse;
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        const abortResponse: AgentResponse = {
          success: false,
          error: 'Solicitud cancelada',
        };
        setLastResponse(abortResponse);
        return abortResponse;
      }

      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);

      const errorResponse: AgentResponse = {
        success: false,
        error: errorMessage,
      };

      setLastResponse(errorResponse);
      return errorResponse;
    } finally {
      setIsWaiting(false);
    }
  }, [isConnected, messages, agentEndpoint, reconnect, generateMessageId]);

  const waitForResponse = useCallback(async (
    timeout: number = 30000
  ): Promise<AgentResponse> => {
    return new Promise((resolve, reject) => {
      const startTime = Date.now();

      const checkResponse = setInterval(() => {
        if (lastResponse && !isWaiting) {
          clearInterval(checkResponse);
          resolve(lastResponse);
        }

        if (Date.now() - startTime > timeout) {
          clearInterval(checkResponse);
          reject(new Error('Timeout esperando respuesta del agente'));
        }
      }, 100);
    });
  }, [lastResponse, isWaiting]);

  const handleStreamingResponse = useCallback((
    callback: (chunk: string) => void
  ): void => {
    streamCallbackRef.current = callback;
  }, []);

  const clearMessages = useCallback((): void => {
    setMessages([]);
    setLastResponse(null);
    setError(null);
  }, []);

  return {
    isConnected,
    isWaiting,
    lastResponse,
    error,
    messages,
    sendMessage,
    waitForResponse,
    handleStreamingResponse,
    clearMessages,
    reconnect,
  };
};

export default useAgentCommunication;
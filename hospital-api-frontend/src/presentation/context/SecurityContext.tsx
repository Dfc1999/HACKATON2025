import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

interface SecurityConfig {
  sessionTimeout: number;
  maxInactivityMinutes: number;
  requireReauthForSensitiveOps: boolean;
  enableAuditLogging: boolean;
}

interface AuditLog {
  id: string;
  timestamp: number;
  action: string;
  userId?: string;
  success: boolean;
  metadata?: Record<string, any> | undefined;
}

interface SecurityContextType {
  config: SecurityConfig;
  isSessionActive: boolean;
  lastActivityTime: number;
  auditLogs: AuditLog[];
  updateActivity: () => void;
  logSecurityEvent: (action: string, success: boolean, metadata?: Record<string, any>) => void;
  clearAuditLogs: () => void;
  updateSecurityConfig: (newConfig: Partial<SecurityConfig>) => void;
  checkSessionValidity: () => boolean;
  forceSessionExpire: () => void;
}

const SecurityContext = createContext<SecurityContextType | undefined>(undefined);

export const useSecurity = (): SecurityContextType => {
  const context = useContext(SecurityContext);
  if (!context) {
    throw new Error('useSecurity debe usarse dentro de un SecurityProvider');
  }
  return context;
};

interface SecurityProviderProps {
  children: React.ReactNode;
  initialConfig?: Partial<SecurityConfig>;
}

const DEFAULT_CONFIG: SecurityConfig = {
  sessionTimeout: 30 * 60 * 1000,
  maxInactivityMinutes: 15,
  requireReauthForSensitiveOps: true,
  enableAuditLogging: true,
};

export const SecurityProvider: React.FC<SecurityProviderProps> = ({
  children,
  initialConfig,
}) => {
  const [config, setConfig] = useState<SecurityConfig>({
    ...DEFAULT_CONFIG,
    ...initialConfig,
  });

  const [isSessionActive, setIsSessionActive] = useState(true);
  const [lastActivityTime, setLastActivityTime] = useState(Date.now());
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [inactivityTimer, setInactivityTimer] = useState<NodeJS.Timeout | null>(null);

  const updateActivity = useCallback((): void => {
    setLastActivityTime(Date.now());
    setIsSessionActive(true);
  }, []);

  const logSecurityEvent = useCallback((
    action: string,
    success: boolean,
    metadata?: Record<string, any>
  ): void => {
    if (!config.enableAuditLogging) return;

    const log: AuditLog = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      action,
      success,
      metadata: metadata ? sanitizeMetadata(metadata) : undefined,
    };

    setAuditLogs(prev => [...prev.slice(-99), log]);
  }, [config.enableAuditLogging]);

  const sanitizeMetadata = (metadata: Record<string, any>): Record<string, any> => {
    const sanitized: Record<string, any> = {};
    
    for (const [key, value] of Object.entries(metadata)) {
      const lowerKey = key.toLowerCase();
      
      if (
        lowerKey.includes('password') ||
        lowerKey.includes('token') ||
        lowerKey.includes('secret') ||
        lowerKey.includes('face') ||
        lowerKey.includes('vector')
      ) {
        sanitized[key] = '[REDACTED]';
      } else if (typeof value === 'object' && value !== null) {
        sanitized[key] = sanitizeMetadata(value as Record<string, any>);
      } else {
        sanitized[key] = value;
      }
    }
    
    return sanitized;
  };

  const clearAuditLogs = useCallback((): void => {
    setAuditLogs([]);
    logSecurityEvent('audit_logs_cleared', true);
  }, [logSecurityEvent]);

  const updateSecurityConfig = useCallback((
    newConfig: Partial<SecurityConfig>
  ): void => {
    setConfig(prev => ({ ...prev, ...newConfig }));
    logSecurityEvent('security_config_updated', true, { changes: Object.keys(newConfig) });
  }, [logSecurityEvent]);

  const checkSessionValidity = useCallback((): boolean => {
    const now = Date.now();
    const inactivityDuration = now - lastActivityTime;
    const maxInactivity = config.maxInactivityMinutes * 60 * 1000;

    if (inactivityDuration > maxInactivity) {
      setIsSessionActive(false);
      logSecurityEvent('session_expired_inactivity', true, {
        inactivityMinutes: Math.floor(inactivityDuration / 60000),
      });
      return false;
    }

    return true;
  }, [lastActivityTime, config.maxInactivityMinutes, logSecurityEvent]);

  const forceSessionExpire = useCallback((): void => {
    setIsSessionActive(false);
    logSecurityEvent('session_force_expired', true);
  }, [logSecurityEvent]);

  useEffect(() => {
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    
    const handleActivity = () => {
      updateActivity();
    };

    events.forEach(event => {
      document.addEventListener(event, handleActivity);
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity);
      });
    };
  }, [updateActivity]);

  useEffect(() => {
    if (inactivityTimer) {
      clearInterval(inactivityTimer);
    }

    const timer = setInterval(() => {
      checkSessionValidity();
    }, 60000);

    setInactivityTimer(timer);

    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [checkSessionValidity]);

  useEffect(() => {
    logSecurityEvent('security_context_initialized', true, {
      sessionTimeout: config.sessionTimeout,
      maxInactivityMinutes: config.maxInactivityMinutes,
    });
  }, []);

  const value: SecurityContextType = {
    config,
    isSessionActive,
    lastActivityTime,
    auditLogs,
    updateActivity,
    logSecurityEvent,
    clearAuditLogs,
    updateSecurityConfig,
    checkSessionValidity,
    forceSessionExpire,
  };

  return (
    <SecurityContext.Provider value={value}>
      {children}
    </SecurityContext.Provider>
  );
};
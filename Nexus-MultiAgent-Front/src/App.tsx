import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LogtoProvider, useLogto } from '@logto/react';
import { logtoConfig } from './config/logto.config';
import { useAuthStore } from './core/presentation/stores/authStore';
import { UserEntity } from './core/domain/entities/User.entity';
import { MainLayout } from './core/presentation/components/layout/MainLayout';
import { HomePage } from './core/presentation/pages/HomePage';
import { MultiAgentDetailPage } from './core/presentation/pages/MultiAgentDetailPage';
import { AuthCallbackPage } from './core/presentation/pages/AuthCallbackPage';
import { NotFoundPage } from './core/presentation/pages/NotFoundPage';
import { LoadingSpinner } from './core/presentation/components/common/LoadingSpinner';

const AuthSync: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading, getIdTokenClaims } = useLogto();
  const { setUser, setIsAuthenticated, setIsLoading } = useAuthStore();

  useEffect(() => {
    const syncAuth = async () => {
      setIsLoading(true);
      try {
        if (isAuthenticated) {
          const claims = await getIdTokenClaims();
          if (claims) {
            const user = new UserEntity(
              claims.sub,
              claims.email || '',
              claims.name || claims.email || 'Usuario',
              claims.picture
            );
            setUser(user);
            setIsAuthenticated(true);
          }
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Error syncing auth:', error);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    syncAuth();
  }, [isAuthenticated, getIdTokenClaims, setUser, setIsAuthenticated, setIsLoading]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return <>{children}</>;
};

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/multiagent/:id" element={<MultiAgentDetailPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
      <Route path="/callback" element={<AuthCallbackPage />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <LogtoProvider config={logtoConfig}>
      <BrowserRouter>
        <AuthSync>
          <AppRoutes />
        </AuthSync>
      </BrowserRouter>
    </LogtoProvider>
  );
};

export default App;
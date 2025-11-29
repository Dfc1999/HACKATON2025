import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLogto } from '@logto/react';
import { useAuthStore } from '../../../stores/authStore';
import { UserEntity } from '../../../../domain/entities/User.entity';
import { LoadingSpinner } from '../../common/LoadingSpinner';

export const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, getIdTokenClaims } = useLogto();
  const { setUser, setIsAuthenticated } = useAuthStore();

  useEffect(() => {
    const handleCallback = async () => {
      if (isAuthenticated) {
        try {
          const claims = await getIdTokenClaims();
          if (claims) {
            const user = new UserEntity(
              claims.sub,
              claims.email || '',
              claims.name || claims.email || 'Usuario',
            );
            setUser(user);
            setIsAuthenticated(true);
          }
        } catch (error) {
          console.error('Error processing auth callback:', error);
        }
        navigate('/', { replace: true });
      }
    };

    handleCallback();
  }, [isAuthenticated, getIdTokenClaims, setUser, setIsAuthenticated, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-gray-600">Iniciando sesión...</p>
      </div>
    </div>
  );
};
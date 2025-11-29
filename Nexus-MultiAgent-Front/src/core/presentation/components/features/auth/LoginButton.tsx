import React from 'react';
import { useLogto } from '@logto/react';
import { LogIn } from 'lucide-react';
import { Button } from '../../common/Button';
import { ENV } from '../../../../../config/env';

export const LoginButton: React.FC = () => {
  const { signIn } = useLogto();

  const handleLogin = () => {
    signIn(ENV.logto.redirectUri);
  };

  return (
    <Button variant="primary" onClick={handleLogin}>
      <LogIn className="w-4 h-4" />
      <span>Iniciar Sesión</span>
    </Button>
  );
};
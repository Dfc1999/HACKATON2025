import React from 'react';
import { useLogto } from '@logto/react';
import { LogOut } from 'lucide-react';
import { Button } from '../../common/Button';
import { ENV } from '../../../../../config/env';
import { useAuthStore } from '../../../stores/authStore';

export const LogoutButton: React.FC = () => {
  const { signOut } = useLogto();
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    signOut(ENV.LOGTO_ENDPOINT + '/logout');
  };

  return (
    <Button variant="outline" size="sm" onClick={() => handleLogout()}>
      <LogOut className="w-4 h-4" />
      <span>Cerrar Sesión</span>
    </Button>
  );
};

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User } from 'lucide-react';
import { useAuthStore } from '../../../stores/authStore';
import { LogoutButton } from './LogoutButton';

export const UserAvatar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const user = useAuthStore((state) => state.user);

  if (!user) return null;

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="w-10 h-10 rounded-full bg-accent text-white flex items-center justify-center font-semibold hover:bg-accent/90 transition-colors"
        style={{ backgroundColor: '#82bda7' }}
      >
        {user.avatar ? (
          <img
            src={user.avatar}
            alt={user.name}
            className="w-full h-full rounded-full object-cover"
          />
        ) : (
          <span className="text-sm">{user.getInitials()}</span>
        )}
      </motion.button>

      <AnimatePresence>
        {isMenuOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsMenuOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 z-50 overflow-hidden"
            >
              <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-primary to-secondary">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-accent text-white flex items-center justify-center font-bold">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <span>{user.getInitials()}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-dark truncate">
                      {user.getDisplayName()}
                    </p>
                    <p className="text-sm text-neutral truncate">{user.email}</p>
                  </div>
                </div>
              </div>

              <div className="p-4 space-y-3">
                <button className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-gray-50 rounded-lg transition-colors">
                  <User className="w-4 h-4 text-neutral" />
                  <span className="text-sm text-gray-700">Mi Perfil</span>
                </button>
              </div>

              <div className="p-4 border-t border-gray-200">
                <LogoutButton />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

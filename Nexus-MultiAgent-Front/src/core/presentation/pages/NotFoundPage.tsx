import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import { motion } from 'framer-motion';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary via-secondary to-accent/30">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center p-8"
      >
        <h1 className="text-9xl font-bold text-dark mb-4">404</h1>
        <h2 className="text-3xl font-bold text-neutral mb-6">
          Página no encontrada
        </h2>
        <p className="text-lg text-gray-700 mb-8">
          La página que buscas no existe o ha sido movida.
        </p>
        <Link to="/" className="inline-flex items-center gap-2 btn-primary px-6 py-3">
          <Home className="w-5 h-5" />
          Volver al Inicio
        </Link>
      </motion.div>
    </div>
  );
};
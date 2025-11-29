import { motion } from 'framer-motion';
import { Container } from '../../common/Container';
import { useScrollAnimation } from '../../../hooks/useScrollAnimation';
import { DemoAccount } from '../../../../domain/entities/MultiAgent.entity';
import { ExternalLink, User, Key, AlertCircle, Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface DemoSectionProps {
  demoUrl?: string | null;
  demoAccount?: DemoAccount | null;
  title: string;
}

export const DemoSection = ({ demoUrl, demoAccount, title }: DemoSectionProps) => {
  const { ref, fadeInUp } = useScrollAnimation();
  const [copiedField, setCopiedField] = useState<'username' | 'password' | null>(null);

  if (!demoUrl && !demoAccount) {
    return null;
  }

  const copyToClipboard = async (text: string, field: 'username' | 'password') => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error('Error al copiar:', err);
    }
  };

  return (
    <section className="py-16 bg-gradient-to-br from-secondary/20 to-primary/30">
      <Container>
        <motion.div
          ref={ref as React.RefObject<HTMLDivElement>}
          {...fadeInUp}
          className="max-w-4xl mx-auto"
        >
          <h2 className="text-3xl font-bold text-dark mb-4 text-center">
            Prueba el Sistema en Vivo
          </h2>
          <p className="text-neutral text-lg mb-10 text-center">
            Experimenta las capacidades de {title} en un entorno de demostración
          </p>

          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-accent to-accent/80 p-6">
              <div className="flex items-center gap-3 text-white">
                <AlertCircle className="w-6 h-6" />
                <div>
                  <h3 className="font-semibold text-lg">Entorno de Prueba</h3>
                  <p className="text-sm text-white/90">
                    Los datos ingresados en esta demo no son permanentes
                  </p>
                </div>
              </div>
            </div>

            <div className="p-8">
              {demoAccount && (
                <div className="mb-8">
                  <h4 className="font-semibold text-dark text-lg mb-4">
                    Credenciales de Acceso
                  </h4>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                      <User className="w-5 h-5 text-neutral flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm text-neutral/70 mb-1">Usuario</p>
                        <p className="font-mono font-semibold text-dark">
                          {demoAccount.username}
                        </p>
                      </div>
                      <button
                        onClick={() => copyToClipboard(demoAccount.username, 'username')}
                        className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                        aria-label="Copiar usuario"
                      >
                        {copiedField === 'username' ? (
                          <Check className="w-5 h-5 text-green-600" />
                        ) : (
                          <Copy className="w-5 h-5 text-neutral" />
                        )}
                      </button>
                    </div>

                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                      <Key className="w-5 h-5 text-neutral flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm text-neutral/70 mb-1">Contraseña</p>
                        <p className="font-mono font-semibold text-dark">
                          {demoAccount.password}
                        </p>
                      </div>
                      <button
                        onClick={() => copyToClipboard(demoAccount.password, 'password')}
                        className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                        aria-label="Copiar contraseña"
                      >
                        {copiedField === 'password' ? (
                          <Check className="w-5 h-5 text-green-600" />
                        ) : (
                          <Copy className="w-5 h-5 text-neutral" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {demoUrl && (
                <div className="flex flex-col items-center gap-6">
                  <motion.a
                    href={demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center justify-center gap-3 w-full py-4 bg-accent text-white font-semibold rounded-xl hover:bg-accent/90 transition-colors shadow-lg hover:shadow-xl"
                  >
                    <ExternalLink className="w-5 h-5" />
                    Abrir Demo en Nueva Ventana
                  </motion.a>

                  <motion.button
                    onClick={() => {
                      if (title.toLowerCase().includes('citas')) {
                        window.location.href = 'http://localhost:5175/';
                      } else if (title.toLowerCase().includes('reconocimiento')) {
                        window.location.href = 'http://localhost:5176/';
                      } else {
                        window.location.href = demoUrl || 'http://localhost:5177/';
                      }
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center justify-center gap-3 w-full py-4 bg-black text-white font-semibold rounded-xl hover:bg-gray-900 transition-colors shadow-lg hover:shadow-xl"
                  >
                    <ExternalLink className="w-5 h-5" />
                    Ir a Demo Local
                  </motion.button>
                </div>
              )}

              {!demoUrl && demoAccount && (
                <div className="text-center text-neutral/60 mt-4">
                  <p className="text-sm">
                    Usa estas credenciales en la plataforma del sistema
                  </p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
};
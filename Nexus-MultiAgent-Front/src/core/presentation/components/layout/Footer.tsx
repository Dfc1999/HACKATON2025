// src/core/presentation/components/layout/Footer.tsx
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Linkedin, Instagram, Mail, Phone, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCompanyStore } from '../../stores/companyStore';
import { Container } from '../common/Container';

export const Footer: React.FC = () => {
  const company = useCompanyStore((state) => state.company);
  const fetchCompanyInfo = useCompanyStore((state) => state.fetchCompanyInfo);

  useEffect(() => {
    if (!company) {
      fetchCompanyInfo();
    }
  }, [company, fetchCompanyInfo]);

  const socialIcons = {
    facebook: Facebook,
    twitter: Twitter,
    linkedin: Linkedin,
    instagram: Instagram,
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-gradient-to-br from-[#2a1a28] via-[#3d2438] to-[#2a1a28] text-white pt-16 pb-8 overflow-hidden">
      {/* Efectos de fondo animados */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Partículas flotantes */}
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-48 h-48 bg-red-800/10 rounded-full blur-3xl"
            animate={{
              x: [0, 80, 0],
              y: [0, -80, 0],
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: 12 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 1.5,
            }}
            style={{
              left: `${(i * 25) % 100}%`,
              top: `${(i * 20) % 100}%`,
            }}
          />
        ))}
        
        {/* Grid de puntos */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <Container className="relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-4">
              {company?.logoUrl && (
                <img
                  src={company.logoUrl}
                  alt={company.name}
                  className="h-10 w-10 object-contain"
                />
              )}
              <h3 className="text-2xl font-bold bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
                {company?.name || 'NEXUS'}
              </h3>
            </div>
            <p className="text-gray-200 text-sm leading-relaxed">
              {company?.description || 'Sistemas de multiagentes de IA para transformar tu organización.'}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h4 className="text-lg font-bold mb-4 text-red-400">Enlaces Rápidos</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-gray-300 hover:text-red-400 transition-colors text-sm flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 bg-red-700 rounded-full group-hover:bg-red-400 transition-colors"></span>
                  Inicio
                </Link>
              </li>
              <li>
                <Link
                  to="/#about"
                  className="text-gray-300 hover:text-red-400 transition-colors text-sm flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 bg-red-700 rounded-full group-hover:bg-red-400 transition-colors"></span>
                  Sobre Nosotros
                </Link>
              </li>
              <li>
                <Link
                  to="/#solutions"
                  className="text-gray-300 hover:text-red-400 transition-colors text-sm flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 bg-red-700 rounded-full group-hover:bg-red-400 transition-colors"></span>
                  Soluciones
                </Link>
              </li>
              <li>
                <Link
                  to="/#contact"
                  className="text-gray-300 hover:text-red-400 transition-colors text-sm flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 bg-red-700 rounded-full group-hover:bg-red-400 transition-colors"></span>
                  Contacto
                </Link>
              </li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h4 className="text-lg font-bold mb-4 text-red-400">Contacto</h4>
            <ul className="space-y-3">
              {company?.contactEmail && (
                <li>
                  <a
                    href={`mailto:${company.contactEmail}`}
                    className="flex items-center gap-2 text-gray-300 hover:text-red-400 transition-colors text-sm group"
                  >
                    <motion.div
                      whileHover={{ scale: 1.2, rotate: 10 }}
                      className="w-8 h-8 bg-red-900/30 rounded-lg flex items-center justify-center group-hover:bg-red-800/40 transition-colors"
                    >
                      <Mail className="w-4 h-4" />
                    </motion.div>
                    <span>{company.contactEmail}</span>
                  </a>
                </li>
              )}
              {company?.phone && (
                <li>
                  <a
                    href={`tel:${company.phone}`}
                    className="flex items-center gap-2 text-gray-300 hover:text-red-400 transition-colors text-sm group"
                  >
                    <motion.div
                      whileHover={{ scale: 1.2, rotate: 10 }}
                      className="w-8 h-8 bg-red-900/30 rounded-lg flex items-center justify-center group-hover:bg-red-800/40 transition-colors"
                    >
                      <Phone className="w-4 h-4" />
                    </motion.div>
                    <span>{company.phone}</span>
                  </a>
                </li>
              )}
              {company?.address && (
                <li className="flex items-start gap-2 text-gray-300 text-sm">
                  <div className="w-8 h-8 bg-red-900/30 rounded-lg flex items-center justify-center mt-0.5">
                    <MapPin className="w-4 h-4 flex-shrink-0" />
                  </div>
                  <span>{company.address}</span>
                </li>
              )}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h4 className="text-lg font-bold mb-4 text-red-400">Síguenos</h4>
            <div className="flex gap-3">
              {company?.socialMedia &&
                Object.entries(company.socialMedia).map(([platform, url]) => {
                  if (!url) return null;
                  const Icon = socialIcons[platform as keyof typeof socialIcons];
                  return (
                    <motion.a
                      key={platform}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.15, y: -3 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-10 h-10 bg-gradient-to-br from-red-900/40 to-red-800/40 hover:from-red-800/60 hover:to-red-700/60 rounded-lg flex items-center justify-center transition-all duration-300 border border-red-800/30 hover:border-red-600/50 shadow-lg hover:shadow-red-900/30"
                    >
                      <Icon className="w-5 h-5 text-red-300" />
                    </motion.a>
                  );
                })}
            </div>
            <div className="mt-6">
              <p className="text-xs text-gray-300 mb-2 font-medium">Suscríbete a nuestro newsletter</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="tu@email.com"
                  className="flex-1 px-3 py-2 bg-white/5 border border-red-800/30 rounded-lg text-sm text-white placeholder-gray-400 focus:outline-none focus:border-red-600 focus:bg-white/10 transition-all backdrop-blur-sm"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-gradient-to-r from-red-900 to-red-800 hover:from-red-800 hover:to-red-700 text-white rounded-lg text-sm font-medium transition-all shadow-lg hover:shadow-red-900/30 border border-red-700"
                >
                  Enviar
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="border-t border-red-800/30 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-300 text-sm text-center md:text-left">
              © {currentYear} <span className="text-red-400 font-semibold">{company?.name || 'NEXUS'}</span>. Todos los derechos reservados.
            </p>
            <div className="flex gap-6 text-sm">
              <Link
                to="/privacy"
                className="text-gray-400 hover:text-red-400 transition-colors relative group"
              >
                Privacidad
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-400 group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link
                to="/terms"
                className="text-gray-400 hover:text-red-400 transition-colors relative group"
              >
                Términos
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-400 group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link
                to="/cookies"
                className="text-gray-400 hover:text-red-400 transition-colors relative group"
              >
                Cookies
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-400 group-hover:w-full transition-all duration-300"></span>
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
};
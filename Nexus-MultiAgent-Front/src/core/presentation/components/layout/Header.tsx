import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { useCompanyStore } from '../../stores/companyStore';
import { LoginButton } from '../features/auth/LoginButton';
import { UserAvatar } from '../features/auth/UserAvatar';
import { Container } from '../common/Container';

export const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const company = useCompanyStore((state) => state.company);
  const fetchCompanyInfo = useCompanyStore((state) => state.fetchCompanyInfo);

  useEffect(() => {
    fetchCompanyInfo();
  }, [fetchCompanyInfo]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header // <-- <header> Abre aquí
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/80 dark:bg-dark-100/80 backdrop-blur-md shadow-md'
          : 'bg-white/60 dark:bg-dark-100/60 backdrop-blur-md'
      }`}
    >
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
      <Container>
        <div className="flex items-center justify-between h-20 md:h-24 px-4 md:px-8 lg:px-16 transition-shadow duration-300">
          <Link to="/" className="flex items-center gap-3 group">
            {company?.logoUrl && (
              <motion.img
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ duration: 0.3 }}
                src={company.logoUrl}
                alt={company.name}
                className="h-10 md:h-12 w-auto rounded-lg shadow-sm hover:shadow-lg transition-transform duration-300"
              />
            )}
            <motion.span
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
              className="text-2xl md:text-3xl font-bold text-dark-100 group-hover:text-accent-100 transition-colors duration-300"
            >
              {company?.name || 'NEXUS'}
            </motion.span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className="text-neutral hover:text-accent transition-colors font-medium"
            >
              Inicio
            </Link>
            <Link
              to="/#about"
              className="text-neutral hover:text-accent transition-colors font-medium"
            >
              Nosotros
            </Link>
            <Link
              to="/#solutions"
              className="text-neutral hover:text-accent transition-colors font-medium"
            >
              Soluciones
            </Link>
            <Link
              to="/#contact"
              className="text-neutral hover:text-accent transition-colors font-medium"
            >
              Contacto
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <div className="hidden md:block">
              {isAuthenticated ? <UserAvatar /> : <LoginButton />}
            </div>

            <button
              className="md:hidden p-2 hover:bg-accent-50 rounded-lg transition-all duration-300 active:scale-95"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-neutral" />
              ) : (
                <Menu className="w-6 h-6 text-neutral" />
              )}
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            className="md:hidden border-t border-neutral-100 py-4 bg-white/70 backdrop-blur-md rounded-b-2xl shadow-lg"
          >
            <nav className="flex flex-col gap-3">
              <Link
                to="/"
                className="px-4 py-2 text-neutral hover:bg-primary/20 hover:text-accent rounded-lg transition-colors font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Inicio
              </Link>
              <Link
                to="/#about"
                className="px-4 py-2 text-neutral hover:bg-primary/20 hover:text-accent rounded-lg transition-colors font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Nosotros
              </Link>
              <Link
                to="/#solutions"
                className="px-4 py-2 text-neutral hover:bg-primary/20 hover:text-accent rounded-lg transition-colors font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Soluciones
              </Link>
              <Link
                to="/#contact"
                className="px-4 py-2 text-neutral hover:bg-primary/20 hover:text-accent rounded-lg transition-colors font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contacto
              </Link>
              <div className="px-4 pt-3 border-t border-gray-200">
                {isAuthenticated ? <UserAvatar /> : <LoginButton />}
              </div>
            </nav>
            </motion.div>
        )}
      </Container>
      </motion.div>
    </header> // <-- <header> Cierra aquí (y también </motion.div> y </Container> que se abrieron antes)
  );
};
import React, { useEffect, useState } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { Container } from '../components/common/Container';
import { HeroCarousel } from '../components/features/carousel/HeroCarousel';
import { CompanyMotto } from '../components/features/home/CompanyMotto';
import { AboutUsSection } from '../components/features/home/AboutUsSection';
import { ObjectivesSection } from '../components/features/home/ObjectivesSection';
import ResponsibleAISection  from '../components/features/home/ResponsibleAISection';
import { AppInfoSection } from '../components/features/home/AppInfoSection';
import { ArrowUpIcon } from '@heroicons/react/24/solid';
import { AgentCards } from '../../../components/AgentCards';

export const HomePage: React.FC = () => {
  /* ──────────────────────────────────────────────
     Scroll progress bar
  ───────────────────────────────────────────────*/
  const { scrollYProgress } = useScroll();
  const scrollProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
  });

  /* ──────────────────────────────────────────────
     Scroll-to-top floating button
  ───────────────────────────────────────────────*/
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">

      {/* ─────────────── Barra de Progreso ─────────────── */}
      <motion.div
        className="fixed top-[72px] left-0 right-0 h-1 bg-accent-100 z-40 origin-left"
        style={{ scaleX: scrollProgress }}
      />

      {/* ─────────────── HERO FULL EXPERIENCE ─────────────── */}
      <div className="relative">
        <HeroCarousel />

        {/* Overlay con título + CTA */}
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
          <div className="text-center px-4 max-w-5xl">

           <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-5xl md:text-6xl lg:text-7xl font-bold text-white drop-shadow-2xl leading-tight text-light"
          >
            
            <span   className="text-5xl md:text-6xl lg:text-7xl font-bold text-white drop-shadow-2xl leading-tight text-light">  
            Bienvenido a Nexus AI           
             </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="text-xl md:text-2xl text-primary-50 mt-6 mb-10 drop-shadow-lg text-light"
          >
            Soluciones inteligentes para desafíos universales
          </motion.p>


          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.0, duration: 0.5 }}
            className="pointer-events-auto border-2 border-white text-white bg-transparent px-8 py-4 rounded-2xl shadow-2xl font-semibold text-lg hover:bg-white hover:text-black hover:scale-105 transition-all duration-300 flex items-center mx-auto"
            onClick={() =>
              document.getElementById('solutions')?.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
              })
            }
          >
            Explorar Soluciones
          </motion.button>



          </div>
        </div>

        {/* Gradiente inferior */}
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-white to-transparent z-5" />
      </div>

      {/* Separador */}
      <div className="h-px bg-gradient-to-r from-transparent via-accent-100 to-transparent opacity-20 mt-12" />

      {/* ─────────────── MOTTO ─────────────── */}
      <CompanyMotto />

      <div className="h-px bg-gradient-to-r from-transparent via-accent-100 to-transparent opacity-20" />

      {/* ─────────────── INTRO SECTION ─────────────── */}
      <section className="py-20 md:py-32 bg-gradient-to-br from-primary to-secondary/40">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center bg-gradient-to-br from-red-950/30 to-red-900/20 backdrop-blur-sm border-2 border-red-800/40 rounded-3xl p-12 shadow-2xl hover:shadow-red-900/30 transition-shadow duration-300"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-dark">
             Revoluciona tu Organización con los Multi agentes de Nexus AI 
            </h1>
            <p className="text-xl md:text-2xl text-neutral max-w-3xl mx-auto">
              Sistemas Multiagente de IA diseñados para transformar organizaciones
            </p>
          </motion.div>
        </Container>
      </section>

      <div className="h-px bg-gradient-to-r from-transparent via-accent-100 to-transparent opacity-20" />

      {/* ─────────────── ABOUT US ─────────────── */}
      <AboutUsSection />

      <div className="h-px bg-gradient-to-r from-transparent via-accent-100 to-transparent opacity-20" />

      {/* ─────────────── MULTIAGENT GRID ─────────────── */}
      <section
        id="solutions"
        className="py-20 md:py-32 bg-gradient-to-b from-primary/5 to-secondary/10"
      >
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-dark mb-4">
              Nuestros Sistemas Multiagente
            </h2>
            <p className="text-lg text-neutral max-w-2xl mx-auto">
              Soluciones inteligentes diseñadas para transformar diferentes dominios organizacionales
            </p>
          </motion.div>

          {/* Reemplazamos el grid por las tarjetas de agentes */}
          <div className="flex justify-center">
            <div className="w-full max-w-6xl mx-auto">
              <AgentCards />
            </div>
          </div>
        </Container>
      </section>

      <div className="h-px bg-gradient-to-r from-transparent via-accent-100 to-transparent opacity-20" />

      {/* ─────────────── OBJECTIVES ─────────────── */}
      <ObjectivesSection />

      <div className="h-px bg-gradient-to-r from-transparent via-accent-100 to-transparent opacity-20" />

      {/* ─────────────── APP INFO ─────────────── */}
      <AppInfoSection />

      <div className="h-px bg-gradient-to-r from-transparent via-accent-100 to-transparent opacity-20" />

      {/* ─────────────── RESPONSIBLE AI ─────────────── */}
      <ResponsibleAISection />

      <div className="h-px bg-gradient-to-r from-transparent via-accent-100 to-transparent opacity-20" />

      {/* ─────────────── CONTACT ─────────────── */}
      <section id="contact" className="py-20 bg-white">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h2 className="text-4xl font-bold mb-6 text-dark">
              Contáctanos
            </h2>
            <p className="text-lg text-neutral mb-8">
              ¿Listo para transformar tu organización con IA?
            </p>
            <button className="px-10 py-4 bg-accent-100 hover:bg-accent-200 text-black text-lg font-semibold rounded-2xl shadow-xl transition-all duration-300 hover:scale-105">
              Solicitar Demo
            </button>

          </motion.div>
        </Container>
      </section>

      {/* ─────────────── BUTTON “SCROLL TO TOP” ─────────────── */}
      {showScrollTop && (
        <motion.button
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          onClick={() =>
            window.scrollTo({ top: 0, behavior: 'smooth' })
          }
          className="fixed bottom-8 right-8 z-50 w-14 h-14 bg-accent-100 hover:bg-accent-200 text-white rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110"
        >
          <ArrowUpIcon className="w-6 h-6" />
        </motion.button>
      )}
    </div>
  );
};

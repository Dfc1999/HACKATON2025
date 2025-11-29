import { motion } from 'framer-motion';
import { Container } from '../../common/Container';

export const CompanyMotto = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-dark via-neutral to-dark">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="text-center"
        >
         <motion.h1
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-8 leading-tight px-4"            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Sin Fronteras de Dominio, Sin Límites de Impacto
            <br />
            <span className="text-secondary">Agentes que Transforman Cada Área,</span>
            <br />
            <span className="text-accent">Humanos que Guían Cada Decisión</span>
          </motion.h1>

          <motion.div
            className="max-w-4xl mx-auto mb-8 px-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <p className="text-lg md:text-xl text-black font-semibold bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-2xl shadow-xl border-l-4 border-accent leading-relaxed">
              Un ecosistema de agentes cognitivos especializados que transforma la mesa de servicio tradicional en una plataforma multidominio. 
              Desde <span className="text-red-700 font-bold">emergencias médicas</span> hasta <span className="text-red-700 font-bold">reclutamiento de talento</span>, 
              desde <span className="text-red-700 font-bold">eventos masivos</span> hasta <span className="text-red-700 font-bold">atención al cliente</span>: 
              nuestros agentes resuelven automáticamente lo rutinario mientras preservan el juicio humano para lo crítico.
            </p>
            
            <div className="grid md:grid-cols-2 gap-6 mt-6">
              <div className="bg-white/95 p-5 rounded-xl shadow-lg border-t-4 border-red-800">
                <p className="text-black font-medium leading-relaxed">
                  <span className="text-red-800 font-bold text-lg"> Identificación instantánea</span> con reconocimiento facial en emergencias. 
                  <span className="text-red-800 font-bold text-lg"> Evaluación inteligente</span> de candidatos con monitoreo de integridad. 
                  <span className="text-red-800 font-bold text-lg">Agendamiento dinámico</span> con análisis de sentimientos.
                </p>
              </div>
              
              <div className="bg-white/95 p-5 rounded-xl shadow-lg border-t-4 border-red-800">
                <p className="text-black font-medium leading-relaxed">
                  Todo orquestado bajo principios estrictos de <span className="text-red-800 font-bold">IA Responsable</span>: 
                  transparencia total, derivación automática ante casos sensibles, y la certeza de que 
                  <span className="text-red-800 font-bold"> las decisiones críticas siempre están en manos humanas</span>.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
};
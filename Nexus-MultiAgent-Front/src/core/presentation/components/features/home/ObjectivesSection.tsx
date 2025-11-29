import { motion } from 'framer-motion';
import { Container } from '../../common/Container';
import { useScrollAnimation } from '../../../hooks/useScrollAnimation';
import { Rocket, TrendingUp, Globe, Award } from 'lucide-react';

const objectives = [
  {
    icon: Rocket,
    title: 'Innovación Continua',
    description: 'Desarrollar constantemente nuevas soluciones que superen las expectativas del mercado.',
  },
  {
    icon: TrendingUp,
    title: 'Crecimiento Sostenible',
    description: 'Expandir nuestro alcance mientras mantenemos la excelencia en cada implementación.',
  },
  {
    icon: Globe,
    title: 'Impacto Global',
    description: 'Llevar nuestras soluciones de IA a organizaciones en todo el mundo.',
  },
  {
    icon: Award,
    title: 'Excelencia Operacional',
    description: 'Garantizar la máxima calidad en cada producto y servicio que ofrecemos.',
  },
];

export const ObjectivesSection = () => {
  const { ref, slideInRight, slideInLeft } = useScrollAnimation();

  return (
    <section className="py-20 bg-gradient-to-br from-secondary/10 to-primary/20 overflow-hidden">
      <Container>
        <div ref={ref as React.RefObject<HTMLDivElement>} className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div {...slideInLeft}>
            <img
              src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=600&fit=crop"
              alt="Objetivos y metas empresariales"
              className="rounded-2xl shadow-2xl w-full h-[500px] object-cover"
            />
          </motion.div>

          <motion.div {...slideInRight}>
            <h2 className="text-4xl font-bold text-dark mb-6">
              Nuestros Objetivos
            </h2>

            <p className="text-neutral text-lg mb-8 leading-relaxed">
              En NEXUS, nos guiamos por objetivos claros que impulsan nuestra 
              evolución y garantizan el valor que entregamos a nuestros clientes.
            </p>

            <div className="space-y-6">
              {objectives.map((objective, index) => {
                const Icon = objective.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-4 p-5 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow"
                  >
                    <div className="flex-shrink-0 w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                      <Icon className="w-6 h-6 text-accent" />
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-dark text-lg mb-2">
                        {objective.title}
                      </h3>
                      <p className="text-neutral leading-relaxed">
                        {objective.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
};
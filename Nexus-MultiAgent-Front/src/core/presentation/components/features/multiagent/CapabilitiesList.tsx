import { motion } from 'framer-motion';
import { Container } from '../../common/Container';
import { useScrollAnimation } from '../../../hooks/useScrollAnimation';
import { CheckCircle2, Sparkles, Zap, Target } from 'lucide-react';

interface CapabilitiesListProps {
  capabilities: string[];
}

const iconMap = [CheckCircle2, Sparkles, Zap, Target];

export const CapabilitiesList = ({ capabilities }: CapabilitiesListProps) => {
  const { ref, fadeInUp } = useScrollAnimation();

  return (
    <section className="py-16 bg-gradient-to-br from-secondary/10 to-primary/20">
      <Container>
        <motion.div
          ref={ref as React.RefObject<HTMLDivElement>}
          {...fadeInUp}
        >
          <h2 className="text-3xl font-bold text-dark mb-4">
            Capacidades Principales
          </h2>
          <p className="text-neutral text-lg mb-10">
            Funcionalidades y características que hacen único a este sistema
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {capabilities.map((capability, index) => {
              const Icon = iconMap[index % iconMap.length];
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-4 p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow"
                >
                  <div className="flex-shrink-0 w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                    <Icon className="w-6 h-6 text-accent" />
                  </div>
                  
                  <div className="flex-1">
                    <p className="text-dark font-medium leading-relaxed">
                      {capability}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </Container>
    </section>
  );
};
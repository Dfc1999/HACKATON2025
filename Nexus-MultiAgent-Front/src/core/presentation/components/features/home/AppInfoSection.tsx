import { motion } from 'framer-motion';
import { Container } from '../../common/Container';
import { useScrollAnimation } from '../../../hooks/useScrollAnimation';
import { Zap, Layers, Code, Cloud, ArrowRight } from 'lucide-react';

const features = [
  {
    icon: Zap,
    title: 'Implementación Rápida',
    description: 'Despliega sistemas multiagente en días, no en meses. Nuestra plataforma simplifica la integración.',
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-500/10',
  },
  {
    icon: Layers,
    title: 'Arquitectura Escalable',
    description: 'Sistemas diseñados para crecer con tu organización. De 10 a 10,000 usuarios sin problemas.',
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
  },
  {
    icon: Code,
    title: 'APIs Flexibles',
    description: 'Integra nuestros multiagentes con tus sistemas existentes mediante APIs RESTful modernas.',
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
  },
  {
    icon: Cloud,
    title: 'Cloud-Native',
    description: 'Infraestructura en la nube que garantiza disponibilidad 99.9% y respuestas en milisegundos.',
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
  },
];

export const AppInfoSection = () => {
  const { ref, slideInLeft, slideInRight } = useScrollAnimation();

  return (
    <section className="py-20 bg-white overflow-hidden">
      <Container>
        <div ref={ref as React.RefObject<HTMLDivElement>} className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div {...slideInLeft}>
            <h2 className="text-4xl font-bold text-dark mb-6">
              Plataforma de Clase Mundial
            </h2>

            <p className="text-neutral text-lg leading-relaxed mb-8">
              NEXUS no es solo una colección de herramientas de IA. Es una 
              plataforma completa diseñada para transformar la forma en que 
              las organizaciones operan y toman decisiones.
            </p>

            <div className="space-y-6">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-4"
                  >
                    <div className={`flex-shrink-0 w-12 h-12 ${feature.bgColor} rounded-lg flex items-center justify-center`}>
                      <Icon className={`w-6 h-6 ${feature.color}`} />
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-dark text-lg mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-neutral leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="mt-8"
            >
              <a
                href="#multiagents"
                className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white font-semibold rounded-lg hover:bg-accent/90 transition-colors shadow-lg hover:shadow-xl"
              >
                Explorar Sistemas
                <ArrowRight className="w-5 h-5" />
              </a>
            </motion.div>
          </motion.div>

          <motion.div {...slideInRight}>
            <img
              src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=600&fit=crop"
              alt="Tecnología y plataforma digital"
              className="rounded-2xl shadow-2xl w-full h-[600px] object-cover"
            />
          </motion.div>
        </div>
      </Container>
    </section>
  );
};
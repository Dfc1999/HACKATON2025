import { motion } from 'framer-motion';
import { Container } from '../../common/Container';
import { useScrollAnimation } from '../../../hooks/useScrollAnimation';
import { PerformanceMetric, PerformanceMetrics as PerformanceMetricsType, ResponsibleAI } from '../../../../domain/entities/MultiAgent.entity';
import { BarChart3, Clock, Shield, Eye, Scale, Lock } from 'lucide-react';

interface PerformanceMetricsProps {
  performanceMetrics: PerformanceMetric[] | PerformanceMetricsType;
  responsibleAI?: ResponsibleAI;
}

export const PerformanceMetrics = ({
  performanceMetrics,
  responsibleAI,
}: PerformanceMetricsProps) => {
  const { ref, fadeInUp } = useScrollAnimation();

  const isArrayMetrics = Array.isArray(performanceMetrics);

  const metricsArray = isArrayMetrics
    ? performanceMetrics
    : [
        { label: 'Precisión', value: `${(performanceMetrics as PerformanceMetricsType).accuracy}%`, description: 'Nivel de exactitud en las respuestas' },
        { label: 'Tiempo de Respuesta', value: `${(performanceMetrics as PerformanceMetricsType).responseTime}ms`, description: 'Velocidad promedio de procesamiento' },
        { label: 'Confiabilidad', value: `${(performanceMetrics as PerformanceMetricsType).reliability}%`, description: 'Estabilidad del sistema' },
      ];

  return (
    <section className="py-16 bg-gradient-to-br from-dark via-neutral to-dark">
      <Container>
        <motion.div
          ref={ref as React.RefObject<HTMLDivElement>}
          {...fadeInUp}
        >
          <h2 className="text-3xl font-bold text-primary mb-4">
            Métricas de Rendimiento
          </h2>
          <p className="text-gray-300 text-lg mb-10">
            Indicadores clave del desempeño del sistema
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {metricsArray.map((metric, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-accent/20 hover:border-accent/40 transition-colors"
              >
                <div className="flex items-center gap-3 mb-3">
                  {index === 0 && <BarChart3 className="w-6 h-6 text-primary" />}
                  {index === 1 && <Clock className="w-6 h-6 text-secondary" />}
                  {index === 2 && <Shield className="w-6 h-6 text-accent" />}
                  <h3 className="text-xl font-semibold text-primary">
                    {metric.label}
                  </h3>
                </div>
                
                <p className="text-4xl font-bold text-white mb-2">
                  {metric.value}
                </p>
                
                <p className="text-gray-400 text-sm">
                  {metric.description}
                </p>
              </motion.div>
            ))}
          </div>

          {responsibleAI && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-accent/10 border border-accent/30 rounded-xl p-8"
            >
              <h3 className="text-2xl font-bold text-primary mb-6 flex items-center gap-3">
                <Shield className="w-7 h-7" />
                IA Responsable
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-start gap-3">
                  <Eye className="w-5 h-5 text-secondary mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-secondary mb-2">
                      Transparencia
                    </h4>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {responsibleAI.transparency}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Scale className="w-5 h-5 text-secondary mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-secondary mb-2">
                      Equidad
                    </h4>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {responsibleAI.fairness}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Lock className="w-5 h-5 text-secondary mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-secondary mb-2">
                      Privacidad
                    </h4>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {responsibleAI.privacy}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </Container>
    </section>
  );
};
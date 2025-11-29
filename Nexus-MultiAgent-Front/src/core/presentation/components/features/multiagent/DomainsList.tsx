import { motion } from 'framer-motion';
import { Container } from '../../common/Container';
import { Badge } from '../../common/Badge';
import { useScrollAnimation } from '../../../hooks/useScrollAnimation';
import { Building2 } from 'lucide-react';

interface DomainsListProps {
  domains: string[];
}

export const DomainsList = ({ domains }: DomainsListProps) => {
  const { ref, fadeInUp } = useScrollAnimation();

  return (
    <section className="py-16 bg-white">
      <Container>
        <motion.div
          ref={ref as React.RefObject<HTMLDivElement>}
          {...fadeInUp}
        >
          <div className="flex items-center gap-3 mb-4">
            <Building2 className="w-8 h-8 text-accent" />
            <h2 className="text-3xl font-bold text-dark">
              Dominios de Aplicación
            </h2>
          </div>
          
          <p className="text-neutral text-lg mb-10">
            Áreas organizacionales donde este sistema puede implementarse
          </p>

          <div className="flex flex-wrap gap-4">
            {domains.map((domain, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <Badge
                  variant="accent"
                  size="lg"
                  className="text-base font-semibold shadow-md hover:shadow-lg transition-shadow cursor-default"
                >
                  {domain}
                </Badge>
              </motion.div>
            ))}
          </div>

          {domains.length === 0 && (
            <p className="text-neutral/60 text-center py-8">
              No hay dominios especificados para este sistema
            </p>
          )}
        </motion.div>
      </Container>
    </section>
  );
};
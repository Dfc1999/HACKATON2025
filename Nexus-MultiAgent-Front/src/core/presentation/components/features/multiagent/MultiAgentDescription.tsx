import { motion } from 'framer-motion';
import { Container } from '../../common/Container';
import { useScrollAnimation } from '../../../hooks/useScrollAnimation';

interface MultiAgentDescriptionProps {
  description: string;
  fullDescription?: string;
}

export const MultiAgentDescription = ({
  description,
  fullDescription,
}: MultiAgentDescriptionProps) => {
  const { ref, fadeInUp } = useScrollAnimation();

  return (
    <section className="py-16 bg-white">
      <Container>
        <motion.div
          ref={ref as React.RefObject<HTMLDivElement>}
          {...fadeInUp}
        >
          <h2 className="text-3xl font-bold text-dark mb-6">
            Descripción General
          </h2>

          <div className="prose prose-lg max-w-none">
            <p className="text-neutral leading-relaxed text-lg mb-6">
              {description}
            </p>

            {fullDescription && (
              <div className="mt-8 p-6 bg-primary/10 rounded-xl border-l-4 border-accent">
                <h3 className="text-xl font-semibold text-dark mb-4">
                  Información Detallada
                </h3>
                <p className="text-neutral leading-relaxed whitespace-pre-line">
                  {fullDescription}
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </Container>
    </section>
  );
};
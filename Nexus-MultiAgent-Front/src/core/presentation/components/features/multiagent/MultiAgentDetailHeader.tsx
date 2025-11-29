import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Container } from '../../common/Container';

interface MultiAgentDetailHeaderProps {
  title: string;
  logo?: string;
  shortDescription: string;
}

export const MultiAgentDetailHeader = ({
  title,
  logo,
  shortDescription,
}: MultiAgentDetailHeaderProps) => {
  const navigate = useNavigate();

  return (
    <section className="py-12 bg-gradient-to-br from-dark via-neutral to-dark border-b border-accent/20">
      <Container>
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-secondary hover:text-primary transition-colors mb-8 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Volver al inicio</span>
        </motion.button>

        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          {logo && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="flex-shrink-0"
            >
              <img
                src={logo}
                alt={`${title} logo`}
                className="w-24 h-24 md:w-32 md:h-32 object-contain rounded-2xl bg-white/10 p-4"
              />
            </motion.div>
          )}

          <div className="flex-1">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-4"
            >
              {title}
            </motion.h1>

           <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg md:text-xl leading-relaxed bg-white/95 text-gray-900 p-4 rounded-lg shadow-sm"
            >
              {shortDescription}
            </motion.p>
          </div>
        </div>
      </Container>
    </section>
  );
};
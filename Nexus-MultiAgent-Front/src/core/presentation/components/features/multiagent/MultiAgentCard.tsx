import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { MultiAgent } from '../../../../domain/entities/MultiAgent.entity';
import { Building2, ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface MultiAgentCardProps {
  multiAgent: MultiAgent;
  delay?: number;
}

export const MultiAgentCard = ({ multiAgent, delay = 0 }: MultiAgentCardProps) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    navigate(`/multiagent/${multiAgent.id}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`Ver detalles de ${multiAgent.title}`}
      className="relative group cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent rounded-xl overflow-hidden"
    >
      <motion.div
        className="relative bg-white rounded-xl overflow-hidden"
        animate={{
          boxShadow: isHovered
            ? '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
            : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
        }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          className="p-6 bg-gradient-to-br from-white to-primary/10"
          animate={{
            backgroundColor: isHovered ? '#f3ffd2' : '#ffffff'
          }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-start gap-4 mb-4">
            <div className="flex-shrink-0">
              <img
                src={multiAgent.logo}
                alt={`${multiAgent.title} logo`}
                className="w-16 h-16 object-contain rounded-lg"
              />
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-bold text-dark mb-2 line-clamp-2">
                {multiAgent.title}
              </h3>
              
              <div className="flex items-center gap-2 text-sm text-neutral">
                <Building2 className="w-4 h-4" />
                <span className="font-medium">
                  {multiAgent.organizationsCount} organizaciones
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {multiAgent.domains.slice(0, 3).map((domain, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-secondary/30 text-neutral text-xs font-medium rounded-full"
              >
                {domain}
              </span>
            ))}
            {multiAgent.domains.length > 3 && (
              <span className="px-3 py-1 bg-accent/20 text-neutral text-xs font-medium rounded-full">
                +{multiAgent.domains.length - 3}
              </span>
            )}
          </div>

          <motion.div
            className="flex items-center justify-center text-accent"
            animate={{
              y: isHovered ? 4 : 0
            }}
            transition={{ duration: 0.3 }}
          >
            <ChevronDown className="w-5 h-5" />
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{
            height: isHovered ? 'auto' : 0,
            opacity: isHovered ? 1 : 0
          }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
          className="overflow-hidden"
        >
          <div className="px-6 pb-6 pt-4 bg-gradient-to-br from-secondary/10 to-primary/20 border-t border-secondary/30">
            <p className="text-neutral text-sm leading-relaxed mb-4">
              {multiAgent.shortDescription}
            </p>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {multiAgent.capabilities.slice(0, 4).map((capability, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-white/60 text-neutral text-xs rounded-md"
                >
                  {capability}
                </span>
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-2.5 bg-accent text-white font-semibold rounded-lg hover:bg-accent/90 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                handleClick();
              }}
            >
              Ver detalles
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};
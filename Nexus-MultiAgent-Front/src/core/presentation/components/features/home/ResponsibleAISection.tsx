import { motion } from 'framer-motion';
import { Shield, Eye, Scale, Lock, Heart, FileCheck } from 'lucide-react';

const Container = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>
    {children}
  </div>
);

const principles = [
  {
    icon: Eye,
    title: 'Transparencia',
    description: 'Documentamos claramente cómo funcionan nuestros sistemas y qué decisiones toman.',
  },
  {
    icon: Scale,
    title: 'Equidad',
    description: 'Diseñamos sistemas que tratan a todos los usuarios de manera justa y sin sesgos.',
  },
  {
    icon: Lock,
    title: 'Privacidad',
    description: 'Protegemos los datos de nuestros usuarios con los más altos estándares de seguridad.',
  },
  {
    icon: Heart,
    title: 'Bienestar Social',
    description: 'Priorizamos el impacto positivo en la sociedad y el bienestar humano.',
  },
  {
    icon: FileCheck,
    title: 'Accountability',
    description: 'Asumimos responsabilidad total por el comportamiento de nuestros sistemas.',
  },
  {
    icon: Shield,
    title: 'Seguridad',
    description: 'Implementamos controles rigurosos para prevenir usos indebidos o maliciosos.',
  },
];

export default function ResponsibleAISection() {
  return (
    <section className="relative py-20 overflow-hidden text-white">
      {/* Fondo base guindo oscuro */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#2a1a28] via-[#3d2438] to-[#2a1a28]" />
      
      {/* Capa de puntos animados */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)',
            backgroundSize: '50px 50px',
            animation: 'moveDots 20s linear infinite',
          }}
        />
      </div>

      {/* Partículas flotantes grandes */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-64 h-64 bg-red-800/10 rounded-full blur-3xl"
            animate={{
              x: [0, 100, 0],
              y: [0, -100, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 15 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 2,
            }}
            style={{
              left: `${(i * 20) % 100}%`,
              top: `${(i * 15) % 100}%`,
            }}
          />
        ))}
      </div>

      {/* Ondas animadas */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        <motion.div
          className="absolute w-full h-full"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(220, 38, 38, 0.3) 0%, transparent 70%)',
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Grid de líneas sutiles */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '100px 100px',
        }}
      />

      {/* Degradados en bordes */}
      <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-transparent via-[#2a1a28]/50 to-[#2a1a28]" />
      <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-transparent via-[#2a1a28]/50 to-[#2a1a28]" />

      <Container className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-3 mb-4">
            <motion.div
              animate={{ 
                rotate: [0, 5, -5, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Shield className="w-12 h-12 text-red-500" />
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
              IA Responsable
            </h2>
          </div>
          
          <p className="text-gray-200 text-lg max-w-3xl mx-auto leading-relaxed">
            En NEXUS, estamos comprometidos con el desarrollo ético de inteligencia 
            artificial. Nuestros principios guían cada decisión y cada línea de código.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {principles.map((principle, index) => {
            const Icon = principle.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ 
                  y: -8,
                  transition: { duration: 0.3 }
                }}
                className="group p-6 bg-white/5 backdrop-blur-md border border-red-800/30 rounded-xl hover:border-red-600/60 hover:bg-white/10 transition-all duration-300 hover:shadow-2xl hover:shadow-red-900/20"
              >
                <motion.div 
                  className="w-14 h-14 bg-gradient-to-br from-red-900/40 to-red-800/40 rounded-lg flex items-center justify-center mb-4 group-hover:from-red-800/60 group-hover:to-red-700/60 transition-all duration-300"
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                >
                  <Icon className="w-7 h-7 text-red-400 group-hover:text-red-300 transition-colors" />
                </motion.div>
                
                <h3 className="text-xl font-semibold text-red-400 mb-3 group-hover:text-red-300 transition-colors">
                  {principle.title}
                </h3>
                
                <p className="text-gray-300 leading-relaxed group-hover:text-gray-200 transition-colors">
                  {principle.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mt-12 p-8 bg-gradient-to-r from-red-950/40 via-red-900/30 to-red-950/40 backdrop-blur-md border border-red-800/40 rounded-2xl text-center shadow-2xl hover:shadow-red-900/30 transition-shadow duration-300"
        >
          <p className="text-gray-100 text-lg leading-relaxed">
            <strong className="text-red-400 font-bold">Nuestro compromiso:</strong> Cada sistema 
            que desarrollamos pasa por rigurosos controles éticos y pruebas de sesgo 
            antes de llegar a producción. La IA responsable no es opcional, es fundamental.
          </p>
        </motion.div>
      </Container>

      <style>{`
        @keyframes moveDots {
          0% { 
            background-position: 0 0; 
          }
          100% { 
            background-position: 50px 50px; 
          }
        }
      `}</style>
    </section>
  );
}
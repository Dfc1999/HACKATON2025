import { motion } from 'framer-motion';
import { Container } from '../../common/Container';
import { useScrollAnimation } from '../../../hooks/useScrollAnimation';
import { Users, Target, Lightbulb, Sparkles } from 'lucide-react';

export const AboutUsSection = () => {
  const { ref, slideInLeft, slideInRight } = useScrollAnimation();

  return (
    <section 
      className="relative py-20 bg-gradient-to-b from-white via-gray-50 to-white overflow-hidden"
    >
      {/* Efectos de fondo decorativos */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-72 h-72 bg-red-100 rounded-full blur-3xl opacity-20" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-20" />
      </div>

      <Container>
        <div 
          ref={ref as React.RefObject<HTMLDivElement>} 
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10"
        >
          {/* Columna de texto */}
          <motion.div {...slideInLeft}>
            <div className="flex items-center gap-3 mb-6">
              <motion.div
                className="w-14 h-14 bg-gradient-to-br from-red-500 to-red-700 rounded-2xl flex items-center justify-center shadow-lg"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.3 }}
              >
                <Users className="w-7 h-7 text-white" />
              </motion.div>
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Quiénes Somos
              </h2>
            </div>

            <div className="relative">
              <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-red-500 via-red-600 to-transparent rounded-full" />
              
              <p className="text-gray-700 text-lg leading-relaxed mb-8 pl-4">
                NEXUS es una empresa pionera en el desarrollo y comercialización de 
                sistemas de multiagentes de inteligencia artificial. Nuestro equipo 
                está conformado por expertos en IA, ingeniería de software y consultoría 
                organizacional, comprometidos con la excelencia y la innovación.
              </p>
            </div>

            <div className="space-y-5">
              {/* Tarjeta Misión */}
              <motion.div 
                className="group relative p-6 bg-gradient-to-br from-white to-red-50 border-2 border-red-200/50 rounded-2xl shadow-lg hover:shadow-2xl hover:border-red-300 transition-all duration-300 overflow-hidden"
                whileHover={{ y: -4 }}
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-2xl" />
                
                <div className="flex items-start gap-4 relative z-10">
                  <motion.div 
                    className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-700 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md group-hover:shadow-red-500/30 transition-shadow"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Target className="w-6 h-6 text-white" />
                  </motion.div>
                  
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                      Nuestra Misión
                      <Sparkles className="w-4 h-4 text-red-500" />
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      Democratizar el acceso a sistemas de IA avanzados que impulsen 
                      la eficiencia y transformación digital de las organizaciones.
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Tarjeta Visión */}
              <motion.div 
                className="group relative p-6 bg-gradient-to-br from-white to-blue-50 border-2 border-blue-200/50 rounded-2xl shadow-lg hover:shadow-2xl hover:border-blue-300 transition-all duration-300 overflow-hidden"
                whileHover={{ y: -4 }}
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl" />
                
                <div className="flex items-start gap-4 relative z-10">
                  <motion.div 
                    className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md group-hover:shadow-blue-500/30 transition-shadow"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Lightbulb className="w-6 h-6 text-white" />
                  </motion.div>
                  
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                      Nuestra Visión
                      <Sparkles className="w-4 h-4 text-blue-500" />
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      Ser líderes globales en soluciones de multiagentes de IA, 
                      reconocidos por la innovación, calidad y compromiso con la 
                      IA responsable.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Columna de imagen */}
          <motion.div {...slideInRight} className="relative">
            {/* Decoración detrás de la imagen */}
            <div className="absolute -top-6 -right-6 w-full h-full bg-gradient-to-br from-red-500/20 to-blue-500/20 rounded-3xl blur-2xl" />
            
            <motion.div
              className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTzF6NzhlMrfZ01-b579l2GjF3xYGZmUpb2SA&s"
                alt="Equipo trabajando en colaboración"
                className="w-full h-[500px] object-cover"
              />
              
              {/* Overlay gradiente */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
            </motion.div>

            {/* Badge decorativo */}
            <motion.div 
              className="absolute -bottom-4 -left-4 bg-gradient-to-br from-red-600 to-red-800 text-white px-6 py-3 rounded-2xl shadow-2xl"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
            >
              <p className="text-sm font-semibold">Innovación</p>
              <p className="text-2xl font-bold">100%</p>
            </motion.div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
};
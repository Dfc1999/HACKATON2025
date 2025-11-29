import { HeroCarousel } from '../core/presentation/components/features/carousel/HeroCarousel';
import { CompanyMotto } from '../core/presentation/components/features/home/CompanyMotto';
import { AboutUsSection } from '../core/presentation/components/features/home/AboutUsSection';
import { ObjectivesSection } from '../core/presentation/components/features/home/ObjectivesSection';
import { ResponsibleAISection } from '../core/presentation/components/features/home/ResponsibleAISection';
import { AppInfoSection } from '../core/presentation/components/features/home/AppInfoSection';
import { MultiAgentGrid } from '../core/presentation/components/features/multiagent/MultiAgentGrid';
import { Container } from '../core/presentation/components/common/Container';

export const HomePage = () => {
  return (
    <div className="min-h-screen">
      <HeroCarousel />
      
      <CompanyMotto />
      
      <AboutUsSection />
      
      <section id="multiagents" className="py-20 bg-white">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-dark mb-4">
              Nuestros Sistemas Multiagente
            </h2>
            <p className="text-neutral text-lg max-w-3xl mx-auto">
              Descubre soluciones de IA especializadas para diferentes dominios organizacionales
            </p>
          </div>
          
          <MultiAgentGrid />
        </Container>
      </section>

      <ObjectivesSection />
      
      <AppInfoSection />
      
      <ResponsibleAISection />
    </div>
  );
};
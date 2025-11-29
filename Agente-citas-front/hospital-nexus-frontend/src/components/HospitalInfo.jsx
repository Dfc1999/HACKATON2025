import { Heart, Users, Award, Clock } from 'lucide-react';
import './HospitalInfo.css';

function HospitalInfo() {
  const features = [
    {
      icon: <Heart size={40} />,
      title: 'Atención de Calidad',
      description: 'Brindamos servicios médicos de excelencia con tecnología de punta'
    },
    {
      icon: <Users size={40} />,
      title: 'Equipo Profesional',
      description: 'Contamos con médicos especialistas altamente capacitados'
    },
    {
      icon: <Award size={40} />,
      title: 'Certificaciones',
      description: 'Acreditados por organismos nacionales e internacionales'
    },
    {
      icon: <Clock size={40} />,
      title: 'Disponibilidad 24/7',
      description: 'Emergencias y urgencias atendidas las 24 horas del día'
    }
  ];

  return (
    <section className="hospital-info">
      <div className="hero-section">
        <h1>Bienvenido a Hospital Nexus</h1>
        <p className="hero-subtitle">
          Tu salud es nuestra prioridad. Ofrecemos servicios médicos integrales 
          con la más alta calidad y calidez humana.
        </p>
      </div>

      <div className="features-grid">
        {features.map((feature, index) => (
          <div key={index} className="feature-card">
            <div className="feature-icon">{feature.icon}</div>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </div>
        ))}
      </div>

      <div className="services-section">
        <h2>Nuestros Servicios</h2>
        <div className="services-list">
          <div className="service-item">Medicina General</div>
          <div className="service-item">Pediatría</div>
          <div className="service-item">Cardiología</div>
          <div className="service-item">Traumatología</div>
          <div className="service-item">Ginecología</div>
          <div className="service-item">Laboratorio Clínico</div>
          <div className="service-item">Imagenología</div>
          <div className="service-item">Emergencias</div>
        </div>
      </div>
    </section>
  );
}

export default HospitalInfo;
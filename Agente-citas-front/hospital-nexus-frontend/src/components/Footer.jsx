import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>Hospital Nexus</h3>
          <p>Cuidando tu salud con excelencia y compromiso</p>
        </div>
        
        <div className="footer-section">
          <h4>Contacto</h4>
          <div className="contact-item">
            <Phone size={16} />
            <span>+591 2-1234567</span>
          </div>
          <div className="contact-item">
            <Mail size={16} />
            <span>info@hospitalnexus.com</span>
          </div>
          <div className="contact-item">
            <MapPin size={16} />
            <span>La Paz, Bolivia</span>
          </div>
        </div>
        
        <div className="footer-section">
          <h4>Horarios</h4>
          <div className="contact-item">
            <Clock size={16} />
            <span>Emergencias: 24/7</span>
          </div>
          <div className="contact-item">
            <Clock size={16} />
            <span>Consultas: 8:00 - 20:00</span>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; 2025 Hospital Nexus. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}

export default Footer;
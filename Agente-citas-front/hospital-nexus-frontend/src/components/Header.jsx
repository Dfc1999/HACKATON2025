import { Activity, Calendar, FileText, User, LogOut } from 'lucide-react';
import './Header.css';

function Header({ isLoggedIn, user, onLoginClick, onLogout }) {
  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <Activity size={32} className="logo-icon" />
          <span className="logo-text">Hospital Nexus</span>
        </div>
        
        <nav className="nav">
          <a href="#servicios" className="nav-link">
            <FileText size={18} />
            Servicios
          </a>
          <a href="#citas" className="nav-link">
            <Calendar size={18} />
            Mis Citas
          </a>
          <a href="#resultados" className="nav-link">
            <FileText size={18} />
            Resultados
          </a>
          
          {isLoggedIn ? (
            <div className="user-menu">
              <span className="user-name">
                <User size={18} />
                {user?.name || 'Usuario'}
              </span>
              <button onClick={onLogout} className="logout-btn">
                <LogOut size={18} />
                Cerrar Sesión
              </button>
            </div>
          ) : (
            <button onClick={onLoginClick} className="login-btn">
              <User size={18} />
              Iniciar Sesión
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;
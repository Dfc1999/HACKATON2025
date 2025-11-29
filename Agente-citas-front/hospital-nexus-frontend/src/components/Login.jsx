import { useState } from 'react';
import { X, User, Lock } from 'lucide-react';
import './Login.css';

function Login({ onLogin, onClose }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    setError('');

    if (!email || !password) {
      setError('Por favor completa todos los campos');
      return;
    }

    // Simulación de login - aquí conectarías con tu backend
    const userData = {
      name: 'Juan Pérez',
      email: email,
      id: '12345'
    };

    onLogin(userData);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="login-overlay">
      <div className="login-modal">
        <button className="close-btn" onClick={onClose}>
          <X size={24} />
        </button>
        
        <div className="login-header">
          <h2>Iniciar Sesión</h2>
          <p>Accede a tu cuenta de Hospital Nexus</p>
        </div>

        <div className="login-form">
          <div className="form-group">
            <label htmlFor="email">
              <User size={18} />
              Correo Electrónico
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="tu@email.com"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">
              <Lock size={18} />
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="••••••••"
              className="form-input"
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button onClick={handleSubmit} className="submit-btn">
            Iniciar Sesión
          </button>

          <div className="login-footer">
            <a href="#" className="link">¿Olvidaste tu contraseña?</a>
            <p>¿No tienes cuenta? <a href="#" className="link">Regístrate</a></p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry }) => {
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem',
    textAlign: 'center',
  };

  const iconStyle: React.CSSProperties = {
    width: '3rem',
    height: '3rem',
    color: '#c1a2a0',
    marginBottom: '1rem',
  };

  const textStyle: React.CSSProperties = {
    color: '#725b75',
    marginBottom: '1rem',
    fontSize: '1rem',
  };

  const buttonStyle: React.CSSProperties = {
    backgroundColor: '#725b75',
    color: '#fcfdeb',
    border: 'none',
    borderRadius: '0.75rem',
    padding: '0.75rem 1.5rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.3s ease-in-out',
  };

  const hoverStyle: React.CSSProperties = {
    backgroundColor: '#322030',
    transform: 'scale(1.05)',
  };

  return (
    <div style={containerStyle}>
      <AlertCircle style={iconStyle} />
      <p style={textStyle}>{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          style={buttonStyle}
          onMouseEnter={(e) => Object.assign(e.currentTarget.style, hoverStyle)}
          onMouseLeave={(e) => Object.assign(e.currentTarget.style, buttonStyle)}
        >
          Reintentar
        </button>
      )}
    </div>
  );
};
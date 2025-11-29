import React from 'react';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  children,
  className = '',
  disabled = false,
}) => {
  const baseStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    fontWeight: 600,
    borderRadius: '12px',
    border: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    opacity: disabled ? 0.6 : 1,
    position: 'relative',
    overflow: 'hidden',
  };

  const sizeStyles = {
    sm: {
      padding: '8px 16px',
      fontSize: '14px',
      minHeight: '36px',
    },
    md: {
      padding: '12px 24px',
      fontSize: '16px',
      minHeight: '44px',
    },
    lg: {
      padding: '16px 32px',
      fontSize: '18px',
      minHeight: '52px',
    },
  };

  const variantStyles = {
    primary: {
      backgroundColor: '#725b75',
      color: '#fcfdeb',
      boxShadow: '0 4px 12px rgba(114, 91, 117, 0.3)',
    },
    secondary: {
      backgroundColor: '#e3cebd',
      color: '#322030',
      boxShadow: '0 4px 12px rgba(227, 206, 189, 0.3)',
    },
    outline: {
      backgroundColor: 'transparent',
      color: '#725b75',
      border: '2px solid #725b75',
      boxShadow: 'none',
    },
    ghost: {
      backgroundColor: 'transparent',
      color: '#725b75',
      border: 'none',
      boxShadow: 'none',
    },
  };

  const hoverStyles = {
    primary: {
      backgroundColor: '#322030',
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 24px rgba(50, 32, 48, 0.4)',
    },
    secondary: {
      backgroundColor: '#c1a2a0',
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 24px rgba(193, 162, 160, 0.4)',
    },
    outline: {
      backgroundColor: '#725b75',
      color: '#fcfdeb',
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 24px rgba(114, 91, 117, 0.3)',
    },
    ghost: {
      backgroundColor: 'rgba(114, 91, 117, 0.1)',
      transform: 'translateY(-2px)',
    },
  };

  const styles: React.CSSProperties = {
    ...baseStyle,
    ...sizeStyles[size],
    ...variantStyles[variant],
  };

  return (
    <button
      style={styles}
      className={className}
      disabled={disabled || isLoading}
      onMouseEnter={(e) => {
        if (!disabled && !isLoading) {
          Object.assign(e.currentTarget.style, hoverStyles[variant]);
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled && !isLoading) {
          Object.assign(e.currentTarget.style, {
            ...baseStyle,
            ...sizeStyles[size],
            ...variantStyles[variant],
          });
        }
      }}
    >
      {isLoading ? (
        <>
          <div
            style={{
              width: '16px',
              height: '16px',
              border: '2px solid currentColor',
              borderTopColor: 'transparent',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
            }}
          />
          <span>Cargando...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
};
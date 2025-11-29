import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
  variant?: 'default' | 'glass' | 'elevated';
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hover = false,
  onClick,
  variant = 'default',
}) => {
  const baseStyle: React.CSSProperties = {
    background: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(12px)',
    borderRadius: '16px',
    border: '1px solid rgba(130, 189, 167, 0.1)',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
    padding: '24px',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: onClick ? 'pointer' : 'default',
    position: 'relative',
    overflow: 'hidden',
  };

  const variantStyles = {
    default: {
      background: 'rgba(252, 253, 235, 0.9)',
      border: '1px solid rgba(193, 162, 160, 0.1)',
    },
    glass: {
      background: 'rgba(227, 206, 189, 0.7)',
      backdropFilter: 'blur(16px)',
      border: '1px solid rgba(227, 206, 189, 0.2)',
    },
    elevated: {
      background: '#fcfdeb',
      border: '1px solid rgba(114, 91, 117, 0.2)',
      boxShadow: '0 8px 32px rgba(50, 32, 48, 0.12)',
    },
  };

  const hoverStyle: React.CSSProperties = {
    transform: 'translateY(-8px)',
    boxShadow: '0 20px 40px rgba(50, 32, 48, 0.15)',
    borderColor: 'rgba(114, 91, 117, 0.3)',
  };

  const styles: React.CSSProperties = {
    ...baseStyle,
    ...variantStyles[variant],
  };

  return (
    <div
      style={styles}
      className={className}
      onClick={onClick}
      onMouseEnter={(e) => {
        if (hover && !onClick) {
          Object.assign(e.currentTarget.style, hoverStyle);
        }
      }}
      onMouseLeave={(e) => {
        if (hover && !onClick) {
          Object.assign(e.currentTarget.style, {
            ...baseStyle,
            ...variantStyles[variant],
          });
        }
      }}
      onMouseDown={(e) => {
        if (onClick) {
          e.currentTarget.style.transform = 'translateY(-2px) scale(0.98)';
        }
      }}
      onMouseUp={(e) => {
        if (onClick) {
          Object.assign(e.currentTarget.style, {
            ...baseStyle,
            ...variantStyles[variant],
            ...(hover ? hoverStyle : {}),
          });
        }
      }}
    >
      {children}
    </div>
  );
};
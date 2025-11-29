import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'accent' | 'neutral' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  animate?: boolean;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'secondary',
  size = 'md',
  animate = false,
  className = '',
}) => {
  const baseStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 600,
    borderRadius: '9999px',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    border: '1px solid transparent',
  };

  const sizeStyles = {
    sm: {
      padding: '4px 12px',
      fontSize: '12px',
      lineHeight: '16px',
    },
    md: {
      padding: '6px 16px',
      fontSize: '14px',
      lineHeight: '20px',
    },
    lg: {
      padding: '8px 20px',
      fontSize: '16px',
      lineHeight: '24px',
    },
  };

  const variantStyles = {
    primary: {
      backgroundColor: 'rgba(243, 255, 210, 0.2)',
      color: '#2e0527',
      borderColor: 'rgba(243, 255, 210, 0.3)',
    },
    secondary: {
      backgroundColor: 'rgba(191, 241, 206, 0.2)',
      color: '#2e0527',
      borderColor: 'rgba(191, 241, 206, 0.3)',
    },
    accent: {
      backgroundColor: 'rgba(130, 189, 167, 0.2)',
      color: '#2e0527',
      borderColor: 'rgba(130, 189, 167, 0.3)',
    },
    neutral: {
      backgroundColor: 'rgba(110, 131, 124, 0.2)',
      color: '#2e0527',
      borderColor: 'rgba(110, 131, 124, 0.3)',
    },
    dark: {
      backgroundColor: 'rgba(46, 5, 39, 0.2)',
      color: '#2e0527',
      borderColor: 'rgba(46, 5, 39, 0.3)',
    },
  };

  const styles: React.CSSProperties = {
    ...baseStyle,
    ...sizeStyles[size],
    ...variantStyles[variant],
  };

  if (animate) {
    styles.animation = 'pulse 2s infinite';
  }

  return (
    <span 
      style={styles} 
      className={className}
      onMouseEnter={(e) => {
        if (animate) return;
        e.currentTarget.style.transform = 'scale(1.05)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
      }}
      onMouseLeave={(e) => {
        if (animate) return;
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {children}
    </span>
  );
};
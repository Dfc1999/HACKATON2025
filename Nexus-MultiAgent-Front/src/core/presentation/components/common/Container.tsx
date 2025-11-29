import React from 'react';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
}

export const Container: React.FC<ContainerProps> = ({
  children,
  className = '',
  size,
  maxWidth,
}) => {
  const sizeValue = size || maxWidth || 'xl';

  const maxWidths: Record<string, string> = {
    sm: '600px',
    md: '800px',
    lg: '1000px',
    xl: '1200px',
    '2xl': '1400px',
    full: '100%',
  };

  const style: React.CSSProperties = {
    maxWidth: maxWidths[sizeValue],
    margin: '0 auto',
    padding: '0 1rem',
    boxSizing: 'border-box',
  };

  return (
    <div style={style} className={className}>
      {children}
    </div>
  );
};
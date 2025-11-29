import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  className = '',
}) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div
        className={className}
        style={{
          width: size === 'sm' ? '16px' : size === 'md' ? '32px' : '48px',
          height: size === 'sm' ? '16px' : size === 'md' ? '32px' : '48px',
          borderWidth: size === 'sm' ? '2px' : size === 'md' ? '3px' : '4px',
          borderStyle: 'solid',
          borderColor: '#3b82f6',
          borderTopColor: 'transparent',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}
      />
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
import React from 'react';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'small' | 'medium' | 'large';
  overlay?: boolean;
  fullScreen?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message,
  size = 'medium',
  overlay = false,
  fullScreen = false,
}) => {
  const sizeStyles = {
    small: 'w-6 h-6',
    medium: 'w-12 h-12',
    large: 'w-16 h-16',
  };

  const containerStyles = fullScreen
    ? 'fixed inset-0 z-50'
    : overlay
    ? 'absolute inset-0 z-40'
    : 'relative';

  const Spinner = () => (
    <div className="relative">
      <div
        className={`${sizeStyles[size]} border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin`}
        role="status"
        aria-live="polite"
        aria-label="Cargando"
      />
      <div
        className={`absolute inset-0 ${sizeStyles[size]} border-4 border-transparent border-r-cyan-400 rounded-full animate-spin-reverse opacity-60`}
        style={{ animationDuration: '1.5s' }}
      />
    </div>
  );

  const content = (
    <div className="flex flex-col items-center justify-center gap-4 p-4">
      <Spinner />
      {message && (
        <p className="text-sm sm:text-base text-gray-700 font-medium text-center max-w-xs">
          {message}
        </p>
      )}
    </div>
  );

  if (overlay || fullScreen) {
    return (
      <div className={containerStyles}>
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm" />
        <div className="relative h-full flex items-center justify-center">
          {content}
        </div>
      </div>
    );
  }

  return content;
};

export default LoadingSpinner;

const styles = `
  @keyframes spin-reverse {
    from {
      transform: rotate(360deg);
    }
    to {
      transform: rotate(0deg);
    }
  }
  
  .animate-spin-reverse {
    animation: spin-reverse 1s linear infinite;
  }
`;

if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}
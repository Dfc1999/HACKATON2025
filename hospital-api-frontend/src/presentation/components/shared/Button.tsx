import React from 'react';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  onClick?: () => void;
  children: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
  fullWidth?: boolean;
  ariaLabel?: string;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  icon,
  onClick,
  children,
  type = 'button',
  fullWidth = false,
  ariaLabel,
}) => {
  const baseStyles = `
    relative inline-flex items-center justify-center font-semibold
    rounded-xl transition-all duration-300 ease-in-out
    focus:outline-none focus:ring-4 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
    active:scale-95 transform
    shadow-lg hover:shadow-xl
  `;

  const variantStyles = {
    primary: `
      bg-gradient-to-r from-blue-600 to-blue-700 
      hover:from-blue-700 hover:to-blue-800
      text-white border-2 border-blue-700
      focus:ring-blue-300
      shadow-blue-200
    `,
    secondary: `
      bg-gradient-to-r from-cyan-400 to-teal-400
      hover:from-cyan-500 hover:to-teal-500
      text-white border-2 border-cyan-500
      focus:ring-cyan-200
      shadow-cyan-100
    `,
    danger: `
      bg-gradient-to-r from-red-500 to-red-600
      hover:from-red-600 hover:to-red-700
      text-white border-2 border-red-600
      focus:ring-red-200
      shadow-red-100
    `,
    ghost: `
      bg-white hover:bg-gray-50
      text-blue-600 border-2 border-blue-600
      hover:border-blue-700 hover:text-blue-700
      focus:ring-blue-200
      shadow-gray-100
    `,
  };

  const sizeStyles = {
    small: 'px-4 py-2 text-sm gap-2 min-h-[36px]',
    medium: 'px-6 py-3 text-base gap-2 min-h-[44px]',
    large: 'px-8 py-4 text-lg gap-3 min-h-[52px]',
  };

  const widthStyles = fullWidth ? 'w-full' : '';

  const handleClick = () => {
    if (!disabled && !loading && onClick) {
      onClick();
    }
  };

  return (
    <button
      type={type}
      onClick={handleClick}
      disabled={disabled || loading}
      aria-label={ariaLabel}
      aria-busy={loading}
      className={`
        ${baseStyles}
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${widthStyles}
      `}
    >
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-inherit rounded-xl">
          <svg
            className="animate-spin h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </div>
      )}
      
      <span className={`flex items-center gap-2 ${loading ? 'invisible' : 'visible'}`}>
        {icon && <span className="flex-shrink-0">{icon}</span>}
        {children}
      </span>
    </button>
  );
};

export default Button;
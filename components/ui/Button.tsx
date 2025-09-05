
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
}

export const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseStyles = "px-4 py-2 rounded-md font-semibold text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition-transform transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variantStyles = {
    primary: 'bg-primary hover:bg-indigo-700 focus:ring-indigo-500',
    secondary: 'bg-secondary hover:bg-emerald-600 focus:ring-emerald-500',
    danger: 'bg-danger hover:bg-red-700 focus:ring-red-500',
  };

  return (
    <button className={`${baseStyles} ${variantStyles[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

import React from 'react';
import './Button.css';

const Button = ({
  children,
  type = 'button',
  variant = 'primary', // primary | secondary | outline | danger
  size = 'md',        // sm | md | lg
  onClick,
  disabled = false,
  className = '',
  icon: Icon = null,
  ...props
}) => {
  return (
    <button
      type={type}
      className={`btn btn-${variant} btn-${size} ${disabled ? 'disabled' : ''} ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {Icon && <span className="btn-icon"><Icon /></span>}
      {children && <span className="btn-text">{children}</span>}
    </button>
  );
};

export default Button;

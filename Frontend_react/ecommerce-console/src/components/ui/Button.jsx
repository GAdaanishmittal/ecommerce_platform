import React from 'react';

const Button = ({ 
  children, 
  onClick, 
  type = 'button', 
  variant = 'primary', 
  disabled = false, 
  className = '',
  ...props 
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${variant === 'secondary' ? 'secondary' : ''} ${className}`.trim()}
      style={{
        width: props.fullWidth ? '100%' : 'auto',
        ...props.style,
      }}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;

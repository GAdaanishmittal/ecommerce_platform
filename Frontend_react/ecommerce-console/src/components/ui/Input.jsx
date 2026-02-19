import React from 'react';

const Input = ({
  label,
  name,
  value,
  onChange,
  error,
  placeholder,
  type = 'text',
  required = false,
  className = '',
  ...props
}) => {
  return (
    <div className="field">
      {label && (
        <label htmlFor={name} className="field-label">
          {label} {required && <span>*</span>}
        </label>
      )}
      <input
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        type={type}
        required={required}
        className={className}
        {...props}
      />
      {error && (
        <div className="field-error">
          !! {error}
        </div>
      )}
    </div>
  );
};

export default Input;

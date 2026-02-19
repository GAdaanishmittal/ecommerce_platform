import React from 'react';

const TextArea = ({
  label,
  name,
  value,
  onChange,
  error,
  placeholder,
  required = false,
  rows = 4,
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
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        rows={rows}
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

export default TextArea;

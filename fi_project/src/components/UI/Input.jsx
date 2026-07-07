import React from 'react';
import './Input.css';

const Input = ({
  label,
  id,
  type = 'text',
  error,
  required = false,
  className = '',
  icon: Icon = null,
  ...props
}) => {
  return (
    <div className={`input-group-wrapper ${className} ${error ? 'has-error' : ''}`}>
      {label && (
        <label htmlFor={id} className="input-label">
          {label} {required && <span className="required-star">*</span>}
        </label>
      )}
      <div className="input-field-container">
        {Icon && <span className="input-field-icon"><Icon /></span>}
        <input
          type={type}
          id={id}
          className={`input-control ${Icon ? 'with-icon' : ''}`}
          required={required}
          {...props}
        />
      </div>
      {error && <span className="input-error-msg">{error}</span>}
    </div>
  );
};

export default Input;

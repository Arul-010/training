import React from 'react';
import './Input.css';
import './SelectInput.css';

/**
 * Reusable select dropdown component.
 * Shares label/error styling with the Input component.
 *
 * @param {string} label - Field label text
 * @param {string} id - HTML id (linked to label htmlFor)
 * @param {string} [error] - Validation error message
 * @param {boolean} [required=false] - Shows required asterisk
 * @param {string} [className=''] - Extra wrapper class
 * @param {React.ReactNode} children - <option> elements
 */
const SelectInput = ({
  label,
  id,
  error,
  required = false,
  className = '',
  children,
  ...props
}) => {
  return (
    <div className={`input-group-wrapper select-group-wrapper ${className} ${error ? 'has-error' : ''}`}>
      {label && (
        <label htmlFor={id} className="input-label">
          {label} {required && <span className="required-star">*</span>}
        </label>
      )}
      <select
        id={id}
        className="select-form-control"
        required={required}
        {...props}
      >
        {children}
      </select>
      {error && <span className="input-error-msg">{error}</span>}
    </div>
  );
};

export default SelectInput;

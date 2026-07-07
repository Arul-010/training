import React from 'react';
import { useEmployees } from '../../context/EmployeeContext';
import { FiCheckCircle, FiAlertCircle, FiInfo, FiAlertTriangle, FiX } from 'react-icons/fi';
import './Toast.css';

const ToastItem = ({ id, message, type, onRemove }) => {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <FiCheckCircle className="toast-icon success" />;
      case 'error':
        return <FiAlertCircle className="toast-icon error" />;
      case 'warning':
        return <FiAlertTriangle className="toast-icon warning" />;
      case 'info':
      default:
        return <FiInfo className="toast-icon info" />;
    }
  };

  return (
    <div className={`toast-item toast-${type}`}>
      <div className="toast-content-wrapper">
        {getIcon()}
        <span className="toast-message">{message}</span>
      </div>
      <button className="toast-close-btn" onClick={() => onRemove(id)} aria-label="Dismiss toast">
        <FiX />
      </button>
      <div className="toast-progress-bar"></div>
    </div>
  );
};

const ToastContainer = () => {
  const { toasts, removeToast } = useEmployees();

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          id={toast.id}
          message={toast.message}
          type={toast.type}
          onRemove={removeToast}
        />
      ))}
    </div>
  );
};

export default ToastContainer;
export { ToastItem };

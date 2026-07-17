import React, { useEffect } from 'react';
import { useEmployees } from '../../context/EmployeeContext';
import Button from '../UI/Button';
import { FiAlertTriangle, FiX } from 'react-icons/fi';
import './ConfirmationModal.css';

const ConfirmationModal = () => {
  const { confirmModal, closeConfirmation } = useEmployees();
  const { isOpen, message, onConfirm } = confirmModal;

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={closeConfirmation}>
      <div className="modal-card fade-in" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={closeConfirmation} aria-label="Close dialog">
          <FiX />
        </button>
        <div className="modal-body">
          <div className="modal-icon-warning">
            <FiAlertTriangle />
          </div>
          <h3 className="modal-title">Confirm Action</h3>
          <p className="modal-message">{message || 'Are you sure you want to proceed?'}</p>
        </div>
        <div className="modal-actions">
          <Button variant="secondary" onClick={closeConfirmation}>
            Cancel
          </Button>
          <Button variant="danger" onClick={onConfirm}>
            Yes, Delete
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;

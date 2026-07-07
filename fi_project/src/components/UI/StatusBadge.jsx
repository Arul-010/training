import React from 'react';
import './StatusBadge.css';

const StatusBadge = ({ status, className = '' }) => {
  const getStatusClass = (status) => {
    switch (status) {
      case 'Active':
        return 'status-active';
      case 'On Leave':
        return 'status-leave';
      case 'Terminated':
        return 'status-terminated';
      default:
        return '';
    }
  };

  return (
    <span className={`status-pill ${getStatusClass(status)} ${className}`}>
      {status}
    </span>
  );
};

export default StatusBadge;

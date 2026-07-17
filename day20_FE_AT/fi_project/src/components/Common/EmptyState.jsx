import React from 'react';
import { FiUsers, FiSearch } from 'react-icons/fi';
import Button from '../UI/Button';
import './EmptyState.css';

const EmptyState = ({
  title = 'No Data Found',
  description = 'There is currently no information to display here.',
  iconType = 'users', // users | search
  actionLabel,
  onActionClick
}) => {
  return (
    <div className="empty-state-card fade-in">
      <div className="empty-state-icon-container">
        {iconType === 'search' ? (
          <FiSearch className="empty-state-icon" />
        ) : (
          <FiUsers className="empty-state-icon" />
        )}
      </div>
      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-desc">{description}</p>
      {actionLabel && onActionClick && (
        <Button variant="primary" onClick={onActionClick} className="empty-state-btn">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;

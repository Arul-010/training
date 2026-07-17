import React from 'react';
import './LoadingState.css';

const LoadingState = ({
  message = 'Loading data...',
  fullScreen = false
}) => {
  return (
    <div className={`loading-state-wrapper ${fullScreen ? 'fullscreen' : ''}`}>
      <div className="loading-spinner-container">
        <div className="loading-spinner"></div>
        <p className="loading-message">{message}</p>
      </div>
    </div>
  );
};

export default LoadingState;

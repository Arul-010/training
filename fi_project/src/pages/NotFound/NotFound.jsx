import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiHome } from 'react-icons/fi';
import Button from '../../components/UI/Button';
import './NotFound.css';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="notfound-page-wrapper fade-in">
      <div className="card notfound-card">
        <div className="notfound-code-badge">404</div>
        <h2 className="notfound-title">Page Not Found</h2>
        <p className="notfound-desc">
          We're sorry, but the page you are looking for does not exist, has been removed, or is temporarily unavailable.
        </p>
        <Button
          variant="primary"
          icon={FiHome}
          onClick={() => navigate('/dashboard')}
          className="notfound-btn"
        >
          Return to Dashboard
        </Button>
      </div>
    </div>
  );
};

export default NotFound;

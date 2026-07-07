import React from 'react';
import { FiMenu, FiBell } from 'react-icons/fi';
import { useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ toggleSidebar }) => {
  const location = useLocation();

  // Helper to determine the header title based on current path
  const getPageTitle = () => {
    const path = location.pathname;
    if (path.startsWith('/dashboard')) return 'Dashboard Overview';
    if (path.startsWith('/employees/new')) return 'Add New Employee';
    if (path.startsWith('/employees/edit')) return 'Update Employee Records';
    if (path.startsWith('/employees/')) return 'Employee Profile Details';
    if (path.startsWith('/employees')) return 'Employee Roster';
    return 'Employee Management';
  };

  return (
    <header className="app-navbar">
      <div className="navbar-left">
        <button
          className="sidebar-toggle-btn"
          onClick={toggleSidebar}
          aria-label="Toggle menu"
        >
          <FiMenu />
        </button>
        <h1 className="navbar-page-title">{getPageTitle()}</h1>
      </div>

      <div className="navbar-right">
        <button className="navbar-action-btn" aria-label="Notifications">
          <FiBell />
          <span className="notification-badge"></span>
        </button>

        <div className="navbar-divider"></div>

        <div className="user-profile-widget">
          <img
            src="https://api.dicebear.com/7.x/adventurer/svg?seed=Admin"
            alt="Admin User Avatar"
            className="user-avatar-round"
          />
          <div className="user-text-widget">
            <span className="user-widget-name">Admin User</span>
            <span className="user-widget-email">admin@company.com</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

import React, { useState, useEffect } from 'react';
import { FiMoon, FiSun } from 'react-icons/fi';
import { useLocation } from 'react-router-dom';
import { useEmployees } from '../../context/EmployeeContext';
import './Navbar.css';

const Navbar = ({ toggleSidebar }) => {
  const location = useLocation();
  const { currentUser, employees } = useEmployees();

  // Dark/Light Theme State
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('ems_theme');
    return saved || 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('ems_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // Helper to determine the header title based on current path
  const getPageTitle = () => {
    const path = location.pathname;
    if (path.startsWith('/dashboard')) return 'Dashboard Overview';
    if (path.startsWith('/employees/new')) return 'Add New Employee';
    if (path.startsWith('/employees/edit')) return 'Update Employee Records';
    if (path.startsWith('/employees/')) return 'Employee Profile Details';
    if (path.startsWith('/employees')) return 'Employee Roster';
    if (path.startsWith('/projects')) return 'Project Board';
    if (path.startsWith('/queries')) return 'Helpdesk Queries';
    if (path.startsWith('/portal')) return 'My Portal';
    return 'Employee Management';
  };

  // Determine user avatar and text info dynamically
  const getUserInfo = () => {
    if (!currentUser) {
      return {
        name: 'Guest User',
        subtext: 'Not Signed In',
        avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Guest'
      };
    }

    if (currentUser.role === 'admin') {
      return {
        name: currentUser.name || 'Admin User',
        subtext: 'System Administrator',
        avatar: '/user-img.webp'
      };
    }

    // Role is employee
    const emp = employees.find(e => e.id === currentUser.employeeId);
    return {
      name: emp ? emp.name : (currentUser.name || 'Employee'),
      subtext: emp ? `${emp.designation} (${emp.department})` : 'Corporate Employee',
      avatar: emp ? (emp.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(emp.name)}`) : `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(currentUser.name)}`
    };
  };

  const userInfo = getUserInfo();

  return (
    <header className="app-navbar">
      <div className="navbar-left">
        <button
          className="sidebar-toggle-btn"
          onClick={toggleSidebar}
          aria-label="Toggle menu"
          style={{ fontSize: '1.8rem', lineHeight: 1, padding: '4px 8px', fontWeight: 'bold' }}
        >
          ≡
        </button>
        <h1 className="navbar-page-title">{getPageTitle()}</h1>
      </div>

      <div className="navbar-right">
        <button 
          className="navbar-action-btn" 
          onClick={toggleTheme}
          aria-label={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
          title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
          style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          {theme === 'light' ? <FiMoon /> : <FiSun />}
        </button>

        <div className="navbar-divider"></div>

        <div className="user-profile-widget">
          <img
            src={userInfo.avatar}
            alt={`${userInfo.name} Avatar`}
            className="user-avatar-round"
          />
          <div className="user-text-widget">
            <span className="user-widget-name">{userInfo.name}</span>
            <span className="user-widget-email">{userInfo.subtext}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

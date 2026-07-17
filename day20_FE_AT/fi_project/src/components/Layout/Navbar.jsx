import React, { useState, useEffect, useRef } from 'react';
import { FiMoon, FiSun, FiBell, FiGrid, FiSearch } from 'react-icons/fi';
import { useLocation } from 'react-router-dom';
import { useEmployees } from '../../context/EmployeeContext';
import './Navbar.css';

const Navbar = ({ toggleSidebar }) => {
  const location = useLocation();
  const { 
    currentUser, 
    employees, 
    notifications = [], 
    markNotificationsAsRead, 
    clearNotifications 
  } = useEmployees();

  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const notifRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;
  const isAdmin = currentUser?.role === 'admin';

  const handleNotifClick = () => {
    setShowNotifDropdown(!showNotifDropdown);
    if (!showNotifDropdown) {
      markNotificationsAsRead();
    }
  };

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
        <div className="navbar-search-box">
          <FiSearch className="navbar-search-icon" />
          <input 
            type="text" 
            placeholder="Search employees, reports, or tasks..." 
            className="navbar-search-input"
          />
        </div>
      </div>

      <div className="navbar-right">
        <div className="navbar-notification-container" ref={notifRef}>
          <button 
            className="navbar-icon-btn notification-btn" 
            onClick={handleNotifClick}
            aria-label="Notifications" 
            title="Notifications"
          >
            <FiBell />
            {isAdmin && unreadCount > 0 && <span className="notification-dot"></span>}
          </button>

          {showNotifDropdown && isAdmin && (
            <div className="navbar-notifications-dropdown animate-zoom">
              <div className="notif-dropdown-header">
                <span className="notif-header-title">Notifications</span>
                {notifications.length > 0 && (
                  <button type="button" className="notif-clear-all-btn" onClick={clearNotifications}>Clear All</button>
                )}
              </div>
              <div className="notif-dropdown-body">
                {notifications.length === 0 ? (
                  <div className="notif-empty-state">
                    <span className="notif-empty-icon">🔔</span>
                    <p className="notif-empty-text">No new notifications</p>
                  </div>
                ) : (
                  notifications.map(n => (
                    <div key={n.id} className={`notif-item-row ${!n.read ? 'unread' : ''}`}>
                      <span className={`notif-type-icon-dot ${n.type}`}></span>
                      <div className="notif-item-content">
                        <p className="notif-item-message">{n.message}</p>
                        <span className="notif-item-time">{n.time} · {formatDate(n.date)}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <button 
          className="navbar-icon-btn" 
          onClick={toggleTheme}
          aria-label={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
          title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
        >
          {theme === 'light' ? <FiMoon /> : <FiSun />}
        </button>

        <button className="navbar-icon-btn" aria-label="Apps Grid" title="Apps Grid">
          <FiGrid />
        </button>

        <div className="navbar-divider"></div>

        <div className="user-profile-widget">
          <div className="user-text-widget">
            <span className="user-widget-name">{userInfo.name}</span>
            <span className="user-widget-email">{userInfo.subtext}</span>
          </div>
          <img
            src={userInfo.avatar}
            alt={`${userInfo.name} Avatar`}
            className="user-avatar-round"
          />
        </div>
      </div>
    </header>
  );
};

export default Navbar;

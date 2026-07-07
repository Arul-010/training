import React from 'react';
import { NavLink } from 'react-router-dom';
import { FiGrid, FiUsers, FiUserPlus, FiX } from 'react-icons/fi';
import './Sidebar.css';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  return (
    <>
      {/* Mobile Sidebar Overlay Backdrop */}
      {isOpen && (
        <div className="sidebar-overlay-mobile" onClick={toggleSidebar}></div>
      )}

      <aside className={`app-sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo-container">
            <span className="logo-icon">💼</span>
            <h2 className="logo-text">EMS Corp</h2>
          </div>
          <button
            className="sidebar-close-mobile"
            onClick={toggleSidebar}
            aria-label="Close menu"
          >
            <FiX />
          </button>
        </div>

        <nav className="sidebar-nav">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `nav-item ${isActive ? 'active' : ''}`
            }
            onClick={() => isOpen && toggleSidebar()}
          >
            <FiGrid className="nav-icon" />
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/employees"
            end
            className={({ isActive }) =>
              `nav-item ${isActive ? 'active' : ''}`
            }
            onClick={() => isOpen && toggleSidebar()}
          >
            <FiUsers className="nav-icon" />
            <span>Employees</span>
          </NavLink>

          <NavLink
            to="/employees/new"
            className={({ isActive }) =>
              `nav-item ${isActive ? 'active' : ''}`
            }
            onClick={() => isOpen && toggleSidebar()}
          >
            <FiUserPlus className="nav-icon" />
            <span>Add Employee</span>
          </NavLink>
        </nav>

        <div className="sidebar-footer">
          <div className="user-profile-summary">
            <div className="user-avatar-mini">A</div>
            <div className="user-info-text">
              <p className="user-name">Admin User</p>
              <p className="user-role">System Manager</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

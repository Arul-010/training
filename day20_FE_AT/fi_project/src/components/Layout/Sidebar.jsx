import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { FiGrid, FiUsers, FiUserPlus, FiBriefcase, FiInbox, FiLogOut, FiX, FiCalendar, FiCheckCircle } from 'react-icons/fi';
import { useEmployees } from '../../context/EmployeeContext';
import './Sidebar.css';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { currentUser, logout, employees } = useEmployees();
  const location = useLocation();

  const isAdmin = currentUser?.role === 'admin';

  // For employee, find their avatar letter
  const getAvatarInit = () => {
    if (isAdmin) return 'A';
    return currentUser?.name ? currentUser.name[0].toUpperCase() : 'E';
  };

  const getRoleLabel = () => {
    if (isAdmin) return 'System Manager';
    const emp = employees.find(e => e.id === currentUser?.employeeId);
    return emp ? emp.designation : 'Staff';
  };

  return (
    <>
      {/* Mobile Sidebar Overlay Backdrop */}
      {isOpen && (
        <div className="sidebar-overlay-mobile" onClick={toggleSidebar}></div>
      )}

      <aside className={`app-sidebar ${isOpen ? 'pinned open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo-container">
            <span className="logo-icon">💼</span>
            <h2 className="logo-text collapsed-hide">ASD corp</h2>
          </div>
          <button
            className="sidebar-close-mobile"
            onClick={toggleSidebar}
            aria-label="Close menu"
          >
            <FiX />
          </button>
        </div>

        {/* Sidebar User Profile Card (Mockup style) */}
        <div className="sidebar-user-profile-banner collapsed-hide">
          <div className="sidebar-user-avatar-wrapper">
            {isAdmin ? (
              <img
                src="/user-img.webp"
                alt="Admin"
                className="sidebar-user-avatar-image"
              />
            ) : (() => {
              const emp = employees.find(e => e.id === currentUser?.employeeId);
              return emp && emp.avatar ? (
                <img
                  src={emp.avatar}
                  alt={emp.name}
                  className="sidebar-user-avatar-image"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
                />
              ) : (
                <div className="sidebar-user-avatar-mini-init">{getAvatarInit()}</div>
              );
            })()}
          </div>
          <div className="sidebar-user-info-text">
            <h3 className="sidebar-user-name-title">
              {isAdmin ? 'Admin User' : (employees.find(e => e.id === currentUser?.employeeId)?.name || currentUser?.name || 'User')}
            </h3>
            <p className="sidebar-user-role-title">{getRoleLabel()}</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          {isAdmin ? (
            <>
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `nav-item ${isActive ? 'active' : ''}`
                }
                onClick={() => window.innerWidth <= 1024 && toggleSidebar()}
              >
                <FiGrid className="nav-icon" />
                <span className="collapsed-hide">Dashboard</span>
              </NavLink>

              <NavLink
                to="/employees"
                end
                className={({ isActive }) =>
                  `nav-item ${isActive ? 'active' : ''}`
                }
                onClick={() => window.innerWidth <= 1024 && toggleSidebar()}
              >
                <FiUsers className="nav-icon" />
                <span className="collapsed-hide">Employees</span>
              </NavLink>

              <NavLink
                to="/projects"
                className={({ isActive }) =>
                  `nav-item ${isActive ? 'active' : ''}`
                }
                onClick={() => window.innerWidth <= 1024 && toggleSidebar()}
              >
                <FiBriefcase className="nav-icon" />
                <span className="collapsed-hide">Projects</span>
              </NavLink>

              <NavLink
                to="/queries"
                className={({ isActive }) =>
                  `nav-item ${isActive ? 'active' : ''}`
                }
                onClick={() => window.innerWidth <= 1024 && toggleSidebar()}
              >
                <FiInbox className="nav-icon" />
                <span className="collapsed-hide">Helpdesk Tickets</span>
              </NavLink>

              <NavLink
                to="/employees/new"
                className={({ isActive }) =>
                  `nav-item ${isActive ? 'active' : ''}`
                }
                onClick={() => window.innerWidth <= 1024 && toggleSidebar()}
              >
                <FiUserPlus className="nav-icon" />
                <span className="collapsed-hide">Add Employee</span>
              </NavLink>
            </>
          ) : (
            <>
              <NavLink
                to="/portal"
                className={() =>
                  `nav-item ${location.pathname === '/portal' && !location.search.includes('tab=application') ? 'active' : ''}`
                }
                onClick={() => window.innerWidth <= 1024 && toggleSidebar()}
              >
                <FiGrid className="nav-icon" />
                <span className="collapsed-hide">Dashboard</span>
              </NavLink>

              <NavLink
                to="/portal?tab=users"
                className={() =>
                  `nav-item ${location.search.includes('tab=users') ? 'active' : ''}`
                }
                onClick={() => window.innerWidth <= 1024 && toggleSidebar()}
              >
                <FiUsers className="nav-icon" />
                <span className="collapsed-hide">Users</span>
              </NavLink>

              <NavLink
                to="/portal?tab=projects"
                className={() =>
                  `nav-item ${location.search.includes('tab=projects') ? 'active' : ''}`
                }
                onClick={() => window.innerWidth <= 1024 && toggleSidebar()}
              >
                <FiBriefcase className="nav-icon" />
                <span className="collapsed-hide">Projects</span>
              </NavLink>

              <NavLink
                to="/portal?tab=team"
                className={() =>
                  `nav-item ${location.search.includes('tab=team') ? 'active' : ''}`
                }
                onClick={() => window.innerWidth <= 1024 && toggleSidebar()}
              >
                <FiUsers className="nav-icon" />
                <span className="collapsed-hide">Team</span>
              </NavLink>

              <NavLink
                to="/portal?tab=tasks"
                className={() =>
                  `nav-item ${location.search.includes('tab=tasks') ? 'active' : ''}`
                }
                onClick={() => window.innerWidth <= 1024 && toggleSidebar()}
              >
                <FiCheckCircle className="nav-icon" />
                <span className="collapsed-hide">Tasks</span>
              </NavLink>

              <NavLink
                to="/portal?tab=application"
                className={() =>
                  `nav-item ${location.search.includes('tab=application') ? 'active' : ''}`
                }
                onClick={() => window.innerWidth <= 1024 && toggleSidebar()}
              >
                <FiInbox className="nav-icon" />
                <span className="collapsed-hide">Application</span>
              </NavLink>
            </>
          )}
        </nav>

        <div className="sidebar-footer">
          <button
            onClick={logout}
            title="Sign Out"
            className="sidebar-logout-btn-full"
          >
            <FiLogOut className="nav-icon" />
            <span className="collapsed-hide">Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

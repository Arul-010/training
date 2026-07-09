import React from 'react';
import { NavLink } from 'react-router-dom';
import { FiGrid, FiUsers, FiUserPlus, FiBriefcase, FiInbox, FiLogOut, FiX } from 'react-icons/fi';
import { useEmployees } from '../../context/EmployeeContext';
import './Sidebar.css';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { currentUser, logout, employees } = useEmployees();

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

      <aside className={`app-sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo-container">
            <span className="logo-icon">💼</span>
            <h2 className="logo-text">ASD corp</h2>
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
          {isAdmin ? (
            <>
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
                to="/projects"
                className={({ isActive }) =>
                  `nav-item ${isActive ? 'active' : ''}`
                }
                onClick={() => isOpen && toggleSidebar()}
              >
                <FiBriefcase className="nav-icon" />
                <span>Projects</span>
              </NavLink>

              <NavLink
                to="/queries"
                className={({ isActive }) =>
                  `nav-item ${isActive ? 'active' : ''}`
                }
                onClick={() => isOpen && toggleSidebar()}
              >
                <FiInbox className="nav-icon" />
                <span>Helpdesk Tickets</span>
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
            </>
          ) : (
            <>
              <NavLink
                to="/portal"
                className={({ isActive }) =>
                  `nav-item ${isActive ? 'active' : ''}`
                }
                onClick={() => isOpen && toggleSidebar()}
              >
                <FiGrid className="nav-icon" />
                <span>My Portal</span>
              </NavLink>
            </>
          )}
        </nav>

        <div className="sidebar-footer">
          <div className="user-profile-summary" style={{ justifyContent: 'space-between', width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {isAdmin ? (
                <img
                  src="/user-img.webp"
                  alt="Admin"
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '2px solid rgba(99,102,241,0.4)'
                  }}
                />
              ) : (
                <div className="user-avatar-mini">{getAvatarInit()}</div>
              )}
              <div className="user-info-text">
                <p className="user-name" style={{ maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {currentUser?.name || 'User'}
                </p>
                <p className="user-role" style={{ maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {getRoleLabel()}
                </p>
              </div>
            </div>
            <button
              onClick={logout}
              title="Sign Out"
              style={{
                color: 'var(--text-light)',
                fontSize: '1.2rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '8px',
                borderRadius: '8px',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#ef4444'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-light)'}
            >
              <FiLogOut />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

import React, { useState } from 'react';
import { useEmployees } from '../../context/EmployeeContext';
import Button from '../../components/UI/Button';
import './Login.css';

const Login = () => {
  const { employees, login } = useEmployees();
  const [activeTab, setActiveTab] = useState('admin'); // 'admin' | 'employee'
  const [empNameInput, setEmpNameInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (activeTab === 'admin') {
      login('admin');
    } else {
      if (!empNameInput.trim()) {
        alert('Please enter your Employee Name to log in.');
        return;
      }
      login('employee', empNameInput.trim());
    }
  };

  return (
    <div className="login-page-container">
      <div className="login-card fade-in">
        <div className="login-header">
          <span className="login-logo">💼</span>
          <h2>ASD corp</h2>
          <p>Choose your workspace role to gain access to the dashboard.</p>
        </div>

        {/* Tab switcher */}
        <div className="login-tabs">
          <button
            type="button"
            className={`login-tab-btn ${activeTab === 'admin' ? 'active' : ''}`}
            onClick={() => setActiveTab('admin')}
          >
            Administrator
          </button>
          <button
            type="button"
            className={`login-tab-btn ${activeTab === 'employee' ? 'active' : ''}`}
            onClick={() => setActiveTab('employee')}
          >
            Employee
          </button>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {activeTab === 'admin' ? (
            <>
              <div className="login-desc-box">
                <strong>Admin Workspace:</strong> Gives complete access to view metrics, register employees, configure project listings, and review submitted employee requests.
              </div>

              {/* Attendance quick info section */}
              <div style={{
                background: 'var(--bg-success)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--border-radius-sm)',
                padding: '12px 16px',
                fontSize: '0.85rem',
                color: 'var(--text-success)',
                display: 'flex',
                justifyContent: 'space-between',
                fontWeight: '700'
              }}>
                <span>Daily Attendance Status:</span>
                <span>
                  🟢 {employees.filter(e => e.status === 'Active').length} Active | 
                  🟡 {employees.filter(e => e.status === 'On Leave').length} Leave
                </span>
              </div>

              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                No credentials required for this sandbox simulation.
              </div>
            </>
          ) : (
            <>
              <div className="login-desc-box employee-desc">
                <strong>Employee Workspace:</strong> Allows employees to view their profile info, check their attendance, view assigned projects, update active progress, and submit queries to Admin.
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                  Enter Employee Name / ID
                </label>
                <input
                  type="text"
                  placeholder="e.g. Arul Selvam or EMP-1001"
                  value={empNameInput}
                  onChange={(e) => setEmpNameInput(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--border-radius-sm)',
                    background: 'var(--bg-card)',
                    color: 'var(--text-title)',
                    fontSize: '0.95rem'
                  }}
                  required
                />
                <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', fontStyle: 'italic' }}>
                  Tip: Try typing "Arul Selvam" to log in.
                </span>
              </div>
            </>
          )}

          <Button type="submit" variant="primary" style={{ padding: '12px 24px', width: '100%', fontSize: '0.95rem' }}>
            {activeTab === 'admin' ? 'Sign In as Admin' : 'Sign In as Employee'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Login;

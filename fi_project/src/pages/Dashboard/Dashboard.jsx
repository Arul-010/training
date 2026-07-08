import React from 'react';
import { useEmployees } from '../../context/EmployeeContext';
import { formatCurrency, formatDate } from '../../utils/helpers';
import {
  FiUsers, FiCheckCircle, FiClock, FiDollarSign,
  FiXCircle, FiBriefcase, FiPlus, FiChevronRight
} from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/UI/Button';
import MetricCard from '../../components/UI/MetricCard';
import './Dashboard.css';

const Dashboard = () => {
  const { employees } = useEmployees();
  const navigate = useNavigate();

  // ── Metric calculations ──────────────────────────────────────────
  const totalEmployees    = employees.length;
  const activeEmployees   = employees.filter((e) => e.status === 'Active').length;
  const onLeaveEmployees  = employees.filter((e) => e.status === 'On Leave').length;
  const inactiveEmployees = employees.filter((e) => e.status === 'Terminated').length;
  const totalDepartments  = new Set(employees.map((e) => e.department).filter(Boolean)).size;

  const averageSalary = totalEmployees > 0
    ? Math.round(employees.reduce((acc, e) => acc + Number(e.salary || 0), 0) / totalEmployees)
    : 0;

  // ── Department distribution ──────────────────────────────────────
  const deptCounts = employees.reduce((acc, e) => {
    const dept = e.department || 'Unassigned';
    acc[dept] = (acc[dept] || 0) + 1;
    return acc;
  }, {});

  const departmentList = Object.entries(deptCounts)
    .map(([name, count]) => ({
      name,
      count,
      percentage: totalEmployees > 0 ? Math.round((count / totalEmployees) * 100) : 0
    }))
    .sort((a, b) => b.count - a.count);

  // ── Recent hires (newest 4) ──────────────────────────────────────
  const recentHires = employees.slice(0, 4);

  // ── Greeting ────────────────────────────────────────────────────
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? 'Good morning' :
    hour < 17 ? 'Good afternoon' :
                'Good evening';

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  return (
    <div className="dashboard-page-wrapper">

      {/* ── Welcome Banner ────────────────────────────────────── */}
      <section className="welcome-banner">
        <div className="welcome-left">
          <h2 className="welcome-heading">
            {greeting}, Admin! 👋
          </h2>
          <p className="welcome-subtext">{today}</p>
        </div>
        <Button
          variant="primary"
          icon={FiPlus}
          onClick={() => navigate('/employees/new')}
        >
          Add Employee
        </Button>
      </section>

      {/* ── Metric Cards ──────────────────────────────────────── */}
      <section className="metrics-grid">
        <MetricCard icon={FiUsers}        colorVariant="blue"   label="Total Employees"  value={totalEmployees} />
        <MetricCard icon={FiCheckCircle}  colorVariant="green"  label="Active"           value={activeEmployees} />
        <MetricCard icon={FiClock}        colorVariant="amber"  label="On Leave"         value={onLeaveEmployees} />
        <MetricCard icon={FiXCircle}      colorVariant="red"    label="Inactive"         value={inactiveEmployees} />
        <MetricCard icon={FiBriefcase}    colorVariant="indigo" label="Departments"      value={totalDepartments} />
        <MetricCard icon={FiDollarSign}   colorVariant="teal"   label="Avg. Salary"      value={formatCurrency(averageSalary)} />
      </section>

      {/* ── Live Attendance Monitoring Section ── */}
      <section className="card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '14px' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-title)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              📊 Live Attendance Monitoring
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-light)', margin: '4px 0 0 0' }}>
              Real-time daily presence, leave statistics, and roster status.
            </p>
          </div>
          <span 
            style={{ 
              background: 'var(--primary-light)', 
              color: 'var(--primary-color)', 
              padding: '4px 12px', 
              borderRadius: '99px', 
              fontSize: '0.75rem', 
              fontWeight: 700 
            }}
          >
            Today: {Math.round((activeEmployees / (activeEmployees + onLeaveEmployees || 1)) * 100)}% Present
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '20px' }}>
          {/* Active Workers card */}
          <div style={{ background: 'var(--bg-success)', border: '1px solid rgba(34,197,94,0.15)', padding: '16px', borderRadius: 'var(--border-radius-sm)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-success)', textTransform: 'uppercase' }}>
              Active Today 🟢
            </span>
            <strong style={{ fontSize: '2rem', color: 'var(--text-success)', lineHeight: '1.2' }}>
              {activeEmployees}
            </strong>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Workers on site & online</span>
          </div>

          {/* On Leave card */}
          <div style={{ background: 'var(--bg-warning)', border: '1px solid rgba(245,158,11,0.15)', padding: '16px', borderRadius: 'var(--border-radius-sm)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-warning)', textTransform: 'uppercase' }}>
              On Leave 🟡
            </span>
            <strong style={{ fontSize: '2rem', color: 'var(--text-warning)', lineHeight: '1.2' }}>
              {onLeaveEmployees}
            </strong>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Staff out of office today</span>
          </div>

          {/* Roster overview bar */}
          <div style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', justifyContext: 'center', gap: '8px', padding: '8px 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Roster Capacity Rate</span>
              <strong style={{ color: 'var(--text-title)' }}>
                {activeEmployees} of {activeEmployees + onLeaveEmployees} Present
              </strong>
            </div>
            <div style={{ height: '10px', background: 'var(--bg-app)', border: '1px solid var(--border-color)', borderRadius: '6px', overflow: 'hidden' }}>
              <div 
                style={{ 
                  height: '100%', 
                  background: 'linear-gradient(90deg, var(--primary-color) 0%, var(--color-success) 100%)', 
                  width: `${(activeEmployees / (activeEmployees + onLeaveEmployees || 1)) * 100}%` 
                }} 
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Main Split: Distribution + Recent Hires ───────────── */}
      <div className="dashboard-grid-split">

        {/* Department Distribution */}
        <section className="card distribution-card">
          <h2 className="section-card-title">Department Distribution</h2>
          {totalEmployees === 0 ? (
            <p className="no-data-hint">
              No departments registered. Add employees to populate this chart.
            </p>
          ) : (
            <div className="department-progress-list">
              {departmentList.map((dept) => (
                <div key={dept.name} className="dept-progress-item">
                  <div className="dept-progress-labels">
                    <span className="dept-name">{dept.name}</span>
                    <span className="dept-values">
                      {dept.count} {dept.count === 1 ? 'member' : 'members'} ({dept.percentage}%)
                    </span>
                  </div>
                  <div className="progress-bar-track">
                    <div
                      className="progress-bar-fill"
                      style={{ width: `${dept.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Recent Employees */}
        <section className="card recent-hires-card">
          <div className="recent-card-header">
            <h2 className="section-card-title">Recent Employees</h2>
            <Button
              variant="outline"
              size="sm"
              icon={FiPlus}
              onClick={() => navigate('/employees/new')}
            >
              Add Staff
            </Button>
          </div>

          {recentHires.length === 0 ? (
            <p className="no-data-hint">No employee records registered in the system.</p>
          ) : (
            <div className="recent-hires-list">
              {recentHires.map((emp) => (
                <Link
                  to={`/employees/${emp.id}`}
                  key={emp.id}
                  className="recent-hire-item"
                >
                  <div className="recent-hire-left">
                    <img
                      src={emp.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${emp.name}`}
                      alt={emp.name}
                      className="recent-hire-avatar"
                    />
                    <div className="recent-hire-meta">
                      <p className="hire-name">{emp.name}</p>
                      <p className="hire-role-dept">
                        {emp.designation} · <span className="dept-pill">{emp.department}</span>
                      </p>
                    </div>
                  </div>
                  <div className="recent-hire-right">
                    <span className={`dash-status-pill dash-${emp.status?.toLowerCase().replace(' ', '-')}`}>
                      {emp.status}
                    </span>
                    <FiChevronRight className="recent-hire-arrow" />
                  </div>
                </Link>
              ))}
              <div className="recent-card-footer">
                <Link to="/employees" className="view-all-link">
                  View All Employees →
                </Link>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Dashboard;

import React, { useState } from 'react';
import { useEmployees } from '../../context/EmployeeContext';
import { useProjects } from '../../context/ProjectContext';
import { formatCurrency, formatDate } from '../../utils/helpers';
import {
  FiUser, FiMail, FiPhone, FiCalendar, FiDollarSign,
  FiBriefcase, FiAlertCircle, FiCheckCircle, FiSend, FiInbox, FiClock, FiFileText
} from 'react-icons/fi';
import Button from '../../components/UI/Button';
import './EmployeePortal.css';

const EmployeePortal = () => {
  const { currentUser, employees, queries, addQuery, leaveApplications, applyLeave } = useEmployees();
  const { projects, updateProject } = useProjects();

  const [querySubject, setQuerySubject] = useState('');
  const [queryMessage, setQueryMessage] = useState('');

  // Leave form state
  const [leaveReason, setLeaveReason] = useState('');
  const [leaveStart, setLeaveStart] = useState('');
  const [leaveEnd, setLeaveEnd] = useState('');
  const [leaveError, setLeaveError] = useState('');

  const employee = employees.find(e => e.id === currentUser?.employeeId);

  if (!employee) {
    return (
      <div className="card" style={{ padding: '40px', textAlign: 'center', margin: '40px auto', maxWidth: '500px' }}>
        <FiAlertCircle size={48} style={{ color: 'var(--color-danger)', marginBottom: '16px' }} />
        <h3>Employee Record Not Found</h3>
        <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>Your current session employee identifier does not match active records.</p>
      </div>
    );
  }

  // Calculate dynamic but consistent attendance rate based on employee's ID string
  const getAttendanceRate = (empId) => {
    // Hash the ID to get a stable value between 82% and 98%
    const numPart = parseInt(empId.replace(/\D/g, '')) || 5;
    return 84 + (numPart % 15);
  };

  const attendanceRate = getAttendanceRate(employee.id);

  // Filter projects assigned to this employee
  const assignedProjects = projects.filter(p => p.memberIds?.includes(employee.id));

  // Filter queries submitted by this employee
  const employeeQueries = queries.filter(q => q.employeeId === employee.id);

  const handleToggleProjectStatus = (proj) => {
    const nextStatus = proj.status === 'Active' ? 'Inactive' : 'Active';
    updateProject(proj.id, {
      ...proj,
      status: nextStatus
    });
  };

  const handleQuerySubmit = (e) => {
    e.preventDefault();
    if (!querySubject.trim() || !queryMessage.trim()) {
      alert('Please fill out both the subject and query message.');
      return;
    }
    addQuery(employee.id, querySubject, queryMessage);
    setQuerySubject('');
    setQueryMessage('');
  };

  // Leave application form handler
  const calcDays = (start, end) => {
    if (!start || !end) return 0;
    const diff = new Date(end) - new Date(start);
    return diff < 0 ? 0 : Math.round(diff / (1000 * 60 * 60 * 24)) + 1;
  };

  const handleLeaveSubmit = (e) => {
    e.preventDefault();
    setLeaveError('');
    if (!leaveStart || !leaveEnd) { setLeaveError('Please select both start and end dates.'); return; }
    if (new Date(leaveEnd) < new Date(leaveStart)) { setLeaveError('End date must be after start date.'); return; }
    if (!leaveReason.trim()) { setLeaveError('Please provide a reason for your leave.'); return; }
    applyLeave(employee.id, {
      reason: leaveReason,
      startDate: leaveStart,
      endDate: leaveEnd,
      requestedDays: calcDays(leaveStart, leaveEnd)
    });
    setLeaveReason('');
    setLeaveStart('');
    setLeaveEnd('');
  };

  // Employee's own leave applications
  const myLeaveApplications = leaveApplications.filter(lv => lv.employeeId === employee.id);

  return (
    <div className="employee-portal-wrapper">
      {/* ── Page Header ── */}
      <section className="portal-header">
        <div className="portal-title-area">
          <h2>Employee Workspace</h2>
          <p>Welcome back, {employee.name}! Check your status, attendance, and project deadlines.</p>
        </div>
      </section>

      {/* ── Main Layout Split ── */}
      <div className="portal-grid">
        {/* Left Side: Sticky Profile and Attendance Card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Profile Card */}
          <div className="card profile-card-sticky">
            <img
              src={employee.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${employee.name}`}
              alt={employee.name}
              className="portal-avatar-large"
            />
            <div className="profile-name-dept">
              <h3>{employee.name}</h3>
              <p>{employee.designation}</p>
            </div>

            <div className="profile-details-list">
              <div className="profile-detail-row">
                <span className="profile-detail-label">ID Number</span>
                <span className="profile-detail-val" style={{ fontFamily: 'monospace' }}>{employee.id}</span>
              </div>
              <div className="profile-detail-row">
                <span className="profile-detail-label">Department</span>
                <span className="profile-detail-val">{employee.department}</span>
              </div>
              <div className="profile-detail-row">
                <span className="profile-detail-label">Email</span>
                <span className="profile-detail-val" style={{ fontSize: '0.8rem' }}>{employee.email}</span>
              </div>
              <div className="profile-detail-row">
                <span className="profile-detail-label">Phone</span>
                <span className="profile-detail-val">{employee.phone}</span>
              </div>
              <div className="profile-detail-row">
                <span className="profile-detail-label">Date Joined</span>
                <span className="profile-detail-val">{formatDate(employee.joinDate)}</span>
              </div>
              <div className="profile-detail-row">
                <span className="profile-detail-label">Salary</span>
                <span className="profile-detail-val">{formatCurrency(employee.salary)}</span>
              </div>
            </div>
          </div>

          {/* Attendance Gauge Card */}
          <div className="attendance-card">
            <h3 className="attendance-title">Monthly Attendance Rate</h3>
            <div className="attendance-gauge-area">
              <span className="attendance-percentage">{attendanceRate}%</span>
              <div className="attendance-bar-track">
                <div className="attendance-bar-fill" style={{ width: `${attendanceRate}%` }} />
              </div>
            </div>
            <span className="attendance-rating-text">
              {attendanceRate >= 90 ? '🟢 Outstanding Attendance Rate' : '🟡 Meet Attendance Targets'}
            </span>
          </div>
        </div>

        {/* Right Side: Assigned Projects and Query Section */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Assigned Projects */}
          <section className="portal-projects-section">
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-title)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FiBriefcase style={{ color: 'var(--primary-color)' }} /> Assigned Projects ({assignedProjects.length})
            </h3>

            {assignedProjects.length === 0 ? (
              <div className="card" style={{ padding: '30px', textAlign: 'center' }}>
                <p className="no-members-hint" style={{ fontSize: '0.95rem' }}>You are not currently assigned to any active project team.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {assignedProjects.map(proj => (
                  <div key={proj.id} className="project-update-row">
                    <div className="project-info-side">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <h4>{proj.name}</h4>
                        <span 
                          style={{
                            padding: '2px 8px',
                            borderRadius: '99px',
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            background: proj.status === 'Active' ? 'var(--bg-success)' : 'var(--secondary-light)',
                            color: proj.status === 'Active' ? 'var(--text-success)' : 'var(--text-muted)'
                          }}
                        >
                          {proj.status === 'Active' ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <p>{proj.description}</p>
                    </div>

                    <Button
                      variant={proj.status === 'Active' ? 'outline' : 'primary'}
                      size="sm"
                      onClick={() => handleToggleProjectStatus(proj)}
                      style={{ flexShrink: 0 }}
                    >
                      {proj.status === 'Active' ? 'Set Inactive' : 'Set Active'}
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* ── Leave Application Section ── */}
          <section className="card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-title)', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
              <FiCalendar style={{ color: 'var(--primary-color)' }} /> Leave Application
            </h3>

            {/* Leave Form */}
            <form onSubmit={handleLeaveSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>Start Date</label>
                  <input
                    type="date"
                    value={leaveStart}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setLeaveStart(e.target.value)}
                    style={{ padding: '10px 14px', border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius-sm)', background: '#ffffff', color: 'var(--text-body)' }}
                    required
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>End Date</label>
                  <input
                    type="date"
                    value={leaveEnd}
                    min={leaveStart || new Date().toISOString().split('T')[0]}
                    onChange={(e) => setLeaveEnd(e.target.value)}
                    style={{ padding: '10px 14px', border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius-sm)', background: '#ffffff', color: 'var(--text-body)' }}
                    required
                  />
                </div>
              </div>

              {leaveStart && leaveEnd && new Date(leaveEnd) >= new Date(leaveStart) && (
                <div style={{ background: 'var(--bg-app)', border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius-sm)', padding: '10px 14px', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                  📅 Duration: <strong style={{ color: 'var(--primary-color)' }}>{calcDays(leaveStart, leaveEnd)} day(s)</strong>
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>Reason for Leave</label>
                <textarea
                  placeholder="Describe the reason for your leave request..."
                  value={leaveReason}
                  onChange={(e) => setLeaveReason(e.target.value)}
                  rows={3}
                  style={{ padding: '10px 14px', border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius-sm)', background: '#ffffff', color: 'var(--text-body)', resize: 'vertical' }}
                  required
                />
              </div>

              {leaveError && (
                <p style={{ fontSize: '0.82rem', color: 'var(--color-danger)', fontWeight: 600 }}>⚠ {leaveError}</p>
              )}

              <Button type="submit" variant="primary" icon={FiSend} style={{ alignSelf: 'flex-start', padding: '10px 20px' }}>
                Submit Leave Request
              </Button>
            </form>

            {/* Employee's leave history */}
            {myLeaveApplications.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', margin: 0 }}>My Leave History</h4>
                {myLeaveApplications.map(lv => (
                  <div key={lv.id} style={{
                    background: 'var(--bg-app)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--border-radius-sm)',
                    padding: '12px 16px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '12px',
                    flexWrap: 'wrap'
                  }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-body)' }}>
                        {formatDate(lv.startDate)} → {formatDate(lv.endDate)}
                      </span>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{lv.reason}</span>
                      {lv.approvedDays != null && (
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                          Approved Days: <strong style={{ color: 'var(--primary-color)' }}>{lv.approvedDays}</strong>
                        </span>
                      )}
                    </div>
                    <span style={{
                      padding: '4px 12px',
                      borderRadius: '99px',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      flexShrink: 0,
                      background: lv.status === 'Approved' ? 'var(--bg-success)' : lv.status === 'Rejected' ? 'var(--bg-danger, #fef2f2)' : 'var(--bg-warning)',
                      color: lv.status === 'Approved' ? 'var(--text-success)' : lv.status === 'Rejected' ? 'var(--color-danger, #ef4444)' : 'var(--text-warning)'
                    }}>
                      {lv.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Queries and Request Section */}
          <section className="card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-title)', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
              <FiInbox style={{ color: 'var(--primary-color)' }} /> Queries & Helpdesk Section
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }} className="queries-split-view">
              {/* Form to submit query */}
              <form onSubmit={handleQuerySubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                  Submit Request to Admin
                </h4>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>Query Subject</label>
                  <input
                    type="text"
                    placeholder="e.g., Leave Application, IT Hardware request..."
                    value={querySubject}
                    onChange={(e) => setQuerySubject(e.target.value)}
                    style={{
                      padding: '10px 14px',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--border-radius-sm)',
                      background: '#ffffff',
                      color: 'var(--text-body)'
                    }}
                    required
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>Detailed Message</label>
                  <textarea
                    placeholder="Describe your issue or query here..."
                    value={queryMessage}
                    onChange={(e) => setQueryMessage(e.target.value)}
                    rows={4}
                    style={{
                      padding: '10px 14px',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--border-radius-sm)',
                      background: '#ffffff',
                      color: 'var(--text-body)',
                      resize: 'vertical'
                    }}
                    required
                  />
                </div>

                <Button type="submit" variant="primary" icon={FiSend} style={{ alignSelf: 'flex-start', padding: '10px 20px' }}>
                  Send Query
                </Button>
              </form>

              {/* Log of queries */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                  Query Logs ({employeeQueries.length})
                </h4>

                {employeeQueries.length === 0 ? (
                  <div style={{ padding: '20px', textAlign: 'center', background: 'var(--bg-app)', border: '1px dashed var(--border-color)', borderRadius: 'var(--border-radius-sm)' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-light)', fontStyle: 'italic' }}>No queries submitted yet.</span>
                  </div>
                ) : (
                  <div className="queries-log-list">
                    {employeeQueries.map(q => (
                      <div key={q.id} className="query-log-item">
                        <div className="query-log-header">
                          <span>{formatDate(q.date)}</span>
                          <span 
                            className="query-status-badge-inline" 
                            style={{
                              background: q.status === 'Resolved' ? 'var(--bg-success)' : 'var(--bg-warning)',
                              color: q.status === 'Resolved' ? 'var(--text-success)' : 'var(--text-warning)'
                            }}
                          >
                            {q.status}
                          </span>
                        </div>
                        <div className="query-log-title">{q.subject}</div>
                        <div className="query-log-message">{q.message}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};

export default EmployeePortal;

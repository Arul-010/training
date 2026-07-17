import React, { useState } from 'react';
import { useEmployees } from '../../context/EmployeeContext';
import { formatDate } from '../../utils/helpers';
import {
  FiInbox, FiCheckCircle, FiClock, FiXCircle,
  FiCalendar, FiMinus, FiPlus, FiAlertTriangle
} from 'react-icons/fi';
import Button from '../../components/UI/Button';
import './Queries.css';

// ── Per-card decision panel — owns its own grantDays state ──────────────────
const LeaveCard = ({ lv, onApprove, onReject, onPending }) => {
  const [grantDays, setGrantDays] = useState(
    lv.approvedDays != null ? lv.approvedDays : lv.requestedDays
  );

  const isPartial   = grantDays < lv.requestedDays && grantDays > 0;
  const isOverLimit = grantDays > lv.requestedDays;
  const isZero      = grantDays === 0;

  const statusStyle = (s) => {
    if (s === 'Approved') return { background: 'var(--bg-success)', color: 'var(--text-success)' };
    if (s === 'Rejected') return { background: 'var(--bg-danger)', color: 'var(--text-danger)' };
    return { background: 'var(--bg-warning)', color: 'var(--text-warning)' };
  };

  const approveLabel = isPartial ? 'Partial Approve' : 'Approve';

  return (
    <div className="leave-card fade-in">

      {/* ── Meta row ── */}
      <div className="leave-card-meta">
        <span className="query-author">
          👤 {lv.employeeName}
          <span style={{ fontWeight: 400, color: 'var(--text-light)', marginLeft: 6 }}>({lv.employeeId})</span>
        </span>
        <span className="leave-meta-dot">•</span>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>📋 Applied: {formatDate(lv.appliedOn)}</span>
        <span className="leave-status-pill" style={statusStyle(lv.status)}>
          {lv.status}
          {lv.status === 'Approved' && lv.approvedDays < lv.requestedDays && (
            <span style={{ marginLeft: 4, opacity: 0.8 }}>(Partial)</span>
          )}
        </span>
      </div>

      {/* ── Date range ── */}
      <div className="leave-card-dates">
        <FiCalendar style={{ color: 'var(--primary-color)', flexShrink: 0 }} />
        <strong>{formatDate(lv.startDate)}</strong>
        <span className="leave-arrow">→</span>
        <strong>{formatDate(lv.endDate)}</strong>
        <span className="leave-requested-badge">{lv.requestedDays} day(s) requested</span>
        {lv.status === 'Approved' && (
          <span className="leave-approved-badge">✓ {lv.approvedDays} day(s) approved</span>
        )}
      </div>

      {/* ── Reason ── */}
      <p className="query-admin-message">{lv.reason}</p>

      {/* ══ Decision Panel ══════════════════════════════ */}
      <div className="leave-decision-panel">

        {/* Left — grant-days adjuster */}
        <div className="leave-grant-section">
          <span className="leave-grant-label">Grant Days:</span>

          <div className="leave-grant-stepper">
            <button
              className="stepper-btn"
              onClick={() => setGrantDays(d => Math.max(0, d - 1))}
              disabled={grantDays <= 0}
              aria-label="Decrease days"
            >
              <FiMinus />
            </button>

            <input
              type="number"
              min="0"
              max={lv.requestedDays}
              value={grantDays}
              onChange={(e) => {
                const v = parseInt(e.target.value, 10);
                if (!isNaN(v)) setGrantDays(Math.max(0, v));
              }}
              className="leave-grant-input"
              aria-label="Grant days count"
            />

            <button
              className="stepper-btn"
              onClick={() => setGrantDays(d => Math.min(lv.requestedDays, d + 1))}
              disabled={grantDays >= lv.requestedDays}
              aria-label="Increase days"
            >
              <FiPlus />
            </button>
          </div>

          <span className="leave-grant-of">of {lv.requestedDays}</span>

          {/* Contextual hints */}
          {isPartial && (
            <span className="leave-partial-hint">
              <FiAlertTriangle size={12} />
              {lv.requestedDays - grantDays} day(s) less than requested
            </span>
          )}
          {isOverLimit && (
            <span className="leave-over-hint">⚠ Cannot exceed requested days</span>
          )}
          {isZero && (
            <span className="leave-partial-hint" style={{ color: '#ef4444' }}>
              <FiAlertTriangle size={12} /> 0 days — counts as Reject
            </span>
          )}
        </div>

        {/* Right — action buttons */}
        <div className="leave-action-btns">
          {lv.status !== 'Approved' && (
            <button
              className={`la-btn la-approve${isPartial ? ' la-partial' : ''}`}
              onClick={() => onApprove(lv, grantDays)}
              disabled={isOverLimit || isZero}
              title={isPartial ? `Approve only ${grantDays} of ${lv.requestedDays} days` : 'Approve all days'}
            >
              <FiCheckCircle /> {approveLabel}
            </button>
          )}

          {lv.status !== 'Rejected' && (
            <button
              className="la-btn la-reject"
              onClick={() => onReject(lv)}
            >
              <FiXCircle /> Reject
            </button>
          )}

          {lv.status !== 'Pending' && (
            <button
              className="la-btn la-pending"
              onClick={() => onPending(lv)}
              title="Move back to Pending for re-review"
            >
              <FiClock /> Revert
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// ── Main Page ────────────────────────────────────────────────────────────────
const Queries = () => {
  const { queries, resolveQuery, leaveApplications, updateLeaveApplication } = useEmployees();

  const [activeTab, setActiveTab]     = useState('helpdesk');
  const [filter, setFilter]           = useState('All');
  const [leaveFilter, setLeaveFilter] = useState('All');

  const filteredQueries = queries.filter(q =>
    filter === 'All' ? true : q.status === filter
  );

  const filteredLeave = leaveApplications.filter(lv =>
    leaveFilter === 'All' ? true : lv.status === leaveFilter
  );

  const handleApprove = (lv, days) =>
    updateLeaveApplication(lv.id, { status: 'Approved', approvedDays: days });

  const handleReject = (lv) =>
    updateLeaveApplication(lv.id, { status: 'Rejected', approvedDays: 0 });

  const handlePending = (lv) =>
    updateLeaveApplication(lv.id, { status: 'Pending', approvedDays: null });

  return (
    <div className="queries-page-wrapper">

      {/* ── Header ── */}
      <section className="queries-header">
        <div className="queries-title-area">
          <h2>Employee Queries &amp; Leave Management</h2>
          <p>Review helpdesk tickets and manage employee leave applications.</p>
        </div>
      </section>

      {/* ── Tab switcher ── */}
      <div className="queries-main-tabs">
        <button
          className={`qtab-btn ${activeTab === 'helpdesk' ? 'active' : ''}`}
          onClick={() => setActiveTab('helpdesk')}
        >
          <FiInbox /> Helpdesk Tickets
          <span className="qtab-badge">{queries.filter(q => q.status === 'Pending').length}</span>
        </button>
        <button
          className={`qtab-btn ${activeTab === 'leave' ? 'active' : ''}`}
          onClick={() => setActiveTab('leave')}
        >
          <FiCalendar /> Leave Applications
          <span className="qtab-badge">{leaveApplications.filter(lv => lv.status === 'Pending').length}</span>
        </button>
      </div>

      {/* ══ Helpdesk Tab ══ */}
      {activeTab === 'helpdesk' && (
        <>
          <section style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {['All', 'Pending', 'Resolved'].map(tab => (
              <Button
                key={tab}
                variant={filter === tab ? 'primary' : 'outline'}
                onClick={() => setFilter(tab)}
                style={{ padding: '8px 18px', fontSize: '0.85rem' }}
              >
                {tab} Requests
              </Button>
            ))}
          </section>

          <section className="queries-container">
            {filteredQueries.length === 0 ? (
              <div className="card" style={{ padding: '40px', textAlign: 'center' }}>
                <FiInbox size={48} style={{ color: 'var(--text-light)', marginBottom: '16px' }} />
                <p className="no-members-hint" style={{ fontSize: '1rem' }}>No queries found in this category.</p>
              </div>
            ) : (
              filteredQueries.map(q => (
                <div key={q.id} className="query-admin-row fade-in">
                  <div className="query-admin-left">
                    <div className="query-admin-meta">
                      <span className="query-author">👤 {q.employeeName} ({q.employeeId})</span>
                      <span>•</span>
                      <span>📅 {formatDate(q.date)}</span>
                      <span>•</span>
                      <span style={{
                        padding: '2px 8px', borderRadius: '99px', fontSize: '0.7rem', fontWeight: 700,
                        background: q.status === 'Resolved' ? 'var(--bg-success)' : 'var(--bg-warning)',
                        color: q.status === 'Resolved' ? 'var(--text-success)' : 'var(--text-warning)'
                      }}>
                        {q.status}
                      </span>
                    </div>
                    <h3 className="query-admin-subject">{q.subject}</h3>
                    <p className="query-admin-message">{q.message}</p>
                  </div>
                  {q.status === 'Pending' && (
                    <Button
                      variant="primary"
                      size="sm"
                      icon={FiCheckCircle}
                      onClick={() => resolveQuery(q.id)}
                      style={{ flexShrink: 0, background: 'var(--color-success)', color: '#ffffff' }}
                    >
                      Resolve
                    </Button>
                  )}
                </div>
              ))
            )}
          </section>
        </>
      )}

      {/* ══ Leave Applications Tab ══ */}
      {activeTab === 'leave' && (
        <>
          <section style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {['All', 'Pending', 'Approved', 'Rejected'].map(tab => (
              <Button
                key={tab}
                variant={leaveFilter === tab ? 'primary' : 'outline'}
                onClick={() => setLeaveFilter(tab)}
                style={{ padding: '8px 18px', fontSize: '0.85rem' }}
              >
                {tab}
              </Button>
            ))}
          </section>

          <section className="queries-container">
            {filteredLeave.length === 0 ? (
              <div className="card" style={{ padding: '40px', textAlign: 'center' }}>
                <FiCalendar size={48} style={{ color: 'var(--text-light)', marginBottom: '16px' }} />
                <p className="no-members-hint" style={{ fontSize: '1rem' }}>No leave applications in this category.</p>
              </div>
            ) : (
              filteredLeave.map(lv => (
                <LeaveCard
                  key={lv.id}
                  lv={lv}
                  onApprove={handleApprove}
                  onReject={handleReject}
                  onPending={handlePending}
                />
              ))
            )}
          </section>
        </>
      )}
    </div>
  );
};

export default Queries;

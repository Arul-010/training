import React, { useState } from 'react';
import { useEmployees } from '../../context/EmployeeContext';
import { formatDate } from '../../utils/helpers';
import { FiInbox, FiCheckCircle, FiClock, FiAlertCircle } from 'react-icons/fi';
import Button from '../../components/UI/Button';
import './Queries.css';

const Queries = () => {
  const { queries, resolveQuery } = useEmployees();
  const [filter, setFilter] = useState('All'); // 'All' | 'Pending' | 'Resolved'

  const filteredQueries = queries.filter(q => {
    if (filter === 'All') return true;
    return q.status === filter;
  });

  return (
    <div className="queries-page-wrapper">
      {/* ── Page Header ── */}
      <section className="queries-header">
        <div className="queries-title-area">
          <h2>Employee Queries & Helpdesk</h2>
          <p>Review and resolve request tickets submitted by employees.</p>
        </div>
      </section>

      {/* ── Filters Toolbar ── */}
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

      {/* ── Queries List ── */}
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
                  <span 
                    style={{
                      padding: '2px 8px',
                      borderRadius: '99px',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      background: q.status === 'Resolved' ? 'var(--bg-success)' : 'var(--bg-warning)',
                      color: q.status === 'Resolved' ? 'var(--text-success)' : 'var(--text-warning)'
                    }}
                  >
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
    </div>
  );
};

export default Queries;

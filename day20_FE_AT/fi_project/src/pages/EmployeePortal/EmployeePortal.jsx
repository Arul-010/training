import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useEmployees } from '../../context/EmployeeContext';
import { useProjects } from '../../context/ProjectContext';
import { formatCurrency, formatDate } from '../../utils/helpers';
import {
  FiBriefcase, FiAlertCircle, FiClock,
  FiTrendingUp, FiTrendingDown, FiMonitor, FiTablet, FiSmartphone, FiEdit2, FiMoreHorizontal, FiCalendar, FiInbox, FiPlus, FiUsers, FiCamera
} from 'react-icons/fi';
import Button from '../../components/UI/Button';
import './EmployeePortal.css';

const getHash = (str) => {
  let hash = 0;
  if (!str) return hash;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
};

const EmployeePortal = () => {
  const { currentUser, employees, queries, addQuery, leaveApplications, applyLeave, updateEmployee } = useEmployees();
  const { projects, updateProject } = useProjects();
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'dashboard';

  // Modal forms trigger
  const [showModal, setShowModal] = useState(false); // false | 'leave' | 'query'

  // Query state
  const [querySubject, setQuerySubject] = useState('');
  const [queryMessage, setQueryMessage] = useState('');

  // Leave state
  const [leaveReason, setLeaveReason] = useState('');
  const [leaveStart, setLeaveStart] = useState('');
  const [leaveEnd, setLeaveEnd] = useState('');
  const [leaveError, setLeaveError] = useState('');

  // Projects tab state
  const [selectedProjId, setSelectedProjId] = useState(null);
  const [chatInputs, setChatInputs] = useState({}); // project.id -> input text
  const [taskSliders, setTaskSliders] = useState({}); // task.id -> number progress
  const [selectedMemberId, setSelectedMemberId] = useState(null);

  // Direct Messaging States
  const [isDirectChatActive, setIsDirectChatActive] = useState(false);
  const [dmInput, setDmInput] = useState('');
  const [directMessages, setDirectMessages] = useState(() => {
    const saved = localStorage.getItem('ems_direct_messages');
    return saved ? JSON.parse(saved) : [];
  });

  // Save DMs to localStorage
  useEffect(() => {
    localStorage.setItem('ems_direct_messages', JSON.stringify(directMessages));
  }, [directMessages]);

  const directChatEndRef = useRef(null);
  useEffect(() => {
    if (directChatEndRef.current) {
      directChatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [directMessages, isDirectChatActive]);

  // Edit Profile States
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editAvatar, setEditAvatar] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editDob, setEditDob] = useState('');

  const employee = employees.find(e => e.id === currentUser?.employeeId);

  const handleOpenEditProfile = () => {
    if (!employee) return;
    setEditName(employee.name || '');
    setEditPhone(employee.phone || '');
    setEditAvatar(employee.avatar || '');
    setEditEmail(employee.email || '');
    setEditDob(employee.dob || '');
    setShowEditProfileModal(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setEditAvatar(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (!employee) return;
    if (!editName.trim()) {
      alert('Name cannot be empty.');
      return;
    }
    if (!editEmail.trim()) {
      alert('Email cannot be empty.');
      return;
    }
    if (!editDob) {
      alert('Date of Birth cannot be empty.');
      return;
    }
    const birthDate = new Date(editDob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    if (age < 18) {
      alert('You must be at least 18 years old.');
      return;
    }
    updateEmployee(employee.id, {
      ...employee,
      name: editName.trim(),
      phone: editPhone.trim(),
      avatar: editAvatar.trim(),
      email: editEmail.trim(),
      dob: editDob
    });
    setShowEditProfileModal(false);
  };

  if (!employee) {
    return (
      <div className="card" style={{ padding: '40px', textAlign: 'center', margin: '40px auto', maxWidth: '500px' }}>
        <FiAlertCircle size={48} style={{ color: 'var(--color-danger)', marginBottom: '16px' }} />
        <h3>Employee Record Not Found</h3>
        <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>Your current session employee identifier does not match active records.</p>
      </div>
    );
  }

  // Attendance Prompt State (Prompt only once per login session)
  const [showAttendancePrompt, setShowAttendancePrompt] = useState(() => {
    const prompted = sessionStorage.getItem(`ems_attendance_prompted_${employee.id}`);
    return !prompted;
  });

  const handleConfirmAttendance = (statusValue) => {
    updateEmployee(employee.id, {
      ...employee,
      status: statusValue
    });
    sessionStorage.setItem(`ems_attendance_prompted_${employee.id}`, 'true');
    setShowAttendancePrompt(false);
  };

  // Calculate dynamic but consistent attendance rate
  const getAttendanceRate = (empId) => {
    const numPart = parseInt(empId.replace(/\D/g, '')) || 5;
    return 84 + (numPart % 15);
  };
  const attendanceRate = getAttendanceRate(employee.id);

  // Filter projects assigned to this employee
  const assignedProjects = projects.filter(p => p.memberIds?.includes(employee.id));

  // Merge queries and leave requests into an "orders" style log list
  const getCombinedLogs = () => {
    const logs = [];
    // Convert queries
    queries.filter(q => q.employeeId === employee.id).forEach(q => {
      logs.push({
        id: q.id.slice(-6).toUpperCase(),
        type: 'Helpdesk Query',
        subject: q.subject,
        date: q.date,
        status: q.status === 'Resolved' ? 'Delivered' : 'Pending',
        raw: q
      });
    });
    // Convert leaves
    leaveApplications.filter(l => l.employeeId === employee.id).forEach(l => {
      logs.push({
        id: l.id.slice(-6).toUpperCase(),
        type: 'Leave Application',
        subject: `${l.requestedDays} days (${l.reason})`,
        date: l.appliedOn,
        status: l.status === 'Approved' ? 'Delivered' : l.status === 'Rejected' ? 'Refund' : 'Pending',
        raw: l
      });
    });
    // Sort by date desc
    return logs.sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  const combinedLogs = getCombinedLogs();

  const handleToggleProjectStatus = (proj) => {
    const nextStatus = proj.status === 'Active' ? 'Inactive' : 'Active';
    updateProject(proj.id, { ...proj, status: nextStatus });
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
    setShowModal(false);
  };

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
    setShowModal(false);
  };

  // Helper for App brand styling icons
  const getAppIcon = (name) => {
    const n = name.toLowerCase();
    if (n.includes('drive') || n.includes('cloud')) {
      return (
        <svg viewBox="0 0 24 24" width="36" height="36" style={{ fill: 'none' }}>
          <path d="M19.5 16.5h-15l3-5.2h15l-3 5.2z" fill="#FFC107" />
          <path d="M6 10l7.5-13 3 5.2-7.5 13-3-5.2z" fill="#2196F3" />
          <path d="M9 16.5L1.5 3.5h6l7.5 13H9z" fill="#4CAF50" />
        </svg>
      );
    } else if (n.includes('mail') || n.includes('marketing') || n.includes('camp')) {
      return (
        <svg viewBox="0 0 24 24" width="36" height="36" style={{ fill: '#334155' }}>
          <circle cx="12" cy="12" r="10" fill="#FFE082" />
          <path d="M12 6a4 4 0 0 0-4 4c0 3 4 8 4 8s4-5 4-8a4 4 0 0 0-4-4zm0 5.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" />
        </svg>
      );
    } else {
      return (
        <svg viewBox="0 0 24 24" width="36" height="36" style={{ fill: 'none' }}>
          <path d="M12 2L2 22h20L12 2z" fill="#0052CC" />
          <path d="M12 6l7 14H5l7-14z" fill="#0065FF" />
          <circle cx="12" cy="15" r="2.5" fill="#FFFFFF" />
        </svg>
      );
    }
  };

  return (
    <div className="new-employee-portal-wrapper">
      
      {/* ── Subtitle banner matching mockup header title style ── */}
      <div className="portal-header-subtitle">
        <span className="subtitle-text">Together everyone achieves more</span>
      </div>

      {activeTab === 'users' ? (
        /* ── USER DETAILS VIEW (Dashboard Theme) ── */
        <div className="portal-user-tab-view">
          <div className="user-details-grid-layout">
            
            {/* Left Box: Avatar & Summary */}
            <div className="card user-profile-left-summary">
              <div className="user-profile-avatar-block">
                {employee.avatar ? (
                  <img src={employee.avatar} alt={employee.name} className="user-profile-large-avatar" />
                ) : (
                  <div className="user-profile-large-init">{employee.name[0].toUpperCase()}</div>
                )}
              </div>
              <h3 className="user-profile-display-name">{employee.name}</h3>
              <p className="user-profile-display-role">{employee.designation}</p>
              
              <div className="user-profile-status-badge-wrapper">
                <span className={`user-profile-status-pill ${employee.status.toLowerCase().replace(' ', '-')}`}>
                  ● {employee.status === 'Active' ? 'Active Today' : 'On Leave'}
                </span>
              </div>
              <button 
                type="button" 
                className="edit-profile-btn" 
                onClick={handleOpenEditProfile}
                style={{
                  marginTop: '20px',
                  padding: '10px 16px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  backgroundColor: 'var(--primary-light)',
                  color: 'var(--primary-color)',
                  borderRadius: 'var(--border-radius-sm)',
                  border: 'none',
                  cursor: 'pointer',
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'all 0.2s ease'
                }}
              >
                ⚙️ Edit Profile Details
              </button>
            </div>

            {/* Right Box: Corporate Metadata */}
            <div className="card user-profile-details-info">
              <h4 className="user-profile-section-title">Corporate & Personal Information</h4>
              <div className="user-profile-info-grid">
                <div className="info-attribute-row">
                  <span className="info-attribute-label">Employee ID</span>
                  <strong className="info-attribute-val">{employee.id}</strong>
                </div>
                <div className="info-attribute-row">
                  <span className="info-attribute-label">Department</span>
                  <strong className="info-attribute-val">{employee.department}</strong>
                </div>
                <div className="info-attribute-row">
                  <span className="info-attribute-label">Email Address</span>
                  <strong className="info-attribute-val">{employee.email}</strong>
                </div>
                <div className="info-attribute-row">
                  <span className="info-attribute-label">Phone Number</span>
                  <strong className="info-attribute-val">{employee.phone}</strong>
                </div>
                <div className="info-attribute-row">
                  <span className="info-attribute-label">Joining Date</span>
                  <strong className="info-attribute-val">{formatDate(employee.joinDate)}</strong>
                </div>
                <div className="info-attribute-row">
                  <span className="info-attribute-label">Date of Birth (D.O.B)</span>
                  <strong className="info-attribute-val">{employee.dob ? formatDate(employee.dob) : 'Not Specified'}</strong>
                </div>
                <div className="info-attribute-row">
                  <span className="info-attribute-label">Monthly Salary</span>
                  <strong className="info-attribute-val">{formatCurrency(employee.salary)}</strong>
                </div>
              </div>
            </div>

          </div>

          {/* Bottom Grid: Performance */}
          <div className="portal-user-bottom-row single-column">
            
            {/* Performance/Attendance rate card */}
            <div className="card user-profile-attendance-rate-card">
              <h4 className="user-profile-section-title" style={{ marginBottom: '10px' }}>Attendance Rate</h4>
              <div className="attendance-gauge-area">
                <span className="attendance-percentage">{attendanceRate}%</span>
                <div className="attendance-bar-track">
                  <div className="attendance-bar-fill" style={{ width: `${attendanceRate}%` }} />
                </div>
              </div>
              <p className="attendance-rating-text" style={{ marginTop: '10px' }}>
                {attendanceRate >= 90 ? '🟢 Outstanding attendance rating' : '🟡 Meets targets'}
              </p>
            </div>

          </div>
        </div>
      ) : activeTab === 'projects' ? (
        /* ── PROJECTS VIEW (Tasks & Teammates Chat) ── */
        <div className="portal-projects-tab-view fade-in">
          <div className="portal-projects-layout">
            
            {/* Left Column: Assigned Projects List */}
            <div className="card portal-projects-list-card">
              <h3 className="card-section-title" style={{ textAlign: 'left', marginBottom: '16px' }}>Assigned Projects</h3>
              <div className="portal-projects-nav-list">
                {assignedProjects.length === 0 ? (
                  <p className="no-data-alert">You are not assigned to any projects.</p>
                ) : (
                  assignedProjects.map(proj => {
                    const isSelected = selectedProjId === proj.id || (!selectedProjId && assignedProjects[0]?.id === proj.id);
                    return (
                      <button
                        key={proj.id}
                        type="button"
                        className={`portal-project-nav-item ${isSelected ? 'active' : ''}`}
                        onClick={() => setSelectedProjId(proj.id)}
                      >
                        <div className="portal-project-nav-icon">📁</div>
                        <div className="portal-project-nav-meta">
                          <strong className="portal-project-nav-name">{proj.name}</strong>
                          <span className="portal-project-nav-status">{proj.status}</span>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            {/* Right Column: Selected Project Detail, Tasks, and Chat Workspace */}
            {(() => {
              const activeProj = projects.find(p => p.id === selectedProjId) || assignedProjects[0];
              if (!activeProj) {
                return (
                  <div className="card portal-project-workspace-empty">
                    <FiBriefcase size={48} style={{ color: 'var(--text-light)', marginBottom: '16px' }} />
                    <p style={{ color: 'var(--text-muted)' }}>No projects assigned to you. Contact manager to request assignment.</p>
                  </div>
                );
              }

              // Filter tasks and teammates
              const projectTasks = activeProj.tasks || [];
              const projectChat = activeProj.chatMessages || [];

              // Chat Input handling
              const currentChatVal = chatInputs[activeProj.id] || '';
              const handleChatSend = (e) => {
                e.preventDefault();
                if (!currentChatVal.trim()) return;

                const newMsg = {
                  id: `msg-${activeProj.id}-${Date.now()}`,
                  senderId: employee.id,
                  senderName: employee.name,
                  text: currentChatVal.trim(),
                  time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                  timestamp: Date.now()
                };

                const updatedChat = [...projectChat, newMsg];
                updateProject(activeProj.id, {
                  ...activeProj,
                  chatMessages: updatedChat
                });

                // Clear input
                setChatInputs(prev => ({ ...prev, [activeProj.id]: '' }));
              };

              const handleTaskProgressUpdate = (taskId, newProgress) => {
                const updatedTasks = projectTasks.map(t =>
                  t.id === taskId ? { ...t, progress: newProgress } : t
                );
                updateProject(activeProj.id, {
                  ...activeProj,
                  tasks: updatedTasks
                });
              };

              const handleTaskAssigneeUpdate = (taskId, newAssigneeId) => {
                const updatedTasks = projectTasks.map(t =>
                  t.id === taskId ? { ...t, assigneeId: newAssigneeId || null } : t
                );
                updateProject(activeProj.id, {
                  ...activeProj,
                  tasks: updatedTasks
                });
              };

              return (
                <div className="portal-project-workspace">
                  {/* Workspace Header */}
                  <div className="card portal-workspace-header-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                      <div>
                        <h2 className="workspace-project-title" style={{ fontSize: '1.25rem', fontWeight: 800 }}>{activeProj.name}</h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '4px' }}>
                          {activeProj.description || 'No description provided.'}
                        </p>
                      </div>
                      <span className={`project-status-badge ${activeProj.status === 'Active' ? 'status-active' : 'status-inactive'}`}>
                        {activeProj.status}
                      </span>
                    </div>
                  </div>

                  <div className="portal-workspace-panes-grid">
                    
                    {/* Tasks Pane */}
                    <div className="card portal-workspace-pane portal-tasks-pane">
                      <h3 className="pane-title" style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '16px' }}>📋 Task Checklist</h3>
                      <div className="portal-tasks-list">
                        {projectTasks.length === 0 ? (
                          <p className="no-data-alert" style={{ gridColumn: '1 / -1' }}>No tasks assigned in this project yet.</p>
                        ) : (
                          projectTasks.map(task => {
                            const isAssignedToMe = task.assigneeId === employee.id;
                            const assignee = employees.find(e => e.id === task.assigneeId);
                            const assigneeName = assignee ? assignee.name : 'Unassigned';
                            
                            // Get slider local state or fallback to database progress value
                            const sliderVal = taskSliders[task.id] !== undefined ? taskSliders[task.id] : task.progress;

                            return (
                              <div key={task.id} className={`portal-task-item ${isAssignedToMe ? 'assigned-me' : ''}`}>
                                <div className="portal-task-meta">
                                  <strong className="portal-task-title">{task.title || 'General Project Task'}</strong>
                                  <div className="portal-task-submeta">
                                    <span className="task-deadline">📅 Due: {task.deadline}</span>
                                    <div className="portal-task-assignee-row" style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                      <span className="task-assignee">
                                        👤 Assignee:{' '}
                                        <select
                                          value={task.assigneeId || ''}
                                          onChange={(e) => handleTaskAssigneeUpdate(task.id, e.target.value)}
                                          className="portal-task-assignee-select"
                                        >
                                          <option value="">Unassigned</option>
                                          {activeProj.memberIds.map(memId => {
                                            const mem = employees.find(e => e.id === memId);
                                            if (!mem) return null;
                                            return (
                                              <option key={memId} value={memId}>
                                                {mem.id === employee.id ? 'Me' : mem.name}
                                              </option>
                                            );
                                          })}
                                        </select>
                                      </span>
                                      {!isAssignedToMe && (
                                        <button
                                          type="button"
                                          className="portal-claim-task-btn"
                                          onClick={() => handleTaskAssigneeUpdate(task.id, employee.id)}
                                        >
                                          Join Task
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                <div className="portal-task-progress-control">
                                  {isAssignedToMe ? (
                                    <div className="portal-interactive-progress">
                                      <div className="slider-label-row">
                                        <span className="progress-lbl">Completion: <strong>{sliderVal}%</strong></span>
                                      </div>
                                      <div className="slider-action-row">
                                        <input
                                          type="range"
                                          min="0"
                                          max="100"
                                          value={sliderVal}
                                          onChange={(e) => {
                                            const val = parseInt(e.target.value);
                                            setTaskSliders(prev => ({ ...prev, [task.id]: val }));
                                          }}
                                          className="progress-range-slider"
                                        />
                                        <button
                                          type="button"
                                          className="update-progress-btn"
                                          onClick={() => handleTaskProgressUpdate(task.id, sliderVal)}
                                          disabled={sliderVal === task.progress}
                                        >
                                          Save Progress
                                        </button>
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="portal-static-progress">
                                      <div className="static-progress-bar-track">
                                        <div className="static-progress-bar-fill" style={{ width: `${task.progress}%` }} />
                                      </div>
                                      <span className="static-progress-text">{task.progress}%</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>

                    {/* Chat Pane */}
                    <div className="card portal-workspace-pane portal-chat-pane">
                      <h3 className="pane-title" style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '16px' }}>💬 Teammates Chat</h3>
                      
                      <div className="portal-chat-feed">
                        {projectChat.length === 0 ? (
                          <p className="no-messages-hint">No messages in this chat yet. Start the conversation!</p>
                        ) : (
                          projectChat.map(msg => {
                            const isMe = msg.senderId === employee.id;
                            const init = msg.senderName ? msg.senderName[0].toUpperCase() : 'T';
                            return (
                              <div key={msg.id} className={`chat-message-row ${isMe ? 'message-me' : 'message-other'}`}>
                                {!isMe && (
                                  <div className="chat-avatar-circle" title={msg.senderName}>
                                    {init}
                                  </div>
                                )}
                                <div className="chat-message-bubble">
                                  {!isMe && <span className="chat-sender-name">{msg.senderName}</span>}
                                  <p className="chat-sender-text">{msg.text}</p>
                                  <span className="chat-sender-time">{msg.time}</span>
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>

                      {/* Chat Input form */}
                      <form onSubmit={handleChatSend} className="portal-chat-input-bar">
                        <input
                          type="text"
                          placeholder="Type a message to your teammates..."
                          value={currentChatVal}
                          onChange={(e) => setChatInputs(prev => ({ ...prev, [activeProj.id]: e.target.value }))}
                        />
                        <button type="submit" className="chat-send-btn" disabled={!currentChatVal.trim()}>
                          Send
                        </button>
                      </form>
                    </div>

                  </div>
                </div>
              );
            })()}

          </div>
        </div>
      ) : activeTab === 'tasks' ? (
        /* ── TASKS VIEW (Project & Deadline reminders as messages) ── */
        <div className="portal-tasks-reminders-view fade-in">
          <div className="card portal-tasks-reminders-card">
            <h3 className="card-section-title" style={{ textAlign: 'left', marginBottom: '8px' }}>🔔 Project & Task Reminders</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '24px' }}>
              Your current active project deadlines and task completion alert messages.
            </p>

            <div className="portal-reminders-feed">
              {assignedProjects.length === 0 ? (
                <div className="portal-reminder-alert-box success-alert">
                  <div className="alert-header">
                    <span className="alert-icon">🎉</span>
                    <strong>No Active Deadlines</strong>
                  </div>
                  <p className="alert-message">
                    Hello <strong>{employee.name}</strong>, you are currently not assigned to any active projects. There are no pending project deadlines. Keep up the good work!
                  </p>
                </div>
              ) : (
                assignedProjects.map(proj => {
                  const projTasks = proj.tasks || [];
                  const myTasks = projTasks.filter(t => t.assigneeId === employee.id);
                  const pendingMyTasks = myTasks.filter(t => t.progress < 100);

                  // Calculate days remaining dynamically
                  let daysRemaining;
                  let deadlineStr = proj.deadline ? formatDate(proj.deadline) : 'Not specified';
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);

                  if (proj.deadline) {
                    const targetDate = new Date(proj.deadline + 'T00:00:00');
                    const diffTime = targetDate - today;
                    daysRemaining = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
                  } else {
                    const hash = getHash(proj.id);
                    daysRemaining = 90 + (hash % 40);
                  }

                  const isUrgent = daysRemaining <= 15;

                  return (
                    <div key={proj.id} className="portal-project-reminder-group">
                      {/* Overall Project Reminder message */}
                      <div className={`portal-reminder-alert-box ${isUrgent ? 'warning-alert' : 'info-alert'}`}>
                        <div className="alert-header">
                          <span className="alert-icon">{isUrgent ? '⚠️' : 'ℹ️'}</span>
                          <strong>Project Assignment Details</strong>
                          <span className="alert-time-tag">{daysRemaining} days left</span>
                        </div>
                        <p className="alert-message">
                          Dear <strong>{employee.name}</strong>, you are currently working on <strong>{proj.name}</strong>.
                          The project deadline is set for <strong>{deadlineStr}</strong>.
                          You have <strong>{pendingMyTasks.length}</strong> pending task(s) on this project. Please plan accordingly.
                        </p>
                      </div>

                      {/* Tasks message list */}
                      <div className="portal-reminder-tasks-sublist">
                        {myTasks.length === 0 ? (
                          <div className="portal-reminder-task-bubble info-bubble">
                            <p>No specific tasks are currently assigned to you for this project.</p>
                          </div>
                        ) : (
                          myTasks.map(task => {
                            const isCompleted = task.progress === 100;
                            
                            // Task deadline remaining days
                            let taskDays;
                            let taskDeadlineStr = task.deadline ? formatDate(task.deadline) : 'Not specified';
                            if (task.deadline) {
                              const targetDate = new Date(task.deadline + 'T00:00:00');
                              const diffTime = targetDate - today;
                              taskDays = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
                            } else {
                              taskDays = 5;
                            }

                            return (
                              <div key={task.id} className={`portal-reminder-task-bubble ${isCompleted ? 'success-bubble' : taskDays <= 5 ? 'danger-bubble' : 'warning-bubble'}`}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                                  <strong style={{ fontSize: '0.85rem' }}>
                                    {isCompleted ? '✅ Task Completed' : taskDays <= 5 ? '⏰ Urgent Task Alert' : '✍ Pending Task Reminder'}
                                  </strong>
                                  <span style={{ fontSize: '0.72rem', opacity: 0.8 }}>Due: {taskDeadlineStr}</span>
                                </div>
                                <p style={{ fontSize: '0.825rem', margin: '4px 0 0 0', lineHeight: 1.4 }}>
                                  {isCompleted ? (
                                    <>Excellent work! You have finished the task <strong>"{task.title || 'General Project Task'}"</strong> successfully.</>
                                  ) : (
                                    <>Your task <strong>"{task.title || 'General Project Task'}"</strong> is currently at <strong>{task.progress}%</strong> completion. The deadline is in <strong>{taskDays} day(s)</strong>. Please make sure to update and save your progress regularly.</>
                                  )}
                                </p>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      ) : activeTab === 'team' ? (() => {
        // Get unique member IDs from all projects assigned to this employee (excluding the employee themselves)
        const teamMemberIds = Array.from(
          new Set(
            assignedProjects.reduce((acc, proj) => {
              return [...acc, ...(proj.memberIds || [])];
            }, [])
          )
        ).filter(id => id !== employee.id);

        const projectTeamMembers = employees.filter(emp => teamMemberIds.includes(emp.id));

        return (
          <div className="portal-team-directory-view fade-in">
            
            {/* Detailed Profile View if a member is selected */}
            {selectedMemberId && (() => {
              const member = employees.find(e => e.id === selectedMemberId);
              if (!member) return null;

              // Find projects assigned to this member
              const memberProjects = projects.filter(p => p.memberIds?.includes(member.id));

              return (
                <div className="portal-profile-modal-backdrop" onClick={() => { setSelectedMemberId(null); setIsDirectChatActive(false); }}>
                  <div className="portal-profile-modal-card animate-slide-up" onClick={(e) => e.stopPropagation()}>
                    <div className="portal-profile-modal-header">
                      <button className="portal-profile-modal-close" onClick={() => { setSelectedMemberId(null); setIsDirectChatActive(false); }}>×</button>
                      <div className="portal-profile-banner">
                        <div className="portal-profile-header-avatar">
                          {member.avatar ? (
                            <img src={member.avatar} alt={member.name} className="profile-img-large" />
                          ) : (
                            <div className="profile-initials-large">
                              {member.name ? member.name[0].toUpperCase() : 'U'}
                            </div>
                          )}
                        </div>
                        <div className="portal-profile-header-meta">
                          <h2 className="portal-profile-name">{member.name}</h2>
                          <p className="portal-profile-title">{member.designation} · {member.department}</p>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '6px' }}>
                            <span className={`project-status-badge status-active`} style={{ display: 'inline-block' }}>
                              {member.status || 'Active'}
                            </span>
                            {!isDirectChatActive && (
                              <button
                                type="button"
                                onClick={() => setIsDirectChatActive(true)}
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                  padding: '4px 12px',
                                  fontSize: '0.75rem',
                                  fontWeight: 700,
                                  backgroundColor: 'var(--primary-color)',
                                  color: '#ffffff',
                                  borderRadius: 'var(--border-radius-full)',
                                  cursor: 'pointer',
                                  boxShadow: 'var(--shadow-sm)',
                                  transition: 'background-color var(--transition-fast)'
                                }}
                              >
                                💬 Message
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="portal-profile-modal-body" style={isDirectChatActive ? { display: 'flex', flexDirection: 'column', height: '450px', maxHeight: '60vh' } : {}}>
                      {isDirectChatActive ? (
                        <div className="portal-direct-chat-container" style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: '100%' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
                            <button 
                              type="button" 
                              onClick={() => setIsDirectChatActive(false)}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                fontSize: '0.8rem',
                                fontWeight: '700',
                                color: 'var(--primary-color)',
                                cursor: 'pointer'
                              }}
                            >
                              ← Back to Details
                            </button>
                            <span style={{ fontSize: '0.85rem', fontWeight: '800', color: 'var(--text-title)' }}>
                              Direct Chat
                            </span>
                          </div>

                          {/* Chat Feed */}
                          <div 
                            className="portal-chat-feed" 
                            style={{ 
                              flex: 1, 
                              overflowY: 'auto', 
                              display: 'flex', 
                              flexDirection: 'column', 
                              gap: '12px', 
                              paddingRight: '4px',
                              margin: '0'
                            }}
                          >
                            {(() => {
                              const dmHistory = directMessages.filter(msg => 
                                (msg.senderId === employee.id && msg.receiverId === member.id) ||
                                (msg.senderId === member.id && msg.receiverId === employee.id)
                              ).sort((a, b) => a.timestamp - b.timestamp);

                              return dmHistory.length === 0 ? (
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)' }}>
                                  <span style={{ fontSize: '2rem', marginBottom: '8px' }}>💬</span>
                                  <p className="no-messages-hint">No messages yet. Send a message to start chatting!</p>
                                </div>
                              ) : (
                                <>
                                  {dmHistory.map(msg => {
                                    const isMe = msg.senderId === employee.id;
                                    const init = msg.senderName ? msg.senderName[0].toUpperCase() : 'U';
                                    return (
                                      <div key={msg.id} className={`chat-message-row ${isMe ? 'message-me' : 'message-other'}`}>
                                        {!isMe && (
                                          <div className="chat-avatar-circle" title={msg.senderName} style={{ marginRight: '6px' }}>
                                            {init}
                                          </div>
                                        )}
                                        <div className="chat-message-bubble">
                                          <p className="chat-sender-text">{msg.text}</p>
                                          <span className="chat-sender-time">{msg.time}</span>
                                        </div>
                                      </div>
                                    );
                                  })}
                                  <div ref={directChatEndRef} />
                                </>
                              );
                            })()}
                          </div>

                          {/* Chat Input form */}
                          <form 
                            onSubmit={(e) => {
                              e.preventDefault();
                              if (!dmInput.trim()) return;

                              const newDM = {
                                id: `dm-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
                                senderId: employee.id,
                                senderName: employee.name,
                                receiverId: member.id,
                                text: dmInput.trim(),
                                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                                timestamp: Date.now()
                              };

                              setDirectMessages(prev => [...prev, newDM]);
                              setDmInput('');
                            }} 
                            className="portal-chat-input-bar"
                          >
                            <input
                              type="text"
                              placeholder={`Message ${member.name.split(' ')[0]}...`}
                              value={dmInput}
                              onChange={(e) => setDmInput(e.target.value)}
                            />
                            <button type="submit" className="chat-send-btn" disabled={!dmInput.trim()}>
                              Send
                            </button>
                          </form>
                        </div>
                      ) : (
                        <div className="portal-profile-details-grid">
                          
                          {/* Left: General Info */}
                          <div className="portal-profile-section-card">
                            <h3 className="section-card-title">👤 Personal Details</h3>
                            <div className="portal-detail-list">
                              <div className="portal-detail-row">
                                <span className="detail-label">ID:</span>
                                <span className="detail-value">{member.id}</span>
                              </div>
                              <div className="portal-detail-row">
                                <span className="detail-label">Role:</span>
                                <span className="detail-value">{member.role === 'admin' ? 'Administrator' : 'Employee'}</span>
                              </div>
                              <div className="portal-detail-row">
                                <span className="detail-label">Joining Date:</span>
                                <span className="detail-value">{member.joiningDate ? formatDate(member.joiningDate) : 'Not Specified'}</span>
                              </div>
                              <div className="portal-detail-row">
                                <span className="detail-label">Date of Birth:</span>
                                <span className="detail-value">{member.dob ? formatDate(member.dob) : 'Not Specified'}</span>
                              </div>
                              <div className="portal-detail-row">
                                <span className="detail-label">Office Location:</span>
                                <span className="detail-value">{member.location || 'Headquarters'}</span>
                              </div>
                            </div>
                          </div>

                          {/* Right: Contact details */}
                          <div className="portal-profile-section-card">
                            <h3 className="section-card-title">📞 Contact Info</h3>
                            <div className="portal-detail-list">
                              <div className="portal-detail-row">
                                <span className="detail-label">Email:</span>
                                <span className="detail-value">{member.email || `${member.name.toLowerCase().replace(/\s+/g, '')}@company.com`}</span>
                              </div>
                              <div className="portal-detail-row">
                                <span className="detail-label">Phone:</span>
                                <span className="detail-value">{member.phone || '+1 (555) 019-2834'}</span>
                              </div>
                            </div>
                          </div>

                          {/* Work metrics */}
                          <div className="portal-profile-section-card full-width-card">
                            <h3 className="section-card-title">📈 Workplace Analytics</h3>
                            <div className="portal-profile-analytics-grid">
                              <div className="analytic-stat-box">
                                <span className="stat-label">Attendance Rate</span>
                                <strong className="stat-value">{member.attendanceRate || 95}%</strong>
                              </div>
                              <div className="analytic-stat-box">
                                <span className="stat-label">Leave Balance</span>
                                <strong className="stat-value">{member.leaveBalance !== undefined ? member.leaveBalance : 14} days</strong>
                              </div>
                              <div className="analytic-stat-box">
                                <span className="stat-label">Performance Score</span>
                                <strong className="stat-value">{member.performanceScore || '4.8 / 5.0'}</strong>
                              </div>
                            </div>
                          </div>

                          {/* Projects Assigned */}
                          <div className="portal-profile-section-card full-width-card">
                            <h3 className="section-card-title">📁 Assigned Projects ({memberProjects.length})</h3>
                            <div className="portal-profile-projects-list">
                              {memberProjects.length === 0 ? (
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Not assigned to any active projects.</p>
                              ) : (
                                memberProjects.map(p => (
                                  <div key={p.id} className="portal-profile-project-item">
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                      <strong style={{ fontSize: '0.875rem', color: 'var(--text-title)' }}>{p.name}</strong>
                                      <span className={`project-status-badge ${p.status === 'Active' ? 'status-active' : 'status-inactive'}`} style={{ fontSize: '0.7rem' }}>
                                        {p.status}
                                      </span>
                                    </div>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                                      {p.description || 'No description provided.'}
                                    </p>
                                  </div>
                                ))
                              )}
                            </div>
                          </div>

                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Directory Grid */}
            <div className="card portal-team-directory-card">
              <h3 className="card-section-title" style={{ textAlign: 'left', marginBottom: '8px' }}>👥 Project Teammates</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '24px' }}>
                Teammates assigned to the same projects as you. Click any card to view their corporate contact records and assignments.
              </p>

              {projectTeamMembers.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
                  <p>You are currently not assigned to any projects with other team members.</p>
                </div>
              ) : (
                <div className="portal-team-grid">
                  {projectTeamMembers.map(emp => (
                    <div key={emp.id} className="portal-team-member-card" onClick={() => setSelectedMemberId(emp.id)}>
                      <div className="member-card-avatar-wrapper">
                        {emp.avatar ? (
                          <img src={emp.avatar} alt={emp.name} className="member-card-img" />
                        ) : (
                          <div className="member-card-initials">
                            {emp.name ? emp.name[0].toUpperCase() : 'U'}
                          </div>
                        )}
                      </div>
                      <strong className="member-card-name">{emp.name}</strong>
                      <span className="member-card-title">{emp.designation}</span>
                      <span className="member-card-dept">{emp.department}</span>
                      
                      <button type="button" className="member-card-view-btn">
                        View Full Profile
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        );
      })()
      : activeTab === 'application' ? (
        /* ── APPLICATION VIEW (Relocated logs) ── */
        <div className="portal-application-tab-view">
          <div className="card last-orders-card full-width">
            <div className="orders-card-header">
              <h3 className="card-section-title">Last application</h3>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <select className="sort-orders-select" defaultValue="news">
                  <option value="news">Sort by news</option>
                </select>
                <button 
                  type="button" 
                  className="new-entry-btn"
                  onClick={() => setShowModal('leave')}
                >
                  <FiPlus /> NEW ENTRY
                </button>
              </div>
            </div>

            <div className="orders-table-container">
              <table className="orders-table-element">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Customer</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {combinedLogs.map(log => (
                    <tr key={log.id}>
                      <td className="order-id-td">{log.id}</td>
                      <td className="order-name-td">
                        <div className="order-cust-cell">
                          <strong className="cust-title">{log.type}</strong>
                          <span className="cust-desc">{log.subject}</span>
                        </div>
                      </td>
                      <td className="order-date-td">{formatDate(log.date)}</td>
                      <td>
                        <span className={`order-status-badge ${log.status.toLowerCase()}`}>
                          {log.status === 'Delivered' ? 'Delivered' : log.status === 'Refund' ? 'Refund' : 'Pending'}
                        </span>
                      </td>
                      <td className="order-actions-td">
                        <button className="table-act-btn" title="View details"><FiMoreHorizontal /></button>
                        <button className="table-act-btn edit" title="Edit entry"><FiEdit2 /></button>
                      </td>
                    </tr>
                  ))}
                  {combinedLogs.length === 0 && (
                    <tr>
                      <td colSpan="5" className="orders-no-data">No submitted entry records found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* ── DASHBOARD VIEW (Metrics & Visuals) ── */
        <>
          {/* ── 1. Top Metrics Cards ── */}
          <div className="portal-metrics-row">
            
            {/* Card 1: Total Profit / Salary (Gold card) */}
            <div className="portal-metric-card gold-card">
              <div className="metric-info-box">
                <span className="metric-lbl">TOTAL PROFIT</span>
                <strong className="metric-val">{formatCurrency(employee.salary)}</strong>
                <span className="metric-subtext">{formatCurrency(employee.salary)} last month</span>
              </div>
            </div>

            {/* Card 2: Budget / Leave balance */}
            <div className="portal-metric-card">
              <div className="metric-info-box">
                <span className="metric-lbl">BUDGET</span>
                <strong className="metric-val">$20,000</strong>
                <span className="metric-subtext negative-trend"><FiTrendingDown /> 12% Since last month</span>
              </div>
              <span className="metric-icon-badge orange"><FiClock /></span>
            </div>

            {/* Card 3: Total Users / Attendance rate */}
            <div className="portal-metric-card">
              <div className="metric-info-box">
                <span className="metric-lbl">TOTAL USERS</span>
                <strong className="metric-val">{attendanceRate}%</strong>
                <span className="metric-subtext positive-trend"><FiTrendingUp /> 15% Since last month</span>
              </div>
              <span className="metric-icon-badge green"><FiUsers /></span>
            </div>

            {/* Card 4: Progress / Completed projects */}
            <div className="portal-metric-card">
              <div className="metric-info-box">
                <span className="metric-lbl">PROGRESS</span>
                <strong className="metric-val">80%</strong>
                <span className="metric-subtext positive-trend"><FiTrendingUp /> 20% Since last month</span>
              </div>
              <span className="metric-icon-badge blue"><FiTrendingUp /></span>
            </div>

          </div>

          {/* ── 2. Middle Charts Row ── */}
          <div className="portal-charts-grid">
            
            {/* Line Chart: Users by device */}
            <div className="card line-chart-card">
              <div className="chart-card-header">
                <h3>Users by device</h3>
                <span className="chart-range-label">Last 7 days</span>
              </div>
              
              <div className="chart-svg-container">
                <svg className="custom-line-svg" viewBox="0 0 700 250">
                  {/* Grid Lines */}
                  <line x1="50" y1="50" x2="650" y2="50" stroke="var(--border-color)" strokeWidth="1" />
                  <line x1="50" y1="100" x2="650" y2="100" stroke="var(--border-color)" strokeWidth="1" />
                  <line x1="50" y1="150" x2="650" y2="150" stroke="var(--border-color)" strokeWidth="1" />
                  <line x1="50" y1="200" x2="650" y2="200" stroke="var(--border-color)" strokeWidth="1" />

                  {/* Grid Labels (Y-Axis) */}
                  <text x="20" y="55" fontSize="10" fill="var(--text-light)">50k</text>
                  <text x="20" y="105" fontSize="10" fill="var(--text-light)">30k</text>
                  <text x="20" y="155" fontSize="10" fill="var(--text-light)">15k</text>
                  <text x="20" y="205" fontSize="10" fill="var(--text-light)">0</text>

                  {/* Area Under Wavy Curve */}
                  <path d="M 50 200 L 50 130 L 150 150 L 250 135 L 350 70 L 450 110 L 550 120 L 650 110 L 650 200 Z" fill="rgba(99, 102, 241, 0.05)" />
                  
                  {/* Curve Line */}
                  <path d="M 50 130 Q 100 160 150 150 T 250 135 T 350 70 T 450 110 T 550 120 T 650 110" fill="none" stroke="var(--primary-color)" strokeWidth="3" />

                  {/* Vertical Plot Lines & Dots */}
                  <line x1="150" y1="150" x2="150" y2="200" stroke="var(--primary-color)" strokeWidth="1.5" strokeDasharray="3" />
                  <circle cx="150" cy="150" r="5" fill="var(--primary-color)" />

                  <line x1="350" y1="70" x2="350" y2="200" stroke="var(--primary-color)" strokeWidth="1.5" strokeDasharray="3" />
                  <circle cx="350" cy="70" r="5" fill="var(--primary-color)" />

                  <line x1="450" y1="110" x2="450" y2="200" stroke="var(--primary-color)" strokeWidth="1.5" strokeDasharray="3" />
                  <circle cx="450" cy="110" r="5" fill="var(--primary-color)" />

                  <line x1="550" y1="120" x2="550" y2="200" stroke="var(--primary-color)" strokeWidth="1.5" strokeDasharray="3" />
                  <circle cx="550" cy="120" r="5" fill="var(--primary-color)" />

                  <line x1="650" y1="110" x2="650" y2="200" stroke="var(--primary-color)" strokeWidth="1.5" strokeDasharray="3" />
                  <circle cx="650" cy="110" r="5" fill="var(--primary-color)" />

                  {/* X-Axis Labels */}
                  <text x="135" y="222" fontSize="10" fill="var(--text-light)">1 May</text>
                  <text x="335" y="222" fontSize="10" fill="var(--text-light)">3 May</text>
                  <text x="435" y="222" fontSize="10" fill="var(--text-light)">4 May</text>
                  <text x="535" y="222" fontSize="10" fill="var(--text-light)">5 May</text>
                  <text x="635" y="222" fontSize="10" fill="var(--text-light)">6 May</text>
                </svg>
              </div>
            </div>

            {/* Donut Chart: Users by device */}
            <div className="card donut-chart-card">
              <div className="chart-card-header">
                <h3>Users by device</h3>
              </div>
              
              <div className="donut-visual-container">
                <svg width="150" height="150" viewBox="0 0 42 42" className="donut-chart-svg">
                  <circle className="donut-hole" cx="21" cy="21" r="15.915" fill="var(--bg-card)"></circle>
                  <circle className="donut-ring" cx="21" cy="21" r="15.915" fill="transparent" stroke="var(--border-color)" strokeWidth="4"></circle>
                  {/* Segment 1: Desktop (60%) */}
                  <circle className="donut-segment" cx="21" cy="21" r="15.915" fill="transparent" stroke="var(--primary-color)" strokeWidth="4" strokeDasharray="60 40" strokeDashoffset="100"></circle>
                  {/* Segment 2: Tablet (20%) */}
                  <circle className="donut-segment" cx="21" cy="21" r="15.915" fill="transparent" stroke="#22C55E" strokeWidth="4" strokeDasharray="20 80" strokeDashoffset="40"></circle>
                  {/* Segment 3: Mobile (20%) */}
                  <circle className="donut-segment" cx="21" cy="21" r="15.915" fill="transparent" stroke="#F97316" strokeWidth="4" strokeDasharray="20 80" strokeDashoffset="20"></circle>
                </svg>
              </div>

              <div className="donut-breakdown-icons">
                <div className="breakdown-item">
                  <FiMonitor className="breakdown-icon blue" />
                  <strong className="breakdown-pct">60%</strong>
                </div>
                <div className="breakdown-item">
                  <FiTablet className="breakdown-icon green" />
                  <strong className="breakdown-pct">20%</strong>
                </div>
                <div className="breakdown-item">
                  <FiSmartphone className="breakdown-icon orange" />
                  <strong className="breakdown-pct">20%</strong>
                </div>
              </div>
            </div>

          </div>

          {/* ── 3. Bottom Grid (Full Width Projects list) ── */}
          <div className="portal-bottom-grid single-column">
            
            {/* Full-width Last Product */}
            <div className="card last-product-card">
              <h3 className="card-section-title">Last product</h3>
              <div className="products-list-container">
                {assignedProjects.length === 0 ? (
                  <p className="no-data-alert">You are not currently assigned to any product listings.</p>
                ) : (
                  assignedProjects.map(proj => (
                    <div key={proj.id} className="product-row-item">
                      <div className="product-item-left">
                        {getAppIcon(proj.name)}
                        <div className="product-text-meta">
                          <strong className="product-name">{proj.name}</strong>
                          <span className="product-updated-ago">Updated 5hr ago</span>
                        </div>
                      </div>
                      <button 
                        className="product-status-tag"
                        onClick={() => handleToggleProjectStatus(proj)}
                        style={{
                          background: proj.status === 'Active' ? 'var(--primary-light)' : 'var(--bg-app)',
                          color: proj.status === 'Active' ? 'var(--primary-color)' : 'var(--text-muted)',
                          border: '1px solid ' + (proj.status === 'Active' ? 'var(--primary-color)' : 'var(--border-color)')
                        }}
                      >
                        {proj.status}
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        </>
      )}

      {/* ── 4. Form Submission Modal (Floating popup) ── */}
      {showModal && (
        <div className="modal-backdrop-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content-card animate-zoom" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-tabs">
              <button 
                type="button" 
                className={`modal-tab-btn ${showModal === 'leave' ? 'active' : ''}`}
                onClick={() => setShowModal('leave')}
              >
                Apply Leave
              </button>
              <button 
                type="button" 
                className={`modal-tab-btn ${showModal === 'query' ? 'active' : ''}`}
                onClick={() => setShowModal('query')}
              >
                Submit Query
              </button>
            </div>

            <div className="modal-form-body">
              {showModal === 'leave' ? (
                <form onSubmit={handleLeaveSubmit} className="modal-interactive-form">
                  <h4 className="form-legend">Apply for Off-Duty Leave</h4>
                  <div className="form-grid-2col">
                    <div className="form-field-wrapper">
                      <label>Start Date</label>
                      <input
                        type="date"
                        value={leaveStart}
                        min={new Date().toISOString().split('T')[0]}
                        onChange={(e) => setLeaveStart(e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-field-wrapper">
                      <label>End Date</label>
                      <input
                        type="date"
                        value={leaveEnd}
                        min={leaveStart || new Date().toISOString().split('T')[0]}
                        onChange={(e) => setLeaveEnd(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {leaveStart && leaveEnd && new Date(leaveEnd) >= new Date(leaveStart) && (
                    <div className="duration-tip-box">
                      📅 Requested Leave Duration: <strong>{calcDays(leaveStart, leaveEnd)} day(s)</strong>
                    </div>
                  )}

                  <div className="form-field-wrapper">
                    <label>Leave Context / Reason</label>
                    <textarea
                      placeholder="Reason details for your request..."
                      value={leaveReason}
                      onChange={(e) => setLeaveReason(e.target.value)}
                      rows={3}
                      required
                    />
                  </div>

                  {leaveError && <p className="form-error-hint">⚠ {leaveError}</p>}

                  <div className="form-actions-footer">
                    <Button type="button" variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
                    <Button type="submit" variant="primary">Submit Entry</Button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleQuerySubmit} className="modal-interactive-form">
                  <h4 className="form-legend">Submit Query Ticket to Manager</h4>
                  
                  <div className="form-field-wrapper">
                    <label>Query Subject</label>
                    <input
                      type="text"
                      placeholder="e.g. IT support, Hardware request..."
                      value={querySubject}
                      onChange={(e) => setQuerySubject(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-field-wrapper">
                    <label>Detailed Message</label>
                    <textarea
                      placeholder="Explain your helpdesk ticket query here..."
                      value={queryMessage}
                      onChange={(e) => setQueryMessage(e.target.value)}
                      rows={4}
                      required
                    />
                  </div>

                  <div className="form-actions-footer">
                    <Button type="button" variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
                    <Button type="submit" variant="primary">Send Query</Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── 5. Attendance Prompt Modal (Triggered on login check-in) ── */}
      {showAttendancePrompt && (
        <div className="modal-backdrop-overlay attendance-prompt-backdrop">
          <div className="modal-content-card animate-zoom attendance-prompt-card" style={{ maxWidth: '400px', padding: '32px', textAlign: 'center' }}>
            <div className="attendance-prompt-header">
              <span className="attendance-prompt-icon">👋</span>
              <h3>Daily Check-in</h3>
              <p className="attendance-prompt-intro" style={{ marginTop: '8px', color: 'var(--text-muted)' }}>
                Good day, <strong>{employee.name}</strong>! Please confirm your status to update the company workspace directory.
              </p>
            </div>
            
            <div className="attendance-prompt-options" style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button
                type="button"
                className="attendance-btn active-today"
                onClick={() => handleConfirmAttendance('Active')}
              >
                🟢 Active Now
              </button>
              <button
                type="button"
                className="attendance-btn on-leave-today"
                onClick={() => handleConfirmAttendance('On Leave')}
              >
                🔴 On Leave
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── EDIT PROFILE MODAL ── */}
      {showEditProfileModal && (
        <div className="portal-profile-modal-backdrop" onClick={() => setShowEditProfileModal(false)}>
          <div className="portal-profile-modal-card animate-slide-up" style={{ maxWidth: '520px' }} onClick={(e) => e.stopPropagation()}>
            <div className="portal-profile-modal-header" style={{ padding: '20px 24px' }}>
              <button className="portal-profile-modal-close" onClick={() => setShowEditProfileModal(false)}>×</button>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0 }}>⚙️ Edit Workspace Profile</h3>
            </div>
            
            <form onSubmit={handleSaveProfile} className="portal-profile-modal-body" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* Photo Upload Section with Camera Overlay */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)' }}>PROFILE PHOTO</label>
                <div style={{ display: 'flex', justifyContent: 'center', margin: '10px 0' }}>
                  <div style={{ position: 'relative', width: '96px', height: '96px' }}>
                    {editAvatar ? (
                      <img src={editAvatar} alt="Preview" style={{ width: '96px', height: '96px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--primary-color)' }} />
                    ) : (
                      <div style={{ width: '96px', height: '96px', borderRadius: '50%', backgroundColor: 'var(--primary-light)', color: 'var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '2rem' }}>
                        {editName ? editName[0].toUpperCase() : 'U'}
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      id="edit-avatar-upload"
                      onChange={handleFileChange}
                      style={{ display: 'none' }}
                    />
                    <button
                      type="button"
                      onClick={() => document.getElementById('edit-avatar-upload').click()}
                      style={{
                        position: 'absolute',
                        bottom: '0',
                        right: '0',
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--primary-color)',
                        color: '#ffffff',
                        border: '2px solid #ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        boxShadow: 'var(--shadow-md)',
                        transition: 'transform var(--transition-fast)'
                      }}
                      title="Upload Profile Photo"
                    >
                      <FiCamera size={16} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Editable Fields */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)' }}>FULL NAME</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    required
                    style={{
                      padding: '10px 12px',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--border-radius-sm)',
                      fontSize: '0.85rem',
                      width: '100%',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)' }}>EMAIL ADDRESS</label>
                  <input
                    type="email"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    required
                    placeholder="Enter email address..."
                    style={{
                      padding: '10px 12px',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--border-radius-sm)',
                      fontSize: '0.85rem',
                      width: '100%',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)' }}>PHONE NUMBER</label>
                  <input
                    type="text"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    placeholder="Enter phone number..."
                    style={{
                      padding: '10px 12px',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--border-radius-sm)',
                      fontSize: '0.85rem',
                      width: '100%',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)' }}>DATE OF BIRTH</label>
                  <input
                    type="date"
                    value={editDob}
                    onChange={(e) => setEditDob(e.target.value)}
                    required
                    style={{
                      padding: '10px 12px',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--border-radius-sm)',
                      fontSize: '0.85rem',
                      width: '100%',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              {/* Read-Only Corporate Details */}
              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-light)', display: 'block', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Official Corporate Records (Read-Only)</span>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)' }}>EMPLOYEE ID</label>
                    <input
                      type="text"
                      value={employee.id}
                      disabled
                      style={{
                        padding: '8px 10px',
                        fontSize: '0.8rem',
                        backgroundColor: 'var(--secondary-light)',
                        border: '1px solid var(--border-color)',
                        borderRadius: 'var(--border-radius-sm)',
                        color: 'var(--text-muted)',
                        cursor: 'not-allowed',
                        width: '100%',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)' }}>DEPARTMENT</label>
                    <input
                      type="text"
                      value={employee.department}
                      disabled
                      style={{
                        padding: '8px 10px',
                        fontSize: '0.8rem',
                        backgroundColor: 'var(--secondary-light)',
                        border: '1px solid var(--border-color)',
                        borderRadius: 'var(--border-radius-sm)',
                        color: 'var(--text-muted)',
                        cursor: 'not-allowed',
                        width: '100%',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)' }}>DESIGNATION</label>
                    <input
                      type="text"
                      value={employee.designation}
                      disabled
                      style={{
                        padding: '8px 10px',
                        fontSize: '0.8rem',
                        backgroundColor: 'var(--secondary-light)',
                        border: '1px solid var(--border-color)',
                        borderRadius: 'var(--border-radius-sm)',
                        color: 'var(--text-muted)',
                        cursor: 'not-allowed',
                        width: '100%',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)' }}>JOINING DATE</label>
                    <input
                      type="text"
                      value={formatDate(employee.joinDate)}
                      disabled
                      style={{
                        padding: '8px 10px',
                        fontSize: '0.8rem',
                        backgroundColor: 'var(--secondary-light)',
                        border: '1px solid var(--border-color)',
                        borderRadius: 'var(--border-radius-sm)',
                        color: 'var(--text-muted)',
                        cursor: 'not-allowed',
                        width: '100%',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>



                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)' }}>MONTHLY SALARY</label>
                    <input
                      type="text"
                      value={formatCurrency(employee.salary)}
                      disabled
                      style={{
                        padding: '8px 10px',
                        fontSize: '0.8rem',
                        backgroundColor: 'var(--secondary-light)',
                        border: '1px solid var(--border-color)',
                        borderRadius: 'var(--border-radius-sm)',
                        color: 'var(--text-muted)',
                        cursor: 'not-allowed',
                        width: '100%',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>

                </div>
              </div>

              {/* Modal Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
                <button
                  type="button"
                  onClick={() => setShowEditProfileModal(false)}
                  style={{
                    padding: '8px 16px',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    backgroundColor: '#e2e8f0',
                    color: '#475569',
                    borderRadius: 'var(--border-radius-sm)',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '8px 16px',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    backgroundColor: 'var(--primary-color)',
                    color: '#ffffff',
                    borderRadius: 'var(--border-radius-sm)',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  Save Changes
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default EmployeePortal;

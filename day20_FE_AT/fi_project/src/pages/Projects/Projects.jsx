import React, { useState } from 'react';
import { useEmployees } from '../../context/EmployeeContext';
import { useProjects } from '../../context/ProjectContext';
import {
  FiSearch, FiPlus, FiBriefcase, FiUsers,
  FiTrash2, FiEdit2, FiX, FiCheckCircle, FiXCircle, FiMenu
} from 'react-icons/fi';
import Button from '../../components/UI/Button';
import ProjectDashboard from './ProjectDashboard';
import './Projects.css';

const Projects = () => {
  const { employees } = useEmployees();
  const { projects, addProject, updateProject, deleteProject, assignMemberToProject } = useProjects();

  const [selectedProject, setSelectedProject] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null); // project object or null

  // Dropdown states for "Active Workers Today" quick assignments
  const [workerAssignSelects, setWorkerAssignSelects] = useState({}); // employeeId -> projectId
  const [isActiveWorkersOpen, setIsActiveWorkersOpen] = useState(false);

  // Drawer Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('Active');
  const [deadline, setDeadline] = useState('');
  const [memberIds, setMemberIds] = useState([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');

  const handleOpenAdd = () => {
    setName('');
    setDescription('');
    setStatus('Active');
    setDeadline('');
    setMemberIds([]);
    setSelectedEmployeeId('');
    setEditingProject(null);
    setIsDrawerOpen(true);
  };

  const handleOpenEdit = (proj) => {
    setEditingProject(proj);
    setName(proj.name);
    setDescription(proj.description || '');
    setStatus(proj.status);
    setDeadline(proj.deadline || '');
    setMemberIds(proj.memberIds || []);
    setSelectedEmployeeId('');
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setEditingProject(null);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Project Name is required.');
      return;
    }

    const payload = {
      name: name.trim(),
      description: description.trim(),
      status,
      deadline,
      memberIds
    };

    if (editingProject) {
      updateProject(editingProject.id, payload);
    } else {
      addProject(payload);
    }

    handleCloseDrawer();
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      deleteProject(id);
    }
  };

  const handleAddMember = () => {
    if (!selectedEmployeeId) return;
    if (!memberIds.includes(selectedEmployeeId)) {
      const currentProjectsCount = projects.filter(p => 
        p.id !== (editingProject?.id || '') && p.memberIds?.includes(selectedEmployeeId)
      ).length;

      if (currentProjectsCount >= 2) {
        alert('This employee is already assigned to the maximum limit of 2 projects.');
        return;
      }

      setMemberIds([...memberIds, selectedEmployeeId]);
    }
    setSelectedEmployeeId('');
  };

  const handleRemoveMember = (idToRemove) => {
    setMemberIds(memberIds.filter(id => id !== idToRemove));
  };

  const handleWorkerAssignChange = (empId, projId) => {
    setWorkerAssignSelects(prev => ({ ...prev, [empId]: projId }));
  };

  const handleTriggerWorkerAssign = (empId) => {
    const projId = workerAssignSelects[empId];
    if (!projId) return;
    assignMemberToProject(projId, empId);
    // clear select
    setWorkerAssignSelects(prev => ({ ...prev, [empId]: '' }));
  };

  // Helper resolvers
  const getEmployeeName = (id) => {
    const emp = employees.find(e => e.id === id);
    return emp ? emp.name : `Unknown (ID: ${id})`;
  };

  const getEmployeeDept = (id) => {
    const emp = employees.find(e => e.id === id);
    return emp ? emp.department : '';
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Filter projects by search query
  const filteredProjects = projects.filter((p) => {
    const query = searchQuery.toLowerCase();
    const hasNameMatch = p.name.toLowerCase().includes(query);
    const hasDescMatch = (p.description || '').toLowerCase().includes(query);
    const hasMemberMatch = p.memberIds?.some(id =>
      getEmployeeName(id).toLowerCase().includes(query)
    );
    return hasNameMatch || hasDescMatch || hasMemberMatch;
  });

  // Filter active employees (status is Active, not On Leave or Terminated)
  const activeWorkers = employees.filter(e => e.status === 'Active');

  // Filter employees that can be added (not currently members)
  const availableEmployeesToAdd = employees.filter(
    emp => !memberIds.includes(emp.id) && emp.status === 'Active'
  );

  if (selectedProject) {
    const currentProj = projects.find(p => p.id === selectedProject.id) || selectedProject;
    return (
      <ProjectDashboard
        project={currentProj}
        onBack={() => setSelectedProject(null)}
      />
    );
  }

  return (
    <div className="projects-page-wrapper">
      {/* ── Page Header ── */}
      <section className="projects-header">
        <div className="projects-title-area">
          <h2>Project Board</h2>
          <p>Manage and track project statuses and teams inside the company.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Button
            variant="outline"
            icon={FiMenu}
            onClick={() => setIsActiveWorkersOpen(true)}
          >
            Active Workers
          </Button>
          <Button
            variant="primary"
            icon={FiPlus}
            onClick={handleOpenAdd}
          >
            Create Project
          </Button>
        </div>
      </section>

      {/* ── Toolbar Search ── */}
      <section className="projects-toolbar">
        <div className="search-input-wrapper">
          <FiSearch className="search-icon-projects" />
          <input
            type="text"
            placeholder="Search projects by name, description, or team members..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </section>

      {/* ── Projects Grid Layout (Full Width) ── */}
      <div className="projects-layout-grid">
        <section className="projects-grid">
          {filteredProjects.length === 0 ? (
            <div className="card" style={{ gridColumn: '1 / -1', padding: '40px', textAlign: 'center' }}>
              <p className="no-members-hint" style={{ fontSize: '1rem' }}>
                No projects found. Use the "Create Project" button to get started.
              </p>
            </div>
          ) : (
            filteredProjects.map((project) => (
              <div
                key={project.id}
                className={`card project-card ${project.status === 'Active' ? 'active-proj' : 'inactive-proj'}`}
                onClick={() => setSelectedProject(project)}
                style={{ cursor: 'pointer' }}
              >
                <div className="project-card-header">
                  <h3 className="project-card-title">{project.name}</h3>
                  <span className={`project-status-badge ${project.status === 'Active' ? 'status-active' : 'status-inactive'}`}>
                    {project.status === 'Active' ? 'Active Progress' : 'Inactive'}
                  </span>
                </div>

                <p className="project-desc">
                  {project.description || 'No project description added yet.'}
                </p>

                <div className="project-team-section">
                  <h4 className="team-heading">
                    Team Members ({project.memberIds?.length || 0})
                  </h4>
                  {project.memberIds && project.memberIds.length > 0 ? (
                    <div className="project-team-list">
                      {project.memberIds.map((id) => {
                        const empName = getEmployeeName(id);
                        return (
                          <div key={id} className="member-avatar-badge" title={`${empName} (${getEmployeeDept(id)})`}>
                            <div className="member-avatar-circle">
                              {getInitials(empName)}
                            </div>
                            <span>{empName}</span>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="no-members-hint">No members assigned to this project.</p>
                  )}
                </div>

                <div className="project-actions" onClick={(e) => e.stopPropagation()}>
                  <Button
                    variant="outline"
                    size="sm"
                    icon={FiEdit2}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenEdit(project);
                    }}
                    style={{ flex: 1 }}
                  >
                    Edit Details & Team
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    icon={FiTrash2}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(project.id);
                    }}
                    style={{ color: 'var(--color-danger)', borderColor: 'rgba(239,68,68,0.2)' }}
                  />
                </div>
              </div>
            ))
          )}
        </section>
      </div>

      {/* ── Active Workers slide-out toggle drawer ── */}
      {isActiveWorkersOpen && (
        <>
          <div className="active-workers-overlay" onClick={() => setIsActiveWorkersOpen(false)} />
          <div className="active-workers-drawer">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-title)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FiUsers style={{ color: 'var(--primary-color)' }} /> Active Workers Today
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-light)', margin: 0 }}>
                  Staff members available today for dispatch.
                </p>
              </div>
              <button 
                onClick={() => setIsActiveWorkersOpen(false)} 
                style={{ fontSize: '1.25rem', color: 'var(--text-light)', cursor: 'pointer', padding: '4px', background: 'transparent', border: 'none' }}
                aria-label="Close Active Workers list"
              >
                <FiX />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1, overflowY: 'auto', paddingRight: '4px' }}>
              {activeWorkers.length === 0 ? (
                <p className="no-members-hint">No active workers registered today.</p>
              ) : (
                activeWorkers.map((emp) => {
                  const currentProjectsCount = projects.filter(p => p.memberIds?.includes(emp.id)).length;
                  return (
                    <div key={emp.id} className="active-worker-item">
                      <div className="active-worker-header">
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span className="active-worker-name">{emp.name}</span>
                          <span className="active-worker-dept">{emp.designation} · {emp.department}</span>
                        </div>
                        <span className="active-worker-badge">Online</span>
                      </div>

                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        Assigned to <strong style={{ color: 'var(--text-title)' }}>{currentProjectsCount}</strong> project{currentProjectsCount !== 1 ? 's' : ''}
                      </div>

                      {/* Quick Assignment Widget */}
                      <div className="assign-worker-widget">
                        <select
                          value={workerAssignSelects[emp.id] || ''}
                          onChange={(e) => handleWorkerAssignChange(emp.id, e.target.value)}
                          className="assign-worker-select"
                        >
                          <option value="">-- Assign to project --</option>
                          {projects.map(p => (
                            <option key={p.id} value={p.id} disabled={p.memberIds?.includes(emp.id) || currentProjectsCount >= 2}>
                              {p.name}
                            </option>
                          ))}
                        </select>
                        <Button
                          variant="primary"
                          onClick={() => handleTriggerWorkerAssign(emp.id)}
                          disabled={!workerAssignSelects[emp.id]}
                          className="assign-worker-btn"
                        >
                          Confirm Assignment
                        </Button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </>
      )}

      {/* ── Slide-Out Form Drawer ── */}
      {isDrawerOpen && (
        <>
          <div className="project-drawer-overlay" onClick={handleCloseDrawer} />
          <div className="project-drawer">
            <div className="drawer-header">
              <h3>{editingProject ? 'Edit Project Details' : 'Create New Project'}</h3>
              <button className="drawer-close-btn" onClick={handleCloseDrawer} aria-label="Close drawer">
                <FiX />
              </button>
            </div>

            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', flex: 1, height: '100%' }}>
              <div className="drawer-content">
                <div className="form-group-projects">
                  <label>Project Name</label>
                  <input
                    type="text"
                    placeholder="Enter project name..."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group-projects">
                  <label>Description</label>
                  <textarea
                    placeholder="Enter project details and scope..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                  />
                </div>

                <div className="form-group-projects">
                  <label>Progress Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <option value="Active">Active Progress</option>
                    <option value="Inactive">Inactive / On Hold</option>
                  </select>
                </div>

                <div className="form-group-projects">
                  <label>Project Deadline</label>
                  <input
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                  />
                </div>

                {/* Team Members List Editor */}
                <div className="form-group-projects" style={{ marginTop: '28px' }}>
                  <label>Project Members</label>
                  <div className="members-manager-box">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '200px', overflowY: 'auto', marginBottom: '16px' }}>
                      {memberIds.length === 0 ? (
                        <p className="no-members-hint" style={{ padding: '8px 0' }}>
                          No team members assigned yet. Use the selector below to add members.
                        </p>
                      ) : (
                        memberIds.map((id) => (
                          <div key={id} className="current-member-row">
                            <div className="current-member-info">
                              <span className="current-member-name">{getEmployeeName(id)}</span>
                              <span className="current-member-dept">{getEmployeeDept(id)}</span>
                            </div>
                            <button
                              type="button"
                              className="remove-member-btn"
                              onClick={() => handleRemoveMember(id)}
                            >
                              Remove
                            </button>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Add Member Row */}
                    <div className="add-member-widget">
                      <select
                        value={selectedEmployeeId}
                        onChange={(e) => setSelectedEmployeeId(e.target.value)}
                      >
                        <option value="">-- Choose active employee --</option>
                        {availableEmployeesToAdd.map((emp) => (
                          <option key={emp.id} value={emp.id}>
                            {emp.name} ({emp.department})
                          </option>
                        ))}
                      </select>
                      <Button
                        variant="primary"
                        onClick={handleAddMember}
                        disabled={!selectedEmployeeId}
                        style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                      >
                        Add
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="drawer-footer">
                <Button type="submit" variant="primary" style={{ flex: 1 }}>
                  {editingProject ? 'Save Changes' : 'Create Project'}
                </Button>
                <Button variant="outline" onClick={handleCloseDrawer} style={{ flex: 1 }}>
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
};

export default Projects;

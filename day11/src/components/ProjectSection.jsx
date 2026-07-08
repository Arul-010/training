import React, { useState, useEffect } from "react";
import { getProjects, addProject, updateProject, deleteProject } from "../services/projectService";

export default function ProjectSection({ employees }) {
  const [projects, setProjects] = useState([]);
  const [editingProject, setEditingProject] = useState(null); // null or project object being edited
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Form State
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Active");
  const [memberIds, setMemberIds] = useState([]);
  const [selectedNewMemberId, setSelectedNewMemberId] = useState("");

  const loadProjectsData = () => {
    setProjects(getProjects());
  };

  useEffect(() => {
    loadProjectsData();
  }, []);

  const handleStartAdd = () => {
    setName("");
    setDescription("");
    setStatus("Active");
    setMemberIds([]);
    setSelectedNewMemberId("");
    setIsAddingNew(true);
    setEditingProject(null);
  };

  const handleStartEdit = (proj) => {
    setEditingProject(proj);
    setName(proj.name);
    setDescription(proj.description);
    setStatus(proj.status);
    setMemberIds(proj.memberIds || []);
    setSelectedNewMemberId("");
    setIsAddingNew(false);
  };

  const handleCancel = () => {
    setIsAddingNew(false);
    setEditingProject(null);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("Project Name is required.");
      return;
    }

    const payload = {
      name: name.trim(),
      description: description.trim(),
      status,
      memberIds
    };

    if (editingProject) {
      updateProject(editingProject.id, payload);
    } else {
      addProject(payload);
    }

    loadProjectsData();
    setIsAddingNew(false);
    setEditingProject(null);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      deleteProject(id);
      loadProjectsData();
      if (editingProject && editingProject.id === id) {
        setIsAddingNew(false);
        setEditingProject(null);
      }
    }
  };

  const handleAddMember = () => {
    if (!selectedNewMemberId) return;
    if (!memberIds.includes(selectedNewMemberId)) {
      setMemberIds([...memberIds, selectedNewMemberId]);
    }
    setSelectedNewMemberId("");
  };

  const handleRemoveMember = (idToRemove) => {
    setMemberIds(memberIds.filter(id => id !== idToRemove));
  };

  // Helper: Find employee by id
  const getEmployeeName = (id) => {
    const emp = employees.find(e => e.id === id);
    return emp ? emp.name : `Unknown (ID: ${id})`;
  };

  const getEmployeeDept = (id) => {
    const emp = employees.find(e => e.id === id);
    return emp ? emp.department : "";
  };

  // Filter projects by search
  const filteredProjects = projects.filter(p => {
    const q = searchQuery.toLowerCase();
    const hasNameMatch = p.name.toLowerCase().includes(q);
    const hasDescMatch = p.description.toLowerCase().includes(q);
    const hasMemberMatch = p.memberIds?.some(id => getEmployeeName(id).toLowerCase().includes(q));
    return hasNameMatch || hasDescMatch || hasMemberMatch;
  });

  // Filter employees that are not yet members to display in "Add Member" dropdown
  const availableEmployeesToAdd = employees.filter(emp => !memberIds.includes(emp.id));

  return (
    <div className="project-section-wrapper" style={{ display: "grid", gridTemplateColumns: "1fr", gap: "2rem" }}>
      
      {/* Search and Action Bar */}
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ flex: 1, minWidth: "260px" }}>
          <input
            type="text"
            placeholder="Search projects by name, description or members..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
        <button className="btn-submit" style={{ flex: "none", padding: "0.85rem 2rem" }} onClick={handleStartAdd}>
          + Create New Project
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "2rem" }} className="project-grid-main">
        {/* Left/Main Column: Project List */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {filteredProjects.length === 0 ? (
            <div className="empty-state">
              <p>No projects found matching the query or list is empty.</p>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "1.5rem" }}>
              {filteredProjects.map((project) => (
                <div 
                  key={project.id} 
                  className="list-card" 
                  style={{ 
                    display: "flex", 
                    flexDirection: "column", 
                    gap: "1rem", 
                    borderLeft: `4px solid ${project.status === "Active" ? "var(--accent-success)" : "var(--text-muted)"}`,
                    position: "relative"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.5rem" }}>
                    <h3 style={{ color: "#ffffff", fontSize: "1.2rem", fontWeight: "600", margin: 0 }}>
                      {project.name}
                    </h3>
                    <span 
                      style={{ 
                        background: project.status === "Active" ? "rgba(16, 185, 129, 0.12)" : "rgba(255, 255, 255, 0.05)",
                        color: project.status === "Active" ? "var(--accent-success)" : "var(--text-muted)",
                        border: `1px solid ${project.status === "Active" ? "rgba(16, 185, 129, 0.25)" : "var(--panel-border)"}`,
                        padding: "0.2rem 0.6rem",
                        borderRadius: "9999px",
                        fontSize: "0.75rem",
                        fontWeight: "600"
                      }}
                    >
                      {project.status}
                    </span>
                  </div>

                  <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", lineHeight: "1.4", margin: 0 }}>
                    {project.description || "No description provided."}
                  </p>

                  <div style={{ marginTop: "auto", borderTop: "1px solid var(--panel-border)", paddingTop: "1rem" }}>
                    <h4 style={{ fontSize: "0.75rem", fontWeight: "600", textTransform: "uppercase", color: "var(--text-muted)", letterSpacing: "0.05em", marginBottom: "0.5rem" }}>
                      Team Members ({project.memberIds?.length || 0})
                    </h4>
                    
                    {project.memberIds && project.memberIds.length > 0 ? (
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                        {project.memberIds.map(id => (
                          <span 
                            key={id} 
                            style={{ 
                              background: "rgba(255, 255, 255, 0.04)", 
                              border: "1px solid var(--panel-border)", 
                              padding: "0.25rem 0.6rem", 
                              borderRadius: "6px",
                              fontSize: "0.8rem",
                              color: "var(--text-main)"
                            }}
                            title={`${getEmployeeName(id)} (${getEmployeeDept(id)})`}
                          >
                            {getEmployeeName(id)}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontStyle: "italic" }}>
                        No members assigned yet.
                      </span>
                    )}
                  </div>

                  <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.5rem" }}>
                    <button 
                      className="btn-edit" 
                      style={{ flex: 1, padding: "0.5rem" }} 
                      onClick={() => handleStartEdit(project)}
                    >
                      Edit Details & Members
                    </button>
                    <button 
                      className="btn-delete" 
                      style={{ flex: "none", width: "42px", height: "36px", padding: 0 }} 
                      onClick={() => handleDelete(project.id)}
                      title="Delete Project"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right/Side Overlay panel for Add/Edit Form */}
        {(isAddingNew || editingProject) && (
          <div 
            className="form-card" 
            style={{ 
              position: "fixed",
              top: 0,
              right: 0,
              bottom: 0,
              width: "100%",
              maxWidth: "520px",
              zIndex: 100,
              borderRadius: "0",
              borderLeft: "1px solid var(--panel-border)",
              boxShadow: "-10px 0 40px rgba(0, 0, 0, 0.8)",
              overflowY: "auto",
              padding: "2.5rem"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
              <h2 className="form-title" style={{ margin: 0 }}>
                {editingProject ? "Edit Project" : "Create Project"}
              </h2>
              <button 
                onClick={handleCancel} 
                style={{ 
                  background: "transparent", 
                  color: "var(--text-muted)", 
                  border: "none", 
                  fontSize: "1.5rem", 
                  cursor: "pointer" 
                }}
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSave} className="employee-form" style={{ gap: "1.5rem" }}>
              <div className="form-group">
                <label className="form-label">Project Name</label>
                <input
                  type="text"
                  placeholder="e.g. Venus Mobile Client"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  placeholder="Provide a brief summary of scope and goals..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="form-input"
                  style={{ minHeight: "100px", resize: "vertical" }}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Progress Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="form-input"
                  style={{ background: "#111827", cursor: "pointer" }}
                >
                  <option value="Active">Active Progress</option>
                  <option value="Inactive">Inactive / On Hold</option>
                </select>
              </div>

              {/* Members Manager widget */}
              <div className="form-group" style={{ borderTop: "1px solid var(--panel-border)", paddingTop: "1.5rem" }}>
                <label className="form-label" style={{ marginBottom: "0.2rem" }}>Project Team Members</label>
                <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "1rem" }}>
                  Add and remove employees working on this project.
                </p>

                {/* List of current members to edit */}
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "1.25rem" }}>
                  {memberIds.length === 0 ? (
                    <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontStyle: "italic" }}>
                      No members assigned yet. Use the selector below to add members.
                    </span>
                  ) : (
                    memberIds.map(id => (
                      <div 
                        key={id} 
                        style={{ 
                          display: "flex", 
                          justifyContent: "space-between", 
                          alignItems: "center",
                          background: "rgba(255, 255, 255, 0.02)",
                          border: "1px solid var(--panel-border)",
                          padding: "0.5rem 0.85rem",
                          borderRadius: "8px"
                        }}
                      >
                        <div style={{ display: "flex", flexDirection: "column" }}>
                          <span style={{ fontSize: "0.9rem", fontWeight: "600", color: "#ffffff" }}>
                            {getEmployeeName(id)}
                          </span>
                          <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                            {getEmployeeDept(id)}
                          </span>
                        </div>
                        <button 
                          type="button" 
                          onClick={() => handleRemoveMember(id)}
                          className="btn-delete"
                          style={{ padding: "0.3rem 0.6rem", fontSize: "0.75rem" }}
                        >
                          Remove
                        </button>
                      </div>
                    ))
                  )}
                </div>

                {/* Add new member dropdown */}
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <select
                    value={selectedNewMemberId}
                    onChange={(e) => setSelectedNewMemberId(e.target.value)}
                    className="form-input"
                    style={{ background: "#111827", flex: 1, cursor: "pointer" }}
                  >
                    <option value="">-- Choose employee to add --</option>
                    {availableEmployeesToAdd.map(emp => (
                      <option key={emp.id} value={emp.id}>
                        {emp.name} ({emp.department})
                      </option>
                    ))}
                  </select>
                  <button 
                    type="button" 
                    onClick={handleAddMember}
                    className="btn-submit"
                    style={{ flex: "none", padding: "0 1.25rem", borderRadius: "8px" }}
                    disabled={!selectedNewMemberId}
                  >
                    Add
                  </button>
                </div>
              </div>

              <div className="form-actions" style={{ marginTop: "2rem" }}>
                <button type="submit" className="btn-submit">
                  {editingProject ? "Update Project" : "Create Project"}
                </button>
                <button type="button" onClick={handleCancel} className="btn-cancel">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

    </div>
  );
}

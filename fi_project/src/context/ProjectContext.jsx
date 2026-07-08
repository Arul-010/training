import React, { createContext, useContext, useState, useEffect } from 'react';
import { useEmployees } from './EmployeeContext';

const ProjectContext = createContext();

export const useProjects = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProjects must be used within a ProjectProvider');
  }
  return context;
};

const INITIAL_PROJECTS = [
  {
    id: 'p1',
    name: 'Smart Employee Management System',
    description: 'Core dashboard panel to register personnel, track team sizes, and log department stats.',
    status: 'Active',
    memberIds: []
  },
  {
    id: 'p2',
    name: 'AI Employee Manager',
    description: 'Artificial intelligence modeling for automating staff performance reviews and metrics.',
    status: 'Active',
    memberIds: []
  },
  {
    id: 'p3',
    name: 'NextGen HR Portal',
    description: 'Upgrading the human resource framework with modern query ticketing and feedback channels.',
    status: 'Inactive',
    memberIds: []
  },
  {
    id: 'p4',
    name: 'Employee360',
    description: 'Holistic performance rating system compiling feedback from peers, leads, and clients.',
    status: 'Active',
    memberIds: []
  },
  {
    id: 'p5',
    name: 'StaffPilot',
    description: 'Mobile-first shifts coordinator and leave allocation module for corporate branches.',
    status: 'Inactive',
    memberIds: []
  }
];

export const ProjectProvider = ({ children }) => {
  const { employees, triggerToast } = useEmployees();

  // Load from localStorage or use fallback mockup projects
  const [projects, setProjects] = useState(() => {
    const saved = localStorage.getItem('ems_projects');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Force reset if storage contains old default projects
        const hasOld = parsed.some(p => p.name === 'Nebula Billing Platform' || p.name === 'Quantum Analytics Pipeline');
        if (!hasOld) {
          return parsed;
        }
      } catch (e) {
        console.error('Failed to parse projects from localStorage', e);
      }
    }
    // Set default project memberIds dynamically based on actual employee IDs if available
    const defaultProjects = INITIAL_PROJECTS.map(p => ({ ...p }));
    if (employees.length >= 5) {
      defaultProjects[0].memberIds = [
        employees[0].id,
        employees[1].id,
        employees[2].id,
        employees[3].id,
        employees[4].id
      ];
      defaultProjects[1].memberIds = [employees[2].id];
      defaultProjects[2].memberIds = [employees[3].id];
      defaultProjects[3].memberIds = [employees[1].id, employees[4].id];
      defaultProjects[4].memberIds = [employees[2].id, employees[3].id];
    } else if (employees.length > 0) {
      defaultProjects[0].memberIds = employees.map(e => e.id);
    }
    return defaultProjects;
  });

  // Save projects to local storage
  useEffect(() => {
    localStorage.setItem('ems_projects', JSON.stringify(projects));
  }, [projects]);

  const addProject = (project) => {
    const newProj = {
      ...project,
      id: 'proj-' + Date.now() + Math.random().toString(36).substr(2, 5)
    };
    setProjects(prev => [newProj, ...prev]);
    triggerToast(`Project "${project.name}" created successfully!`, 'success');
  };

  const updateProject = (id, updatedProject) => {
    setProjects(prev =>
      prev.map(p => p.id === id ? { ...p, ...updatedProject } : p)
    );
    triggerToast(`Project "${updatedProject.name}" updated successfully!`, 'success');
  };

  const deleteProject = (id) => {
    const projectToDelete = projects.find(p => p.id === id);
    const name = projectToDelete ? projectToDelete.name : 'Project';
    setProjects(prev => prev.filter(p => p.id !== id));
    triggerToast(`Project "${name}" has been deleted.`, 'warning');
  };

  const assignMemberToProject = (projectId, employeeId) => {
    setProjects(prev =>
      prev.map(p => {
        if (p.id === projectId) {
          const members = p.memberIds || [];
          if (!members.includes(employeeId)) {
            const nextMembers = [...members, employeeId];
            triggerToast(`Assigned employee to ${p.name}!`, 'success');
            return { ...p, memberIds: nextMembers };
          }
        }
        return p;
      })
    );
  };

  return (
    <ProjectContext.Provider
      value={{
        projects,
        addProject,
        updateProject,
        deleteProject,
        assignMemberToProject
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

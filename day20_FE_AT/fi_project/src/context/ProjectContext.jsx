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

const getHash = (str) => {
  let hash = 0;
  if (!str) return hash;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
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

  const [hasSynced, setHasSynced] = useState(false);

  // Synchronize projects with loaded employees list:
  // 1. Remove/replace any stale/invalid IDs (fixes the "Unknown" issue)
  // 2. Ensure each project has between 6 and 8 members assigned
  useEffect(() => {
    if (employees.length === 0 || hasSynced) return;

    const activeEmployees = employees.filter(e => e.status === 'Active');
    if (activeEmployees.length === 0) return;

    // Track the number of project assignments per employee
    const assignmentCounts = {};
    employees.forEach(e => {
      assignmentCounts[e.id] = 0;
    });

    // Helper to get available employees who are in < 2 projects
    const getAvailableEmployeesForProject = (projId, memberList) => {
      return activeEmployees
        .filter(emp => !memberList.includes(emp.id) && (assignmentCounts[emp.id] || 0) < 2)
        .sort((a, b) => (assignmentCounts[a.id] || 0) - (assignmentCounts[b.id] || 0));
    };

    const newProjects = projects.map(proj => {
      // Filter out stale IDs that don't match any employee
      let validMemberIds = (proj.memberIds || []).filter(id => 
        employees.some(e => e.id === id)
      );

      // Target 6 to 8 members per project under the 2-project-per-employee limit
      const targetCount = 6 + (getHash(proj.id) % 3); // 6, 7, or 8 members

      const selectedIds = [];
      validMemberIds.forEach(id => {
        if ((assignmentCounts[id] || 0) < 2 && selectedIds.length < targetCount) {
          selectedIds.push(id);
          assignmentCounts[id] = (assignmentCounts[id] || 0) + 1;
        }
      });

      // Fill up to targetCount from the available active employees
      while (selectedIds.length < targetCount) {
        const available = getAvailableEmployeesForProject(proj.id, selectedIds);
        if (available.length === 0) break;
        
        const nextEmp = available[0];
        selectedIds.push(nextEmp.id);
        assignmentCounts[nextEmp.id] = (assignmentCounts[nextEmp.id] || 0) + 1;
      }

      // If still need more, fallback to other non-active employees under the 2 limit
      while (selectedIds.length < targetCount) {
        const availableAny = employees.filter(emp => 
          !selectedIds.includes(emp.id) && (assignmentCounts[emp.id] || 0) < 2
        ).sort((a, b) => (assignmentCounts[a.id] || 0) - (assignmentCounts[b.id] || 0));
        
        if (availableAny.length === 0) break;
        const nextEmp = availableAny[0];
        selectedIds.push(nextEmp.id);
        assignmentCounts[nextEmp.id] = (assignmentCounts[nextEmp.id] || 0) + 1;
      }

      validMemberIds = selectedIds;

      // Seed tasks if empty
      let tasks = proj.tasks || [];
      if (tasks.length === 0) {
        const taskTitles = [
          'Design UX Mockup layout',
          'Configure server infrastructure and deploy clusters',
          'Write comprehensive API integrations and endpoints',
          'Conduct QA and end-to-end integration testing',
          'Create user manuals and documentation guides',
          'Optimize query indices and database parameters',
          'Add social profiles and SEO tags to marketing portal'
        ];
        
        // Randomly choose 4 to 5 task titles
        const projHash = getHash(proj.id);
        const taskCount = 4 + (projHash % 2); // 4 or 5 tasks
        
        for (let i = 0; i < taskCount; i++) {
          const titleIndex = (projHash + i) % taskTitles.length;
          const assigneeId = validMemberIds[i % validMemberIds.length] || null;
          
          const deadlineDate = new Date();
          deadlineDate.setDate(deadlineDate.getDate() + 3 + i * 2);
          const deadlineStr = deadlineDate.toISOString().split('T')[0];
          
          tasks.push({
            id: `task-${proj.id}-${i}-${Date.now().toString().slice(-4)}`,
            title: taskTitles[titleIndex],
            deadline: deadlineStr,
            assigneeId: assigneeId,
            progress: (projHash * (i + 1) * 7) % 75 // 0% to 74%
          });
        }
      }

      // Seed chat messages if empty
      let chatMessages = proj.chatMessages || [];
      if (chatMessages.length === 0) {
        const greetings = [
          'Hi team! Excited to get started on this project. Let me know if you need anything.',
          'Hey everyone! I will handle the deployment and infrastructure configuration. Looking forward to our collaboration!',
          'Hello team, I\'m working on the design mockups. I\'ll share the Figma link shortly for feedback.',
          'Good morning! I have updated my task progress. Let\'s sync up in our weekly meeting.'
        ];
        
        const chatHash = getHash(proj.id);
        const chatCount = 2 + (chatHash % 2); // 2 or 3 messages
        
        for (let i = 0; i < chatCount; i++) {
          const senderId = validMemberIds[(i + 1) % validMemberIds.length];
          if (senderId) {
            const sender = employees.find(e => e.id === senderId);
            const senderName = sender ? sender.name : 'Teammate';
            
            const chatDate = new Date();
            chatDate.setHours(chatDate.getHours() - (5 - i));
            const chatTimeStr = chatDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            
            chatMessages.push({
              id: `msg-${proj.id}-${i}-${Date.now().toString().slice(-4)}`,
              senderId: senderId,
              senderName: senderName,
              text: greetings[i % greetings.length],
              time: chatTimeStr,
              timestamp: chatDate.getTime()
            });
          }
        }
      }

      return {
        ...proj,
        memberIds: validMemberIds,
        tasks,
        chatMessages
      };
    });

    setProjects(newProjects);
    setHasSynced(true);
  }, [employees, hasSynced, projects]);

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
    const currentCount = projects.filter(p => p.memberIds?.includes(employeeId)).length;
    if (currentCount >= 2) {
      triggerToast('This employee is already assigned to the maximum limit of 2 projects.', 'error');
      return;
    }

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

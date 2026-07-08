// Project Service using LocalStorage for persistent data

const STORAGE_KEY = "company_projects";

const DEFAULT_PROJECTS = [
  {
    id: "p1",
    name: "Apollo Cloud Infrastructure",
    description: "Migrating the legacy server clusters to AWS and optimization of serverless architectures.",
    status: "Active", // "Active" | "Inactive"
    memberIds: ["1", "2"] // maps to employee IDs
  },
  {
    id: "p2",
    name: "Helios Admin Dashboard",
    description: "Developing a real-time admin metrics panel using React and WebSockets.",
    status: "Inactive",
    memberIds: ["3"]
  },
  {
    id: "p3",
    name: "Cybersecurity Audit 2026",
    description: "Performing complete vulnerability analysis and upgrading OAuth2 credentials.",
    status: "Active",
    memberIds: ["2", "4"]
  }
];

export const getProjects = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_PROJECTS));
    return DEFAULT_PROJECTS;
  }
  return JSON.parse(data);
};

export const saveProjects = (projects) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
};

export const addProject = (project) => {
  const projects = getProjects();
  const newProject = {
    ...project,
    id: "p_" + Date.now()
  };
  projects.push(newProject);
  saveProjects(projects);
  return newProject;
};

export const updateProject = (id, updatedProject) => {
  const projects = getProjects();
  const idx = projects.findIndex(p => p.id === id);
  if (idx !== -1) {
    projects[idx] = { ...projects[idx], ...updatedProject };
    saveProjects(projects);
    return projects[idx];
  }
  return null;
};

export const deleteProject = (id) => {
  const projects = getProjects();
  const filtered = projects.filter(p => p.id !== id);
  saveProjects(filtered);
};

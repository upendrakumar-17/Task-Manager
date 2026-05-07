import React, { useState, useEffect } from 'react';
import apiClient from '../../services/apiClient';
import '../../styles/Projects.css';
import '../../styles/Dashboard.css';
import { toast } from 'react-toastify';
import Loading from '../../utilities/Loading';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showManageModal, setShowManageModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  
  // New Project Form
  const [newProject, setNewProject] = useState({ name: '', description: '' });
  
  // Member Management
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);
  
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'Medium',
    assignedTo: ''
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    setCurrentUser(user);
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await apiClient.get('/api/projects');
      setProjects(res.data);
    } catch (err) {
      console.error("Error fetching projects:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      await apiClient.post('/api/projects', newProject);
      setNewProject({ name: '', description: '' });
      setShowModal(false);
      fetchProjects();
      toast.success("Project created successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create project");
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      const taskData = {
        ...newTask,
        projectId: selectedProject._id,
        assignedTo: newTask.assignedTo || currentUser?._id
      };
      await apiClient.post('/api/tasks', taskData);
      setShowTaskModal(false);
      setNewTask({ title: '', description: '', dueDate: '', priority: 'Medium', assignedTo: '' });
      toast.success("Task created successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create task");
    }
  };

  const handleSearchUsers = async (query) => {
    setSearchQuery(query);
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }
    try {
      const res = await apiClient.get(`/api/users/search?query=${query}`);
      setSearchResults(res.data);
    } catch (err) {
      console.error("Error searching users:", err);
    }
  };

  const addMember = async (userId) => {
    try {
      await apiClient.put(`/api/projects/${selectedProject._id}/add-member`, { userId });
      setSearchQuery('');
      setSearchResults([]);
      // Refresh selected project members
      const res = await apiClient.get(`/api/projects/${selectedProject._id}`);
      setSelectedProject(res.data);
      fetchProjects();
      toast.success("Member added successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add member");
    }
  };

  const removeMember = async (userId) => {
    try {
      await apiClient.put(`/api/projects/${selectedProject._id}/remove-member`, { userId });
      // Refresh selected project members
      const res = await apiClient.get(`/api/projects/${selectedProject._id}`);
      setSelectedProject(res.data);
      fetchProjects();
      toast.info("Member removed");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to remove member");
    }
  };

  const handleDeleteProject = (projectId) => {
    setProjectToDelete(projectId);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!projectToDelete) return;
    try {
      await apiClient.delete(`/api/projects/${projectToDelete}`);
      fetchProjects();
      toast.success("Project deleted");
      setShowDeleteConfirm(false);
      setProjectToDelete(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete project");
    }
  };

  if (loading) {
    return <Loading message="Syncing projects..." />;
  }

  return (
    <div className="projects-page">
      <header className="page-header">
        <div className="header-content">
          <h1>Projects</h1>
          <p>Create and manage your workspace projects.</p>
        </div>
        <button className="create-project-btn" onClick={() => setShowModal(true)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          New Project
        </button>
      </header>

      <div className="projects-sections">
        {/* Admin Projects Section */}
        <section className="projects-group">
          <h2 className="section-title">Projects You Manage</h2>
          <div className="project-list">
            {projects.filter(p => p.admin === currentUser?._id).map(project => (
              <div key={project._id} className="project-card admin-card">
                <div className="project-card-header">
                  <h3>{project.name}</h3>
                  <span className="admin-badge-top">Admin</span>
                </div>
                <p className="project-card-desc">{project.description || "No description provided."}</p>
                <div className="project-meta">
                  <div className="member-count">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                    </svg>
                    <span>{project.members?.length || 0} Members</span>
                  </div>
                  <div className="card-actions">
                    <button 
                      className="manage-btn secondary-action" 
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedProject(project);
                        setShowTaskModal(true);
                      }}
                    >
                      Add Task
                    </button>
                    <button 
                      className="manage-btn" 
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedProject(project);
                        setShowManageModal(true);
                      }}
                    >
                      Add Members
                    </button>
                    <button 
                      className="delete-card-btn" 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteProject(project._id);
                      }}
                      title="Delete Project"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {projects.filter(p => p.admin === currentUser?._id).length === 0 && (
              <div className="empty-state">
                <p>You aren't managing any projects yet. Create one to get started!</p>
              </div>
            )}
          </div>
        </section>

        {/* Member Projects Section */}
        <section className="projects-group">
          <h2 className="section-title">Projects You're In</h2>
          <div className="project-list">
            {projects.filter(p => p.admin !== currentUser?._id).map(project => (
              <div key={project._id} className="project-card">
                <div className="project-card-header">
                  <h3>{project.name}</h3>
                </div>
                <p className="project-card-desc">{project.description || "No description provided."}</p>
                <div className="project-meta">
                  <div className="member-count">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                    </svg>
                    <span>{project.members?.length || 0} Members</span>
                  </div>
                </div>
              </div>
            ))}
            {projects.filter(p => p.admin !== currentUser?._id).length === 0 && (
              <div className="empty-state">
                <p>You haven't been added to any other projects yet.</p>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Create Project Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Create Project</h2>
              <button className="close-modal" onClick={() => setShowModal(false)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <form className="modal-form" onSubmit={handleCreateProject}>
              <div className="form-group">
                <label>Project Name</label>
                <input 
                  type="text" 
                  value={newProject.name}
                  onChange={(e) => setNewProject({...newProject, name: e.target.value})}
                  placeholder="e.g. Website Redesign"
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea 
                  value={newProject.description}
                  onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                  placeholder="What is this project about?"
                  rows="3"
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Create Project</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Task Modal */}
      {showTaskModal && selectedProject && (
        <div className="modal-overlay">
          <div className="modal-content task-creation-modal">
            <div className="modal-header">
              <div className="modal-title-group">
                <h2>Create New Task</h2>
                <p className="modal-subtitle">Project: {selectedProject.name}</p>
              </div>
              <button className="close-modal" onClick={() => setShowTaskModal(false)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            
            <form className="modal-form" onSubmit={handleCreateTask}>
              <div className="form-group">
                <label>Task Title</label>
                <div className="input-with-icon">
                  <svg className="field-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                  <input 
                    type="text" 
                    value={newTask.title}
                    onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                    placeholder="e.g. Design System Implementation"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea 
                  value={newTask.description}
                  onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                  placeholder="Provide some context for this task..."
                  rows="3"
                />
              </div>

              <div className="form-row-two">
                <div className="form-group">
                  <label>Priority</label>
                  <div className="input-with-icon">
                    <svg className="field-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path>
                      <line x1="4" y1="22" x2="4" y2="15"></line>
                    </svg>
                    <select 
                      value={newTask.priority} 
                      onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
                    >
                      <option value="Low">Low Priority</option>
                      <option value="Medium">Medium Priority</option>
                      <option value="High">High Priority</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Due Date</label>
                  <div className="input-with-icon">
                    <svg className="field-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    <input 
                      type="date" 
                      value={newTask.dueDate}
                      onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label>Assign Team Member</label>
                <div className="input-with-icon">
                  <svg className="field-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  <select 
                    value={newTask.assignedTo} 
                    onChange={(e) => setNewTask({...newTask, assignedTo: e.target.value})}
                  >
                    <option value="">Assign to Myself</option>
                    {selectedProject.members.map(member => (
                      <option key={member._id} value={member._id}>
                        {member.name} ({member.email})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="modal-footer-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowTaskModal(false)}>Cancel</button>
                <button type="submit" className="btn-submit-task">Create Task</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Manage Members Modal */}
      {showManageModal && selectedProject && (
        <div className="modal-overlay">
          <div className="modal-content manage-modal">
            <div className="modal-header">
              <div className="modal-title-group">
                <h2>Manage Members</h2>
                <p className="modal-subtitle">{selectedProject.name}</p>
              </div>
              <button className="close-modal" onClick={() => setShowManageModal(false)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            
            <div className="members-management">
              <div className="user-search-container">
                <div className="form-group">
                  <label>Add New Member</label>
                  <div className="search-input-wrapper">
                    <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="11" cy="11" r="8"></circle>
                      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                    <input 
                      type="text" 
                      placeholder="Search by name or email..."
                      value={searchQuery}
                      onChange={(e) => handleSearchUsers(e.target.value)}
                    />
                  </div>
                </div>

                {searchResults.length > 0 && (
                  <div className="search-results">
                    {searchResults.map(user => (
                      <div key={user._id} className="search-item" onClick={() => addMember(user._id)}>
                        <div className="user-profile-sm">
                          <div className="avatar-sm">
                            {user?.name?.charAt(0).toUpperCase() || '?'}
                          </div>
                          <div className="user-info">
                            <span className="user-name">{user.name}</span>
                            <span className="user-email">{user.email}</span>
                          </div>
                        </div>
                        <button className="add-btn-sm">Add</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="current-members-section">
                <h3>Current Members ({selectedProject.members.length})</h3>
                <div className="current-members-list">
                  {selectedProject.members.map(member => (
                    <div key={member._id} className="member-row">
                      <div className="user-profile-md">
                        <div className="avatar-md">
                          {member?.name?.charAt(0).toUpperCase() || '?'}
                        </div>
                        <div className="user-info">
                          <span className="user-name">
                            {member?._id === currentUser?._id ? "You" : (member?.name || "Unknown User")}
                          </span>
                          <span className="user-email">{member?.email || "No email"}</span>
                        </div>
                      </div>
                      
                      <div className="member-actions">
                        {member._id === String(selectedProject.admin) ? (
                          <span className="admin-pill">Admin</span>
                        ) : (
                          <button 
                            className="remove-btn-icon" 
                            onClick={() => removeMember(member._id)}
                            title="Remove Member"
                          >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M18 6L6 18M6 6l12 12"></path>
                            </svg>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Custom Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="modal-overlay">
          <div className="modal-content delete-confirm-modal">
            <div className="modal-header">
              <div className="modal-title-group">
                <h2 className="text-error">Delete Project?</h2>
                <p className="modal-subtitle">This action cannot be undone.</p>
              </div>
              <button className="close-modal" onClick={() => setShowDeleteConfirm(false)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <div className="modal-body-confirm">
              <p>Are you sure you want to delete <strong>{projects.find(p => p._id === projectToDelete)?.name}</strong>? All tasks associated with this project will be permanently removed.</p>
            </div>
            <div className="modal-footer-actions">
              <button className="btn-cancel" onClick={() => {
                setShowDeleteConfirm(false);
                setProjectToDelete(null);
              }}>Cancel</button>
              <button className="btn-delete-confirm" onClick={confirmDelete}>
                Delete Project
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;

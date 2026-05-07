import React, { useState, useEffect } from 'react';
import apiClient from '../../services/apiClient';
import '../../styles/Projects.css';
import '../../styles/Dashboard.css';

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
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create project");
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
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add member");
    }
  };

  const removeMember = async (userId) => {
    try {
      await apiClient.put(`/api/projects/${selectedProject._id}/remove-member`, { userId });
      // Refresh selected project members
      const res = await apiClient.get(`/api/projects/${selectedProject._id}`);
      setSelectedProject(res.data);
      fetchProjects();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to remove member");
    }
  };

  if (loading) {
    return <div className="loading-container">Loading projects...</div>;
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

      <div className="project-list">
        {projects.map(project => {
          const isAdmin = project.admin === currentUser?._id;
          return (
            <div key={project._id} className="project-card">
              <div className="project-card-header">
                <h3>{project.name}</h3>
                {isAdmin && (
                  <button 
                    className="manage-btn" 
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedProject(project);
                      setShowManageModal(true);
                    }}
                  >
                    Manage
                  </button>
                )}
              </div>
              <p>{project.description || "No description provided."}</p>
              <div className="project-meta">
                <span>{project.members?.length || 0} Members</span>
                {isAdmin && <span className="admin-badge">Admin</span>}
              </div>
            </div>
          );
        })}
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

      {/* Manage Members Modal */}
      {showManageModal && selectedProject && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Manage Members</h2>
              <button className="close-modal" onClick={() => setShowManageModal(false)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            
            <div className="members-management">
              <div className="user-search-container">
                <label>Add Member (Search by email/name)</label>
                <input 
                  type="text" 
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => handleSearchUsers(e.target.value)}
                />
                {searchResults.length > 0 && (
                  <div className="search-results">
                    {searchResults.map(user => (
                      <div key={user._id} className="search-item" onClick={() => addMember(user._id)}>
                        <div className="user-info">
                          <span className="user-name">{user.name}</span>
                          <span className="user-email">{user.email}</span>
                        </div>
                        <button className="add-btn">Add</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="current-members-section">
                <h3>Current Members</h3>
                <div className="current-members">
                  {selectedProject.members.map(member => (
                    <div key={member._id} className="member-item">
                      <div className="member-info">
                        <span className="user-name">{member._id === currentUser?._id ? "You" : member.name}</span>
                        <span className="user-email">{member.email}</span>
                      </div>
                      {member._id === selectedProject.admin ? (
                        <span className="admin-badge">Admin</span>
                      ) : (
                        <button className="remove-member" onClick={() => removeMember(member._id)}>Remove</button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;

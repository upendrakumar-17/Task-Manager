import React, { useState, useEffect } from 'react';
import apiClient from '../../services/apiClient';
import '../../styles/Dashboard.css';

const DashboardHome = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await apiClient.get('/api/projects');
        setProjects(res.data);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <span>Loading dashboard data...</span>
      </div>
    );
  }

  return (
    <div className="dashboard-home">
      <header className="page-header">
        <h1>Dashboard Overview</h1>
        <p>Manage your team projects and track progress.</p>
      </header>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Active Projects</h3>
          <div className="stat-value">{projects.length}</div>
        </div>
        <div className="stat-card">
          <h3>Total Members</h3>
          <div className="stat-value">
            {projects.reduce((acc, curr) => acc + (curr.members?.length || 0), 0)}
          </div>
        </div>
      </div>

      <section className="recent-projects">
        <h2>Your Projects</h2>
        <div className="project-list">
          {projects.map(project => (
            <div key={project._id} className="project-card">
              <h3>{project.name}</h3>
              <p>{project.description || "No description provided."}</p>
              <div className="project-meta">
                <span>{project.members?.length || 0} Members</span>
                <span>{new Date(project.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
          {projects.length === 0 && (
            <div className="empty-state">
              <p>No projects found. Create one to get started!</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default DashboardHome;

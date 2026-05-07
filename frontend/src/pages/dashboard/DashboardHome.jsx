import React, { useState, useEffect } from 'react';
import apiClient from '../../services/apiClient';
import '../../styles/Dashboard.css';

const DashboardHome = () => {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [projectsRes, tasksRes] = await Promise.all([
          apiClient.get('/api/projects'),
          apiClient.get('/api/tasks/my-tasks')
        ]);
        setProjects(projectsRes.data);
        setTasks(tasksRes.data);
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
      </header>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Projects</h3>
          <div className="stat-value">{projects.length}</div>
        </div>
        <div className="stat-card">
          <h3>Assigned Tasks</h3>
          <div className="stat-value">{tasks.length}</div>
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

      <section className="recent-tasks">
        <h2>Recent Tasks</h2>
        <div className="task-list">
          {tasks.slice(0, 5).map(task => (
            <div key={task._id} className="task-item">
              <div className="task-info">
                <h3>{task.title}</h3>
                <span className="task-project">{task.project?.name}</span>
              </div>
              <div className={`task-status status-${task.status.toLowerCase().replace(' ', '-')}`}>
                {task.status}
              </div>
            </div>
          ))}
          {tasks.length === 0 && (
            <div className="empty-state">
              <p>No tasks assigned to you yet.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default DashboardHome;

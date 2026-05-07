import React, { useState, useEffect } from 'react';
import apiClient from '../../services/apiClient';
import '../../styles/Tasks.css';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    setCurrentUser(user);
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await apiClient.get('/api/tasks/my-tasks');
      setTasks(res.data);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      await apiClient.put(`/api/tasks/${taskId}`, { status: newStatus });
      fetchTasks();
    } catch (err) {
      alert("Failed to update status");
    }
  };

  const deleteTask = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      await apiClient.delete(`/api/tasks/${taskId}`);
      fetchTasks();
    } catch (err) {
      alert("Failed to delete task");
    }
  };

  const filteredTasks = filter === 'All' 
    ? tasks 
    : tasks.filter(t => t.status === filter);

  if (loading) return <div className="loading-container">Loading tasks...</div>;

  return (
    <div className="tasks-page">
      <header className="page-header">
        <div className="header-content">
          <h1>My Tasks</h1>
          <p>A simple list of everything assigned to you.</p>
        </div>
      </header>

      <div className="tasks-controls">
        <div className="filters">
          <select 
            className="filter-select" 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="Todo">Todo</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
        <div className="tasks-count">
          {filteredTasks.length} {filteredTasks.length === 1 ? 'task' : 'tasks'} found
        </div>
      </div>

      <div className="tasks-grid">
        {filteredTasks.map(task => {
          const isAdmin = task.project?.admin && String(task.project.admin) === String(currentUser?._id);
          
          return (
            <div key={task._id} className="task-card">
              <div className="task-card-header">
                <h3>{task.title}</h3>
                <span className={`priority-tag priority-${task.priority.toLowerCase()}`}>
                  {task.priority}
                </span>
              </div>
              <p className="task-desc">{task.description}</p>
              <div className="task-project-info">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                </svg>
                <span>{task.project?.name}</span>
              </div>
              
              <div className="task-card-footer">
                <div className="due-date">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                  <span>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No deadline'}</span>
                </div>
                
                <div className="task-actions">
                  <select 
                    className="status-select"
                    value={task.status}
                    onChange={(e) => updateTaskStatus(task._id, e.target.value)}
                  >
                    <option value="Todo">Todo</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                  
                  {isAdmin && (
                    <button className="delete-task-btn" onClick={() => deleteTask(task._id)} title="Delete Task">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredTasks.length === 0 && !loading && (
        <div className="empty-state">
          <p>No tasks found. You're all caught up!</p>
        </div>
      )}
    </div>
  );
};

export default Tasks;

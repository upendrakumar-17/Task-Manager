import React, { useState, useEffect } from 'react';
import apiClient from '../../services/apiClient';
import '../../styles/Tasks.css';
import '../../styles/Projects.css'; // Reusing modal styles
import '../../styles/Dashboard.css';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState('All');
  
  // New Task Form
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'Medium',
    projectId: '',
    assignedTo: ''
  });

  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    setCurrentUser(user);
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [tasksRes, projectsRes] = await Promise.all([
        apiClient.get('/api/tasks/all-tasks'),
        apiClient.get('/api/projects')
      ]);
      setTasks(tasksRes.data);
      setProjects(projectsRes.data);
    } catch (err) {
      console.error("Error fetching tasks data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      const taskData = {
        ...newTask,
        assignedTo: newTask.assignedTo || currentUser?._id
      };
      await apiClient.post('/api/tasks', taskData);
      setShowModal(false);
      setNewTask({ title: '', description: '', dueDate: '', priority: 'Medium', projectId: '', assignedTo: '' });
      fetchInitialData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create task");
    }
  };

  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      await apiClient.put(`/api/tasks/${taskId}`, { status: newStatus });
      fetchInitialData();
    } catch (err) {
      alert("Failed to update status");
    }
  };

  const deleteTask = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      await apiClient.delete(`/api/tasks/${taskId}`);
      fetchInitialData();
    } catch (err) {
      alert("Failed to delete task");
    }
  };

  const filteredTasks = filter === 'All' 
    ? tasks 
    : tasks.filter(t => t.status === filter);

  if (loading) return <div className="loading-container">Loading tasks...</div>;

  // Find projects where user is admin for the creation dropdown
  const adminProjects = projects.filter(p => p.admin === currentUser?._id);

  // Group tasks
  const managedTasks = filteredTasks.filter(t => t.project?.admin === currentUser?._id);
  const assignedTasks = filteredTasks.filter(t => t.project?.admin !== currentUser?._id && t.assignedTo?._id === currentUser?._id);

  return (
    <div className="tasks-page">
      <header className="page-header">
        <div className="header-content">
          <h1>Tasks</h1>
          <p>Keep track of your responsibilities and deadlines.</p>
        </div>
        <div className="header-actions">
          {adminProjects.length > 0 && (
            <button className="create-project-btn" onClick={() => setShowModal(true)}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              Create Task
            </button>
          )}
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
          Showing {filteredTasks.length} tasks
        </div>
      </div>

      <div className="tasks-sections">
        {/* Managed Tasks */}
        <section className="tasks-group">
          <h2 className="section-title">Tasks in Managed Projects</h2>
          <div className="tasks-grid">
            {managedTasks.map(task => (
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
                    
                    <button className="delete-task-btn" onClick={() => deleteTask(task._id)} title="Delete Task">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {managedTasks.length === 0 && <p className="empty-state">No tasks to manage.</p>}
          </div>
        </section>

        {/* Assigned Tasks */}
        <section className="tasks-group">
          <h2 className="section-title">Tasks Assigned to You</h2>
          <div className="tasks-grid">
            {assignedTasks.map(task => (
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
                  </div>
                </div>
              </div>
            ))}
            {assignedTasks.length === 0 && <p className="empty-state">No assigned tasks.</p>}
          </div>
        </section>
      </div>
        {filteredTasks.length === 0 && (
          <div className="empty-state" style={{ gridColumn: '1/-1' }}>
            <p>No tasks found for this filter.</p>
          </div>
        )}
      

      {/* Create Task Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Create New Task</h2>
              <button className="close-modal" onClick={() => setShowModal(false)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <form className="modal-form" onSubmit={handleCreateTask}>
              <div className="form-group">
                <label>Task Title</label>
                <input 
                  type="text" 
                  value={newTask.title}
                  onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                  placeholder="e.g. Design homepage"
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea 
                  value={newTask.description}
                  onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                  placeholder="Details about the task..."
                  rows="3"
                />
              </div>
              <div className="task-form-row">
                <div className="form-group">
                  <label>Project</label>
                  <select 
                    value={newTask.projectId} 
                    onChange={(e) => setNewTask({...newTask, projectId: e.target.value})}
                    required
                  >
                    <option value="">Select Project</option>
                    {adminProjects.map(p => (
                      <option key={p._id} value={p._id}>{p.name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Priority</label>
                  <select 
                    value={newTask.priority} 
                    onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>
              <div className="task-form-row">
                <div className="form-group">
                  <label>Due Date</label>
                  <input 
                    type="date" 
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Assign To</label>
                  <select 
                    value={newTask.assignedTo} 
                    onChange={(e) => setNewTask({...newTask, assignedTo: e.target.value})}
                  >
                    <option value="">Me (Default)</option>
                    {/* Get members of selected project */}
                    {projects.find(p => p._id === newTask.projectId)?.members.map(m => (
                      <option key={m._id} value={m._id}>{m.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Create Task</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;

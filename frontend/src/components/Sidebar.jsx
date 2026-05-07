import { NavLink, useNavigate } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <>
      <div 
        className={`sidebar-overlay ${isOpen ? 'visible' : 'hidden'}`} 
        onClick={onClose}
      ></div>
      <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-header">
        <span className="sidebar-category">Task Manager</span>
        <button className="close-sidebar" onClick={onClose} title="Close Menu">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      
      <nav className="sidebar-nav">
        <NavLink 
          to="/dashboard" 
          end
          className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
        >
          Dashboard
        </NavLink>
        <NavLink 
          to="/dashboard/tasks" 
          className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
        >
          My Tasks
        </NavLink>
        <NavLink 
          to="/dashboard/projects" 
          className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
        >
          Projects
        </NavLink>
        
        <div className="nav-divider"></div>
        <span className="sidebar-category">User</span>
        
        <NavLink 
          to="/dashboard/settings" 
          className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
        >
          Settings
        </NavLink>
      </nav>
      
      <div className="sidebar-footer">
        <button className="logout-btn" onClick={handleLogout}>
          Sign Out
        </button>
      </div>
    </aside>
    </>
  );
};

export default Sidebar;

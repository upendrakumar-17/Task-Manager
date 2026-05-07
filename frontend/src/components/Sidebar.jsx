import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = ({ isOpen, onClose }) => {
  return (
    <>
      <div 
        className={`sidebar-overlay ${isOpen ? 'visible' : 'hidden'}`} 
        onClick={onClose}
      ></div>
      <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-header">
        <span className="sidebar-category">Application</span>
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
          className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
        >
          Dashboard
        </NavLink>
        <NavLink 
          to="/tasks" 
          className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
        >
          My Tasks
        </NavLink>
        <NavLink 
          to="/projects" 
          className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
        >
          Projects
        </NavLink>
        
        <div className="nav-divider"></div>
        <span className="sidebar-category">User</span>
        
        <NavLink 
          to="/settings" 
          className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
        >
          Settings
        </NavLink>
      </nav>
      
      <div className="sidebar-footer">
        <button className="logout-btn">
          Sign Out
        </button>
      </div>
    </aside>
    </>
  );
};

export default Sidebar;

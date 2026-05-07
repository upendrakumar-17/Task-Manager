import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ isLoggedIn = false, onMenuClick }) => {
  return (
    <nav className="main-navbar">
      <div className="navbar-container">
        <div className="navbar-left">
          {isLoggedIn && (
            <button className="menu-toggle" title="Toggle Menu" onClick={onMenuClick}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>
          )}
          <Link to="/" className="navbar-logo">
            Task Manager
          </Link>
        </div>
        
        <div className="navbar-right">
          {isLoggedIn ? (
            <div className="nav-auth-links">
              <Link to="/dashboard" className="profile-trigger" title="Go to Dashboard">
                <div className="profile-avatar">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </div>
              </Link>
            </div>
          ) : (
            <div className="navbar-links">
              <Link to="/login" className="nav-link">Sign In</Link>
              <Link to="/register" className="nav-btn">Get Started</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

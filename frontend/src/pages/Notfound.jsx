import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Notfound.css';

const Notfound = () => {
  const navigate = useNavigate();

  return (
    <div className="notfound-container">
      <div className="notfound-code">404</div>
      <div className="notfound-content">
        <h1>Page Not Found</h1>
        <p>The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.</p>
        <div className="notfound-actions">
          <Link to="/" className="btn-home">Return Home</Link>
          <button onClick={() => navigate(-1)} className="btn-back">Go Back</button>
        </div>
      </div>
    </div>
  );
};

export default Notfound;
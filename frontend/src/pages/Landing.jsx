import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../styles/Landing.css";

const Landing = () => {
  const isLoggedIn = !!localStorage.getItem('token');

  return (
    <div className="landing">
      <Navbar isLoggedIn={isLoggedIn} />

      <main className="hero">
        <div className="hero-content">
          <h1>Manage Your Tasks Efficiently</h1>

          <p>
            Organize projects, track progress, and collaborate with your team
            in one simple and powerful workspace.
          </p>

          <div className="hero-buttons">
            <Link to="/register" className="primary-btn">
              Get Started
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </Link>
            <button className="secondary-btn">Learn More</button>
          </div>
        </div>
      </main>

      <section className="features" id="features">
        <h2>Features</h2>

        <div className="feature-cards">
          <div className="card">
            <h3>Task Boards</h3>
            <p>Create boards and organize tasks visually.</p>
          </div>

          <div className="card">
            <h3>Collaboration</h3>
            <p>Work together with your team in real time.</p>
          </div>

          <div className="card">
            <h3>Progress Tracking</h3>
            <p>Track task completion and project status easily.</p>
          </div>
        </div>
      </section>

      <footer className="footer">
        <p>© 2026 Task Manager. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Landing;
import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../styles/Landing.css";

const Landing = () => {
  return (
    <div className="landing">
      <Navbar isLoggedIn={false} />

      <main className="hero">
        <div className="hero-content">
          <h1>Manage Your Tasks Efficiently</h1>

          <p>
            Organize projects, track progress, and collaborate with your team
            in one simple and powerful workspace.
          </p>

          <div className="hero-buttons">
            <Link to="/register" className="primary-btn">Get Started</Link>
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
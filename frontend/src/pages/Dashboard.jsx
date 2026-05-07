import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="app-layout">
      <Navbar isLoggedIn={true} onMenuClick={() => setIsSidebarOpen(true)} />
      <div className="app-container">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        <main className="main-content">
          <header className="page-header">
            <h1>Dashboard</h1>
          </header>
          <div className="dashboard-grid">
            <p>Welcome back! Here's an overview of your tasks.</p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard
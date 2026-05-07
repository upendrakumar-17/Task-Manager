import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
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
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Dashboard
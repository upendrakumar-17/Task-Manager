import React from "react";
import "./Loading.css";

const Loading = ({ message = "Loading...", fullScreen = false }) => {
  return (
    <div className={`loading-overlay ${fullScreen ? 'loading-fullscreen' : ''}`}>
      <div className="spinner"></div>
      <span className="loading-text">{message}</span>
    </div>
  );
};

export default Loading;
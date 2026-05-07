import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "../styles/Register.css";
import apiClient from '../services/apiClient';
import { toast } from 'react-toastify';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      return "Please fill all fields";
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      toast.warn(validationError);
      return;
    }

    try {
      const response = await apiClient.post("/api/users/login", {
        email: formData.email,
        password: formData.password,
      });

      console.log(response.data);
      
      // Store user info and token in localStorage
      localStorage.setItem('user', JSON.stringify(response.data));
      localStorage.setItem('token', response.data.token);

      toast.success("Login successful");
      navigate('/dashboard');

    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Invalid credentials"
      );
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <header className="auth-header">
          <Link to="/" className="auth-logo">Task Manager</Link>
          <h1>Welcome Back</h1>
          <p>Please enter your details to sign in.</p>
        </header>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              placeholder="name@company.com" 
              value={formData.email}
              onChange={handleChange}
              required 
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input 
              type="password" 
              id="password" 
              name="password" 
              placeholder="••••••••" 
              value={formData.password}
              onChange={handleChange}
              required 
            />
          </div>

          <div className="auth-options">
            <label className="remember-me">
              <input type="checkbox" /> Remember me
            </label>
            <Link to="/forgot-password" title="Coming soon">Forgot password?</Link>
          </div>

          <button type="submit" className="auth-submit">
            Sign In
          </button>
        </form>

        <footer className="auth-footer">
          <p>
            Don't have an account? <Link to="/register">Sign Up</Link>
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Login;
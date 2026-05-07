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
          <button type="button" className="google-btn" onClick={() => window.location.href = 'http://localhost:8000/api/auth/google'}>
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c3.13 0 5.75-1.03 7.67-2.81l-3.57-2.77c-.99.66-2.23 1.06-4.1 1.06-3.15 0-5.81-2.13-6.76-5.01H1.67v2.88C3.61 20.12 7.51 23 12 23z" fill="#34A853"/>
              <path d="M5.24 13.47c-.24-.72-.38-1.49-.38-2.3s.14-1.58.38-2.3V5.99H1.67C.61 8.1 0 10.45 0 12.91s.61 4.81 1.67 6.92l3.57-2.88c-.95-2.88-.95-6.04 0-8.48z" fill="#FBBC05"/>
              <path d="M12 4.75c1.7 0 3.22.58 4.42 1.71l3.32-3.32C17.74 1.14 15.12 0 12 0 7.51 0 3.61 2.88 1.67 6.92l3.57 2.88C6.19 6.88 8.85 4.75 12 4.75z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          <div className="auth-divider">
            <span>or login with email</span>
          </div>

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

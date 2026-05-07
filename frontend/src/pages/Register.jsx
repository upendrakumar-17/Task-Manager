import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import "../styles/Register.css";
import apiClient from '../services/apiClient';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // validation function
  const validateForm = () => {
    if (!formData.email || !formData.password || !formData.confirmPassword) {
      return "Please fill all fields";
    }

    if (formData.password !== formData.confirmPassword) {
      return "Passwords do not match";
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // validate form
    const validationError = validateForm();

    if (validationError) {
      alert(validationError);
      return;
    }

    try {
      const response = await apiClient.post("/api/users/register", {
        email: formData.email,
        password: formData.password,
      });

      console.log(response.data);

      alert("Registration successful");

      // reset form
      setFormData({
        email: "",
        password: "",
        confirmPassword: "",
      });

    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message || "Something went wrong"
      );
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <header className="auth-header">
          <Link to="/" className="auth-logo">Task Manager</Link>
          <h1>Create an Account</h1>
          <p>Join us and start managing your tasks today.</p>
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

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="auth-submit">
            Sign Up
          </button>
        </form>

        <footer className="auth-footer">
          <p>
            Already have an account? <Link to="/login">Sign In</Link>
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Register;
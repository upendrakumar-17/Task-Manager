import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "../styles/Register.css";
import apiClient from '../services/apiClient';
import { toast } from 'react-toastify';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [loadingOtp, setLoadingOtp] = useState(false);

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

  const navigate = useNavigate();

  const handleSendOtp = async () => {
    if (!formData.email) {
      toast.warn("Please enter your email first");
      return;
    }
    setLoadingOtp(true);
    try {
      await apiClient.post("/api/otp/send", { email: formData.email });
      setIsOtpSent(true);
      toast.success("OTP sent to your email");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoadingOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      toast.warn("Please enter the OTP");
      return;
    }
    setLoadingOtp(true);
    try {
      await apiClient.post("/api/otp/verify", { email: formData.email, otp });
      setIsVerified(true);
      toast.success("Email verified successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid OTP");
    } finally {
      setLoadingOtp(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // validate form
    const validationError = validateForm();

    if (validationError) {
      toast.warn(validationError);
      return;
    }

    if (!isVerified) {
      toast.warn("Please verify your email first");
      return;
    }

    try {
      const response = await apiClient.post("/api/users/register", {
        email: formData.email,
        password: formData.password,
      });

      console.log(response.data);

      // Store user info and token in localStorage for immediate access
      localStorage.setItem('user', JSON.stringify(response.data));
      localStorage.setItem('token', response.data.token);

      toast.success("Registration successful");
      navigate('/dashboard');

    } catch (error) {
      console.error(error);

      toast.error(
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
          <div className="form-group otp-group">
            <label htmlFor="email">Email Address</label>
            <div className="input-with-action">
              <input
                type="email"
                id="email"
                name="email"
                placeholder="name@company.com"
                value={formData.email}
                onChange={handleChange}
                disabled={isOtpSent}
                required
              />
              {!isVerified && (
                <button 
                  type="button" 
                  className="otp-btn" 
                  onClick={handleSendOtp}
                  disabled={loadingOtp || isOtpSent}
                >
                  {loadingOtp ? "..." : isOtpSent ? "Sent" : "Send OTP"}
                </button>
              )}
            </div>
            {isVerified && <span className="verified-badge">✓ Verified</span>}
          </div>

          {isOtpSent && !isVerified && (
            <div className="form-group otp-verify-group animate-slide-down">
              <label htmlFor="otp">Enter Verification Code</label>
              <div className="input-with-action">
                <input
                  type="text"
                  id="otp"
                  placeholder="6-digit code"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength="6"
                />
                <button 
                  type="button" 
                  className="otp-btn verify" 
                  onClick={handleVerifyOtp}
                  disabled={loadingOtp}
                >
                  {loadingOtp ? "..." : "Verify"}
                </button>
              </div>
            </div>
          )}

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

          <button 
            type="submit" 
            className={`auth-submit ${!isVerified ? 'disabled' : ''}`}
            disabled={!isVerified}
          >
            Create Account
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
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
          <button type="button" className="google-btn" onClick={() => window.location.href = `${process.env.REACT_APP_BACKEND_URL}/api/auth/google`}>
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c3.13 0 5.75-1.03 7.67-2.81l-3.57-2.77c-.99.66-2.23 1.06-4.1 1.06-3.15 0-5.81-2.13-6.76-5.01H1.67v2.88C3.61 20.12 7.51 23 12 23z" fill="#34A853"/>
              <path d="M5.24 13.47c-.24-.72-.38-1.49-.38-2.3s.14-1.58.38-2.3V5.99H1.67C.61 8.1 0 10.45 0 12.91s.61 4.81 1.67 6.92l3.57-2.88c-.95-2.88-.95-6.04 0-8.48z" fill="#FBBC05"/>
              <path d="M12 4.75c1.7 0 3.22.58 4.42 1.71l3.32-3.32C17.74 1.14 15.12 0 12 0 7.51 0 3.61 2.88 1.67 6.92l3.57 2.88C6.19 6.88 8.85 4.75 12 4.75z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          <div className="auth-divider">
            <span>or sign up with email</span>
          </div>

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
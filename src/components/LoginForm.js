import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './LoginForm.css';
import { FcGoogle } from "react-icons/fc";
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const LoginForm = ({ onClose, onSwitchToRegister }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({ email: '', password: '' });
  const [loggingIn, setLoggingIn] = useState(false);
  const navigate = useNavigate();
  const handleGoogleLogin = () => {
    window.location.href = process.env.REACT_APP_GOOGLE_AUTH_URL;
  };

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' }); // clear error on change
  };

  const handleSubmit = async () => {
  const { email, password } = formData;
  const newErrors = {
    email: email ? '' : 'Email is required',
    password: password ? '' : 'Password is required',
  };

  setErrors(newErrors);

  if (newErrors.email || newErrors.password) return;
  setLoggingIn(true);

  try {
  const response = await axios.post(
    `${BACKEND_URL}/auth/login`,
    {
      email,
      password,
    },
    {
      headers: {
        'Content-Type': 'application/json',
      }
    }
  );

  // Successful response (status 2xx)
  const data = response.data;
  localStorage.setItem('token', data.token);
  localStorage.setItem('username', data.fullName);
  console.log('Login successful');
  setLoggingIn(false);
  navigate('/start');

} catch (error) {
  setLoggingIn(false);
  if (error.response && error.response.status === 403) {
    setErrors({ ...errors, password: 'Invalid email or password' });
  } else if (error.response) {
    console.error('Login failed:', error.response.data);
    setErrors({ ...errors, password: 'Login failed. Please try again later.' });
  } else {
    console.error('Network error:', error.message);
    setErrors({ ...errors, password: 'Network error. Please check your connection.' });
  }
}

};


  return (
    <div className="login-modal">
      <div className="login-box">
        <h2>Login</h2>
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />
        {errors.email && <div className="error-text">{errors.email}</div>}

        <input
          name="password"
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
        />
        {errors.password && <div className="error-text">{errors.password}</div>}

        {loggingIn ? (
        <button onClick={handleSubmit}>
              Logging in ...
            </button>
          ) : (
            <button onClick={handleSubmit}>
              Login
            </button>
          )}

          <div
            style={{
              margin: "15px 0",
              textAlign: "center",
              color: "#888"
            }}
          >
            OR
          </div>

      <button
        type="button"
        className="google-btn"
        onClick={handleGoogleLogin}
      >
        <FcGoogle size={22} />
        <span>Continue with Google</span>
      </button>

        

        <p>
          Don't have an account?{' '}
          <span
            style={{ color: '#007bff', cursor: 'pointer' }}
            onClick={onSwitchToRegister}
          >
            Register here
          </span>
        </p>
      </div>

      <div className="close-box">
        <button className="close-btn" onClick={onClose}>✖</button>
      </div>
    </div>
  );
};

export default LoginForm;

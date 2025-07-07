import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './LoginForm.css';
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const LoginForm = ({ onClose, onSwitchToRegister }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({ email: '', password: '' });
  const navigate = useNavigate();

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

  try {
  const response = await axios.post(
    `https://${BACKEND_URL}/api/v1/auth/login`,
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
  navigate('/start');

} catch (error) {
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

        <button onClick={handleSubmit}>Login</button>

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

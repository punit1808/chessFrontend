import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './styles.css';
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const RegisterForm = ({ onClose, onSwitchToRegister ,onSuccessRegister }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState({});

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' }); // clear individual error
  };

  const handleSubmit = async () => {
    const { name, email, password } = formData;

    const newErrors = {
      name: name ? '' : 'Name is required',
      email: email ? '' : 'Email is required',
      password: password ? '' : 'Password is required',
    };
    setErrors(newErrors);

    if (newErrors.name || newErrors.email || newErrors.password) return;

    try {
  const response = await axios.post(
    `https://${BACKEND_URL}/api/v1/auth/register`,
    {
      fullName: name,
      email,
      password
    },
    {
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );

  // Axios throws on non-2xx, so if we are here, it's successful
  onSuccessRegister(); // Call success callback
  console.log('User Registered');
  onSwitchToRegister(); // Switch to login form

} catch (error) {
  if (error.response && error.response.status === 403) {
    setErrors({ ...errors, email: 'Email already registered. Please log in.' });
  } else if (error.response) {
    console.error('Register failed:', error.response.data);
    setErrors({ ...errors, password: 'Registration failed. Please try again.' });
  } else {
    console.error('Network error:', error.message);
    setErrors({ ...errors, password: 'Network error. Please check your connection.' });
  }
}

  };

  const handleClose = () => {
    onClose();
  };

  return (
    <div className='register-container'>
      <div className="register-box">
        <h2>Register</h2>
        <div>
          <input
            name="name"
            type="text"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
          />
          {errors.name && <div className="error-text">{errors.name}</div>}

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

          <button onClick={handleSubmit}>Register</button>
        </div>
        <p>
          Already have an account?{' '}
          <span
            style={{ color: '#007bff', cursor: 'pointer' }}
            onClick={onSwitchToRegister}
          >
            Login here
          </span>
        </p>
      </div>
      <div className='close-box'>
        <button className="close-btn" onClick={handleClose}>✖</button>
      </div>
    </div>
  );
};

export default RegisterForm;

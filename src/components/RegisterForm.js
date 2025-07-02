import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles.css';

const RegisterForm = ({ onClose, onSwitchToRegister }) => {
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
      const response = await fetch('https://chessbackend-utrs.onrender.com/api/v1/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fullName: name,
          email,
          password
        })
      });

      if (response.ok) {
        console.log('User Registered');
        onSwitchToRegister(); // Switch to login form
      } else if (response.status === 403) {
        setErrors({ ...errors, email: 'Email already registered. Please log in.' });
      } else {
        const errText = await response.text();
        console.error('Register failed:', errText);
        setErrors({ ...errors, password: 'Registration failed. Please try again.' });
      }
    } catch (error) {
      console.error('Network error:', error);
      setErrors({ ...errors, password: 'Network error. Please check your connection.' });
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

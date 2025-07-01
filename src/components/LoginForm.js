import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './LoginForm.css'; // separate CSS

const LoginForm = ({ onClose, onSwitchToRegister }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const loginData = {
      email: formData.email,
      password: formData.password
    };

    try {
      const response = await fetch('https://chessbackend-utrs.onrender.com/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData)
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        const res =await fetch('https://chessbackend-utrs.onrender.com/api/v1/auth/user/me', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        if(res.ok){localStorage.setItem('username', data.fullName);}
        console.log('Login successful');
        navigate('/start'); 
      } 
      else {
        console.error('Login failed:', await response.text());
      }
    } catch (error) {
      console.error('Network error:', error);
    }
  };

  return (
    <div className="login-modal">
      <div className="login-box">
        <h2>Login</h2>
        <input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
        <input name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
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
      <div className='close-box'>
        <button className="close-btn" onClick={onClose}>✖</button>
      </div>
    </div>
  );
};

export default LoginForm;

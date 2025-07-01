import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import './styles.css';

const LoginForm = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });

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
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginData)
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token); // Store token in localStorage
        console.log('Login successful:');
        Navigate('/Start'); // Redirect to home page after successful login
      } else {
        console.error('Login failed:', await response.text());
      }
    } catch (error) {
      console.error('Network error:', error);
    }
  };


  return (
    <div className="form-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
        <input name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
        <button onClick={handleSubmit}>Login</button>
      </form>
      <p>
        Don't have an account? <Link to="/register">Register here</Link>
      </p>
    </div>
  );
};

export default LoginForm;

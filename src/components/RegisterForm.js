import React, { useState } from 'react';
import { Link, useNavigate , Navigate} from 'react-router-dom';
import './styles.css';

const RegisterForm = ({onClose,onSwitchToRegister}) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const loginData = {
      email: formData.email,
      password: formData.password,
      fullName: formData.name
    };

    try {
      const response = await fetch('https://chessbackend-utrs.onrender.com/api/v1/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginData)
      });

      if (response.ok) {
        console.log('User Registerd');
        navigate('/login');

      } 
      else {
        console.error('Register failed:', await response.text());
      }
    } catch (error) {
      console.error('Network error:', error);
    }
  };

  const handleClose = () => {
    onClose();
  }

  return (
    <div className='register-container'>
      <div className="register-box">
        <h2>Register</h2>
        <div>
          <input name="name" type="text" placeholder="Name" value={formData.name} onChange={handleChange} required />
          <input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
          <input name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
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

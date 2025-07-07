import React, { useState } from 'react';
import './StartPage.css';
import { useNavigate } from 'react-router-dom';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import axios from 'axios';
import { ToastContainer,toast } from 'react-toastify';
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const guestEmail = process.env.REACT_APP_Guest_EMAIL;
const guestPassword = process.env.REACT_APP_Guest_PASSWORD;

const StartPage = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const navigate = useNavigate();

  const handleGuestPlay = async () => {

    try {
  const response = await axios.post(
    `https://${BACKEND_URL}/api/v1/auth/login`,
    {
      email: guestEmail,
      password: guestPassword
    },
    {
      headers: { 'Content-Type': 'application/json' }
    }
  );

  // If the request succeeds (status 2xx), this block runs
  const data = response.data;
  localStorage.setItem('token', data.token);
  console.log('Login successful');
  navigate('/start');

} catch (error) {
  if (error.response && error.response.status === 403) {
    console.error('Invalid email or password');
  } else if (error.response) {
    console.error('Login failed:', error.response.data);
  } else {
    console.error('Network error:', error.message);
  }
}

  };

  return (
    <div className={`landing-body ${showLogin || showRegister ? 'blur-background' : ''}`}>
      <ToastContainer />
      <section className="hero-section">
        <div className="guest-button-wrapper">
          <button className="guest-button" onClick={handleGuestPlay}>Play as Guest</button>
        </div>
        <h1>♟️ ChessMaster</h1>
        <p>Your ultimate online chess battleground.</p>
        <button onClick={() => setShowLogin(true)}>Get Started</button>
      </section>

      <section className="about-section">
        <h2>About ChessMaster</h2>
        <div className="cards-container">
          <div className="about-card"><h3>🌐 Multiplayer</h3><p>Challenge players globally in real-time.</p></div>
          <div className="about-card"><h3>👤 Guest or Registered</h3><p>Play instantly or track progress with an account.</p></div>
          <div className="about-card"><h3>🎥 Spectator Mode</h3><p>Watch matches in real-time.</p></div>
          <div className="about-card"><h3>📈 Rankings Coming Soon</h3><p>Compete with ELO and leaderboards.</p></div>
        </div>
      </section>

      {showLogin && (
        <LoginForm
          onClose={() => setShowLogin(false)}
          onSwitchToRegister={() => {
            setShowLogin(false);    
            setShowRegister(true);
          }}
        />
      )}

      {showRegister && (
        <RegisterForm onClose={() => setShowRegister(false)}
        onSwitchToRegister={() => {
            setShowLogin(true);
            setShowRegister(false);
          }}
        onSuccessRegister={()=>{
          toast.success('Registration successful');
        }}
        />
      )}
    </div>
  );
};

export default StartPage;

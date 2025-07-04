import React, { useState } from 'react';
import './StartPage.css';
import { useNavigate } from 'react-router-dom';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import { ToastContainer,toast } from 'react-toastify';

const StartPage = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const navigate = useNavigate();

  const handleGuestPlay = () => {
    localStorage.setItem('token', 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJwdW5pdHlhZGF2MTgwOEBnbWFpbC5jb20iLCJpYXQiOjE3NTE2MTI1NjgsImV4cCI6MTc1MTY5ODk2OH0.HcFhw2h9LJsHepm1dkFROHaCATREv7f3s-zaDZEHJuQ');
    navigate('/start'); 
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

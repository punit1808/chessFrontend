import React from 'react';
import './NavBar.css';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem('username');

    const onLoginClick = () => {
        navigate('/');
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        navigate('/');
    }

  return (
    <nav className="navbar">
      <div className="navbar-left" />

      <div className="navbar-center">
        <h1 className="navbar-title">♟️ ChessMaster</h1>
      </div>

      <div className="navbar-right">
        {username ? (
          <>
            <span className="navbar-user">👤 {username}</span>
            <button className="navbar-btn" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <span className="navbar-user">🕹️ Guest</span>
            <button className="navbar-btn" onClick={onLoginClick}>Login</button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

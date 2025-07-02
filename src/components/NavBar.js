import React, { useState } from 'react';
import './NavBar.css';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ gameStarted }) => {
  const navigate = useNavigate();
  const username = localStorage.getItem('username');
  const [showMenu, setShowMenu] = useState(false);
  const gameId = localStorage.getItem('gameId');


  const onLoginClick = () => {
    navigate('/');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('gameId');
    navigate('/');
  };

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  return (
    <nav className="navbar">
      <div className="navbar-left" />

      <div className="navbar-center">
        <h1 className="navbar-title">♟️ ChessMaster</h1>
      </div>

      <div className="navbar-right">
        <div className="navbar-desktop">
          <span className="navbar-user">
            👤 {username ? username.toUpperCase() : 'Guest'}
          </span>
          {gameStarted && gameId && (
            <span className="navbar-gameid">🎯 Game ID: {gameId}</span>
          )}
          {username ? (
            <button className="navbar-btn-red" onClick={handleLogout}>Logout</button>
          ) : (
            <button className="navbar-btn" onClick={onLoginClick}>Login</button>
          )}
        </div>

        <div className="navbar-mobile-menu">
          <button className="menu-icon" onClick={toggleMenu}>☰</button>
          {showMenu && (
            <div className="dropdown-menu">
              <div className="dropdown-user">👤 {username ? username.toUpperCase() : 'Guest'}</div>
              {gameStarted && gameId && (
                <div className="dropdown-gameid">🎯 Game ID: {gameId}</div>
              )}
              {username ? (
                <button className="logout-btn" onClick={handleLogout}>Logout</button>
              ) : (
                <button className="login-btn" onClick={onLoginClick}>Login</button>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

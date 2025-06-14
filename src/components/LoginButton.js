// src/components/LoginButton.jsx
import React from "react";

const LoginButton = () => {
  const backendUrl = "http://chessbackend-production.up.railway.app/oauth2/authorization/google"; // Adjust port

  return (
    <a href={backendUrl}>
      <button style={{ padding: "8px 16px", margin: "10px", background: "green", color: "white", border: "none", borderRadius: "5px" }}>
      Login
    </button>
    </a>
  );
};

export default LoginButton;

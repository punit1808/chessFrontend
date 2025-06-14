import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post("https://chessbackend-production.up.railway.app/logout", {}, {
        withCredentials: true
      });

      // Optionally clear any client-side state here

      navigate("/"); // or wherever your login page is
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <button onClick={handleLogout} style={{ padding: "8px 16px", margin: "10px", background: "#e53935", color: "white", border: "none", borderRadius: "5px" }}>
      Logout
    </button>
  );
};

export default LogoutButton;

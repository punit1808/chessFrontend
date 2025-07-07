import React, { useState,useEffect } from "react";
import { ToastContainer, toast } from 'react-toastify';
import axios from "axios";
import Board from "./Board"; 
import Navbar from "../components/NavBar";
import './StartGame.css'; 
import { useNavigate } from "react-router-dom";
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const StartGame = () => {
  const navigate = useNavigate();
  const [user1, setUser1] = useState("");
  const [gameId, setGameId] = useState("");
  const [gameStarted, setGameStarted] = useState(false);
  const [socket, setSocket] = useState();
  const token = localStorage.getItem('token');
  const username = localStorage.getItem('username');
  const [useExisting, setUseExisting] = useState(false);


  useEffect(() => {
    if(token==null || token == undefined || token === "undefined") {
      navigate('/');
    }
    if(username==null || username == undefined || username === "undefined") {
      toast.success("Guest Login")
    }
    else{
      toast.success("Login Success");
    }
  }, []);

  const createGameId = async () => {
    try {
      const response = await axios.get(`https://${BACKEND_URL}/api/game/create`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const generatedId = response.data.gameId || response.data;
      setGameId(generatedId);
      if(generatedId == undefined || generatedId == null) {
        toast.error("Login Required");  
        navigate('/');
        return;
      }
      toast.success(`Game ID Created: ${generatedId}`);
    } catch (error) {
      console.error("Error creating game ID:", error);
      toast.error("Failed to create game ID");
    }
  };

  const handleCloseBoard = () => {
    setGameStarted(false);
    setSocket(null);
  }

  const startHandler = async () => {
    if (!user1 || !gameId) {
      toast.error("Please enter username and create a game ID");
      return;
    }
    localStorage.setItem('gameId', gameId);

    try {
      const ws = new WebSocket(`wss://${BACKEND_URL}/wss/game/${gameId}/${user1}/${user1}`);
      setSocket(ws);
      ws.onopen = () => {
        console.log(`Connected to game ${gameId} as player ${user1}`);
      };
      toast.success("Game Started!");
      setGameStarted(true);
    } catch (error) {
      console.error("Error starting game:", error);
      toast.error("Failed to start game");
    }
  };

  return (
    <div className="startgame-body">
      <ToastContainer />
      <Navbar gameStarted={gameStarted}/>
      <br/>
      {!gameStarted ? (
        <div className="startgame-container">
          <div className="startgame-card">
            <h2 >Start a New Game</h2>
            <h6>Enter Username:</h6>
            <input
              type="text"
              placeholder="Your name"
              value={user1}
              onChange={(e) => setUser1(e.target.value)}
            />
            {useExisting ? (
                <>
                  <input
                    type="text"
                    placeholder="Enter existing Game ID"
                    value={gameId}
                    onChange={(e) => setGameId(e.target.value)}
                  />
                  <p className="toggle-text" onClick={() => setUseExisting(false)}>
                    ← Go back to creating a new Game ID
                  </p>
                </>
              ) : (
                <>
                  <button className="green-btn" onClick={createGameId}>
                    Create Game ID
                  </button>
                  <p className="toggle-text" onClick={() => setUseExisting(true)}>
                    Have an existing Game ID?
                  </p>
                </>
              )}
            <button className="green-btn" onClick={startHandler}>
              Start Game
            </button>
          </div>
        </div>
      ) : (
        <Board gameStarted={gameStarted} gameId={gameId} userId={user1} socket={socket} onClose={handleCloseBoard} />
      )}
    </div>
  );
};

export default StartGame;

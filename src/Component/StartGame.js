import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { ToastContainer, toast } from 'react-toastify';
import axios from "axios";
import Board from "./Board"; 

const StartGame = () => {
  const [user1, setUser1] = useState("");
  const [gameId, setGameId] = useState("");
  const [gameStarted, setGameStarted] = useState(false);
  const[socket,setSocket] = useState();
  const token = localStorage.getItem('token');

  const createGameId = async () => {
    try {
      // fetch("http://localhost:8080/api/user/me", {
      //   method: "GET",
      //   credentials: "include" // ✅ include the session cookie
      // })
      // .then(res => res.json())
      // .then(data => console.log(data));


    
      const response = await axios.get(`https://chessbackend-utrs.onrender.com/api/game/create`,{
        headers: {
          'Authorization': `Bearer ${token}`, 
          'Content-Type': 'application/json'
        }
      });

      const generatedId = response.data.gameId || response.data;  // adjust based on backend response
      setGameId(generatedId);
      toast.success(`Game ID Created: ${generatedId}`);
    } catch (error) {
      console.error("Error creating game ID:", error);
      toast.error("Failed to create game ID");
    }
  };

  const startHandler = async () => {
    if (!user1 || !gameId) {
      toast.error("Please enter username and create a game ID");
      return;
    }

    try {
      const ws = new WebSocket(`wss://chessbackend-utrs.onrender.com/wss/game/${gameId}/${user1}/${user1}`);
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
    <div>
      <ToastContainer />
      <br />
      {!gameStarted && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: '20rem', padding: '10px', margin: '10px', background: 'silver' }} className='card'>
            <h2>Start a New Game</h2>
            <br />
            <h4>Enter Username:</h4>
            <input
              type="text"
              placeholder="Enter your name"
              value={user1}
              onChange={(e) => setUser1(e.target.value)}
            />
            <br /><br />
            <Button variant="info" onClick={createGameId}>
              Create Game ID
            </Button>
            <br/>
            <input
              type="text"
              placeholder="Enter gameId"
              value={gameId}
              onChange={(e) => setGameId(e.target.value)}
            />

            <p style={{ marginTop: '10px' }}>Game ID: <strong>{gameId}</strong></p>
            <Button variant="success" size="lg" onClick={startHandler}>
              Start Game
            </Button>

          </div>
        </div>
      )}
      {gameStarted && <Board gameStarted={gameStarted} gameId={gameId} userId={user1} socket={socket}/>}
    </div>
  );
};

export default StartGame;

import React, { useState,useEffect } from "react";
import { ToastContainer, toast } from 'react-toastify';
import axios from "axios";
import Board from "./Board"; 
import BOTBoard from "./BOTBoard";
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
  const [fTurn, setFTurn] = useState("white");
  const [dLevel, setDLevel] = useState("4");
  const [mType,setMType] = useState("player");
  const [mode,setMode] = useState(null);
  const [gameIdCreating,setGameIdCreating] = useState(false);
  const [startingGame,setStartingGame] = useState(false);


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
    setGameIdCreating(true)
    try {
      const response = await axios.get(`https://${BACKEND_URL}/api/game/create/${fTurn}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const generatedId = response.data.gameId || response.data;
      setGameId(generatedId);
      console.log("Game ID created:", generatedId);
      if(generatedId == undefined || generatedId == null || generatedId === "undefined" || generatedId === "") {
        toast.error("Error creating Game ID! retry");  
        return;
      }
      setGameIdCreating(false);
      toast.success(`Game ID Created: ${generatedId}`);
    } catch (error) {
      setGameIdCreating(false);
      console.error("Error creating game ID:", error);
      toast.error("Failed to create game ID");
    }
  };

  const createBotGameId = async () => {
    setGameIdCreating(true);
     try {
      const response = await axios.get(`https://${BACKEND_URL}/api/game/bot/create/${fTurn}/${dLevel}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const generatedId = response.data.gameId || response.data;
      setGameId(generatedId);
      console.log("Game ID created:", generatedId);
      if(generatedId == undefined || generatedId == null || generatedId === "undefined" || generatedId === "") {
        toast.error("Failed to setup ... try again");  
        return;
      }
      setGameIdCreating(false);
      toast.success(`Setup Complete !!`);
    } catch (error) {
      setGameIdCreating(false);
      console.error("Error creating game ID:", error);
      toast.error("Failed to setup ... try again");
    }
  }

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
    setStartingGame(true);
    try {
      const ws = new WebSocket(`wss://${BACKEND_URL}/wss/game/${gameId}/${user1}/${user1}`);
      setSocket(ws);
      ws.onopen = () => {
        console.log(`Connected to game ${gameId} as player ${user1}`);
      };
      toast.success("Game Started!");
      setStartingGame(false);
      setGameStarted(true);
    } catch (error) {
      setStartingGame(false);
      console.error("Error starting game:", error);
      toast.error("Failed to start game");
    }
  };

  const startBotGameHandler = async () => {
    if (!user1 || !gameId) {
      toast.error("Environment setup pending...");
      return;
    }
    localStorage.setItem('gameId', gameId);
    setStartingGame(true);
    try {
      const ws = new WebSocket(`wss://${BACKEND_URL}/wss/game/bot/${gameId}/${user1}/${user1}`);
      setSocket(ws);
      ws.onopen = () => {
        console.log(`Connected to game ${gameId} as player ${user1}`);
      };
      toast.success("Game Started!");
      setStartingGame(false);
      setGameStarted(true);
    } catch (error) {
      setStartingGame(false);
      console.error("Error starting game:", error);
      toast.error("Failed to start game");
    }
    }

    const startSpectatorHandler = async () => {
      if(mType==="player"){
        startHandler();
      }
      else{
        startBotGameHandler();
      }
    }

  return (
    <div className="startgame-body">
      <ToastContainer />
      <Navbar gameStarted={gameStarted}/>
      <br/>
      {!gameStarted ? (
        <div className="startgame-container">
          <div className="startgame-card">
            <h2 >Start Game</h2>
            <div className="mode-row">
              <button className={`mode-btn ${mode === 'player' ? 'active' : ''}`} onClick={() => setMode('player')}>
                vPlayer
              </button>
              <button className={`mode-btn ${mode === 'bot' ? 'active' : ''}`} onClick={() => setMode('bot')}>
                vBot
              </button>
              <button className={`mode-btn ${mode === 'watch' ? 'active' : ''}`} onClick={() => setMode('watch')}>
                Watch
              </button>
            </div>
            

            {/* vPlayer Section */}
            {mode === 'player' && (
              <div className="startgame-card">
              <h6>Enter Username:</h6>
            <input
              type="text"
              placeholder="Your name"
              value={user1}
              onChange={(e) => setUser1(e.target.value)}
            />

            {useExisting ? (<></>) : (
              <>
              <h6 className="startgame-label">Select First Turn:</h6>
                  <select
                    value={fTurn}
                    onChange={(e) => setFTurn(e.target.value)}
                    className="startgame-select"
                  >
                    <option value="white">White</option>
                    <option value="black">Black</option>
                  </select>
                  <br/>
              </>)
            }
            
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
                  {gameIdCreating ? (<button className="green-btn" onClick={createGameId}>
                    Creating Game ID ...
                  </button>):(<button className="green-btn" onClick={createGameId}>
                    Create Game ID
                  </button>)}
                  <p className="toggle-text" onClick={() => setUseExisting(true)}>
                    Have an existing Game ID?
                  </p>
                </>
              )}
           {startingGame ? (<button className="green-btn" onClick={startHandler}>
              Starting Game ...
            </button>):(<button className="green-btn" onClick={startHandler}>
              Start Game  
              </button>)}
            </div>
            )}

            {/* vBot Section */}
            {mode === 'bot' &&(
              <div className="startgame-card">
                <h6>Enter Username:</h6>
            <input
              type="text"
              placeholder="Your name"
              value={user1}
              onChange={(e) => setUser1(e.target.value)}
            />

            <h6 className="startgame-label">Select First Turn:</h6>
            <select
              value={fTurn}
              onChange={(e) => setFTurn(e.target.value)}
              className="startgame-select"
            >
              <option value="white">White</option>
              <option value="black">Black</option>
            </select>
            <br/>
            <h6 className="startgame-label">Select Difficulty Level:</h6>
            <select
              value={dLevel}
              onChange={(e) => setDLevel(e.target.value)}
              className="startgame-select"
            >
              <option value="4">Easy</option>
              <option value="8">Medium</option>
              <option value="12">Hard</option>
              <option value="16">Expert</option>
            </select>
            <br/>
              
            {gameIdCreating ? (<button className="green-btn" onClick={createBotGameId}>
              Setting up ...
            </button>):(<button className="green-btn" onClick={createBotGameId}>
              Setup Environment
            </button>)}
            {startingGame ? (<button className="green-btn" onClick={startBotGameHandler}>
              Starting Game ...
            </button>):(<button className="green-btn" onClick={startBotGameHandler}>
              Start Game </button>)}
              </div>
            )}

            {/* Spectator Section */}
            {mode==='watch' && (
              <div className="startgame-card">
                <h6>Enter Username:</h6>
            <input
              type="text"
              placeholder="Your name"
              value={user1}
              onChange={(e) => setUser1(e.target.value)}
            />
            <h6>Enter GameId :</h6>
             <input
              type="text"
              placeholder="Enter Game ID"
              value={gameId}
              onChange={(e) => setGameId(e.target.value)}
            />

              <h6 className="startgame-label">Game type</h6>
                <select
                  value={mType}
                  onChange={(e) => setMType(e.target.value)}
                  className="startgame-select"
                >
                  <option value="player">vPlayer</option>
                  <option value="bot">vBot</option>
                </select>
                <br/>
            
            {startingGame ? (<button className="green-btn" onClick={startSpectatorHandler}>
              Joining Game ...
            </button>):(<button className="green-btn" onClick={startSpectatorHandler}>
              Join Game </button>)}
              </div>
            )}

          </div>
        </div>
      ) : (<>
      {mode === 'player' && (
          <Board gameStarted={gameStarted} gameId={gameId} userId={user1} socket={socket} onClose={handleCloseBoard} />
        )}
        
        {mode==='bot' && (
        <BOTBoard gameStarted={gameStarted} gameId={gameId} userId={user1} socket={socket} onClose={handleCloseBoard} />
        )}

        {mode==='watch' && mType==='player' && (
          <Board gameStarted={gameStarted} gameId={gameId} userId={user1} socket={socket} onClose={handleCloseBoard} />
        )}

        {mode==='watch' && mType==='bot' && (
          <BOTBoard gameStarted={gameStarted} gameId={gameId} userId={user1} socket={socket} onClose={handleCloseBoard} />
        )}
        
        </>
      )}
    </div>
  );
};

export default StartGame;

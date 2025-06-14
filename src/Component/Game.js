import React, { useState } from "react";

export default function Game() {
  const [gameId, setGameId] = useState("");
  const [playerId, setPlayerId] = useState("");
  const [socket, setSocket] = useState(null);
  const [chat, setChat] = useState([]);
  const [msg, setMsg] = useState("");

  const createGame = async () => {
    const res = await fetch("http://chessbackend-production.up.railway.app/api/game/create", { method: "POST" });
    const data = await res.json();
    setGameId(data.gameId);
    alert("Game ID: " + data.gameId);
  };

  const joinGame = async () => {

// Need to add a unique token for each user
    const ws = new WebSocket(`ws://chessbackend-production.up.railway.app/ws/game/${gameId}/${playerId}/${playerId}`);
    
    ws.onopen = () => {
      console.log(`Connected to game ${gameId} as player ${playerId}`);
    };
    ws.onmessage = (event) => {
      setChat((prev) => [...prev, event.data]);
    };
    setSocket(ws);
  };

  const sendMessage = () => {
    if (socket && msg.trim()) {
      socket.send(msg);
      setChat((prev) => [...prev, `You: ${msg}`]);
      setMsg("");
    }
  };

  return (
    <div>
      <button onClick={createGame}>Create Game</button>
      <br /><br />
      <input
        placeholder="Game ID"
        value={gameId}
        onChange={(e) => setGameId(e.target.value)}
      />
      <input
        placeholder="Player Id"
        value={playerId}
        onChange={(e) => setPlayerId(e.target.value)}
      />
      <button onClick={joinGame}>Join Game</button>
      <hr />
      <textarea rows="10" cols="60" value={chat.join("\n")} readOnly />
      <br />
      <input
        placeholder="Your move or message"
        value={msg}
        onChange={(e) => setMsg(e.target.value)}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

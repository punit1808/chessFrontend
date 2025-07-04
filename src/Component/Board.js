import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";  
import whitepawn from "../Images/whitepawn.svg";
import blackpawn from "../Images/blackpawn.svg";
import whitebishop from "../Images/whitebishop.svg";
import blackbishop from "../Images/blackbishop.svg";
import whiteknight from "../Images/whiteknight.svg";
import blackknight from "../Images/blackknight.svg";
import whitequeen from "../Images/whitequeen.svg";
import blackqueen from "../Images/blackqueen.svg";
import whiterook from "../Images/whiterook.svg";
import blackrook from "../Images/blackrook.svg";
import whiteking from "../Images/whiteking.svg";
import blackking from "../Images/blackking.svg";
import './comp.css';
import { wait } from "@testing-library/user-event/dist/utils";


const NUM_CELLS = 8; // 8x8 chessboard

const pieceImages = {
  whitepawn,
  blackpawn,
  whitebishop,
  blackbishop,
  whiteknight,
  blackknight,
  whitequeen,
  blackqueen,
  whiterook,
  blackrook,
  whiteking,
  blackking,
  
};

const Board = ({ gameStarted , gameId, userId, socket, onClose}) => {
  const [board, setBoard] = useState([]);
  const [isSet, setIsSet] = useState(false);
  const [turn, setTurn] = useState("white");
  const [valid,setValid] = useState(false);
  const [flag,SetFlag] = useState(false);
  const[check,setCheck] = useState();
  const [ck,setCk] = useState(true);
  const [winner,setWinner] = useState("");
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  


  const [boardSize, setBoardSize] = useState({ width: 0, height: 0 });

  // Track the piece being dragged
  const [draggedPiece, setDraggedPiece] = useState(null);

  // Keep a ref to current board to avoid stale closures
  const prevBoardRef = useRef([]);

  // Responsive board sizing
  useEffect(() => {
    const updateSize = () => {
      const width = window.innerWidth * 0.95;
      const height = window.innerHeight * 0.95;
      const size = Math.min(width, height);
      setBoardSize({ width: size, height: size });
      
    };

    updateSize();
    window.addEventListener("resize", updateSize);

    return () => window.removeEventListener("resize", updateSize);
  }, []);

  // Fetch board initially and on gameStarted
  useEffect(() => {
    if (!gameStarted) return;

    const fetchBoard = async () => {
      try {
        const response = await axios.get(`https://chessbackend-utrs.onrender.com/api/game/board/${gameId}`,{
        headers: {
          'Authorization': `Bearer ${token}`, 
          'Content-Type': 'application/json'
        }
      });
      setBoard(response.data.board);
      
      prevBoardRef.current = response.data.board;
      await new Promise(resolve => setTimeout(resolve, 6000)); // Delay to ensure board is fetched after game start
      if (board === undefined || board === null) {
        toast.error("Game Id doesn't exist");
        onClose();
        return;
      }
      setIsSet(true);
      const responseTurn = await axios.get(`https://chessbackend-utrs.onrender.com/api/game/turn/${gameId}`,{
        headers: {
          'Authorization': `Bearer ${token}`, 
          'Content-Type': 'application/json'
        }
      });

      setTurn(responseTurn.data);
      } catch (error) {
        console.error("Error fetching board:", error);
        toast.error("Failed to fetch board");
      }
    };

    fetchBoard();
  }, [flag]);

 useEffect(() => {

  if (!socket) {
    toast.error("Socket Disconnected");
    return;
  }

  socket.onmessage = (event) => {
    // Expect "true" or "false" string
    if (event.data === "true") {

      const handleDelay = async () => {
        await new Promise(resolve => setTimeout(resolve, 10));

        try{
        axios.get(`https://chessbackend-utrs.onrender.com/api/game/rerender/${gameId}`,{
        headers: {
          'Authorization': `Bearer ${token}`, 
          'Content-Type': 'application/json'
        }
      }).then(response => {
              setBoard(response.data.board.board);
              prevBoardRef.current = response.data.board.board;
              setIsSet(true);
              setTurn(response.data.turn);
              setCheck(response.data.isSafe);
              if(response.data.isWin.res){
                setWinner(response.data.isWin.pieceColor);
              }
              setCk(!response.data.isWin.res);
          });}catch(error){
          toast.error("Error in re-rendering");
        }
      };

      handleDelay(); 
    }
  };

  // Cleanup handler on unmount
  return () => {
    if (socket) socket.onmessage = null;
  };
}, [flag]);



  const cellSize = boardSize.width / NUM_CELLS;

  // Handle drag start: store dragged piece info
  const handleDragStart = (cell) => {
    if (!cell) return;
    setDraggedPiece(cell);
  };

  // Handle drop on target cell
  const handleDrop = async (targetRow, targetCol) => {
    if (!draggedPiece) return;

    const fromRow = draggedPiece.row;
    const fromCol = draggedPiece.col;

    // If dropped on the same square, ignore
    if (fromRow === targetRow && fromCol === targetCol) {
      setDraggedPiece(null);
      return;
    }

    try {
      // POST move to backend
      const response1 = await axios.get(
        `https://chessbackend-utrs.onrender.com/api/game/move/${fromRow}/${fromCol}/${targetRow}/${targetCol}/${gameId}/${userId}`,{
        headers: {
          'Authorization': `Bearer ${token}`, 
          'Content-Type': 'application/json'
        }
      }
      );

      setValid(response1.data.isValid);
      setCheck(response1.data.isSafe);
      if(response1.data.isWin.res){
                setWinner(response1.data.isWin.pieceColor);
              }
      setCk(!response1.data.isWin.res);
      SetFlag(!flag);

    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(response1.data.isValid.toString()); // send "true" or "false"
       
    } else {
      toast.error("Spectator mode");
    }
  } catch (error) {
    toast.error("Move error");
  }

    setDraggedPiece(null);
  };

  return (
    <div>
      {!ck && (
        <div className="win-overlay">
          <div className="winBox">
            <div>{winner.toUpperCase()} WIN</div>
            <button className="replay-btn" onClick={() => window.location.href = '/start'}>
              Replay
            </button>
          </div>
        </div>
      )}
        {ck ? (
          <>
            <div style={{ textAlign: 'center', fontWeight: 'bolder', color: 'green' }}>
              {turn.toUpperCase()}
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                width: boardSize.width,
                height: boardSize.height,
                margin: "0 auto",
                border: "2px solid black",
                boxSizing: "border-box",
                userSelect: "none",
              }}
            >
              {board.map((row, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    width: "100%",
                    height: cellSize,
                  }}
                >
                  {row.map((cell, j) => (
                    <div
                      key={j}
                      style={{
                        width: cellSize,
                        height: cellSize,
                        border: "1px solid black",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        fontWeight: "bold",
                        fontSize: cellSize * 0.25,
                        backgroundColor:
                          check?.res === false && check.row === i && check.col === j
                            ? "#ff7f7f"
                            : (i + j) % 2 === 0
                            ? "#eee"
                            : "#666",
                        color: cell ? (cell.color === "black" ? "black" : "orange") : "orange",
                        cursor: cell ? "grab" : "default",
                      }}
                      draggable={!!cell}
                      onDragStart={() => handleDragStart(cell)}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={() => handleDrop(i, j)}
                      title={cell ? `${cell.name} (${cell.color})` : ""}
                    >
                      {cell ? (
                        <img
                          src={pieceImages[cell.color + cell.name]}
                          alt={cell.name}
                          style={{
                            width: "80%",
                            height: "80%",
                            objectFit: "contain",
                            pointerEvents: "none",
                          }}
                        />
                      ) : (
                        ""
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </>
        ) : null}
      </div>
    );
}

export default Board;

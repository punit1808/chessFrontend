import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
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
const backendUrl = window._env_?.BACKEND_URL;



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

const Board = ({ gameStarted , gameId, userId, socket}) => {
  const [board, setBoard] = useState([]);
  const [isSet, setIsSet] = useState(false);
  const [turn, setTurn] = useState("white");
  const [valid,setValid] = useState(false);
  const [flag,SetFlag] = useState(false);
  const[check,setCheck] = useState();
  const [ck,setCk] = useState(true);
  


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
        const response = await axios.get(`https://${BACKEND_URL}/api/game/board/${gameId}`);
        setBoard(response.data.board);
        prevBoardRef.current = response.data.board;
        setIsSet(true);
        const responseTurn = await axios.get(`https://${BACKEND_URL}/api/game/turn/${gameId}`);
        setTurn(responseTurn.data);
      } catch (error) {
        console.error("Error fetching board:", error);
        toast.error("Failed to fetch board");
      }
    };

    fetchBoard();

    // Poll every 1 second for updates from backend (optional)
    // const intervalId = setInterval(fetchBoard, 100);

    // return () => clearInterval(intervalId);
  }, [flag]);

 useEffect(() => {
  console.log("Before socket opening in event to sendback message");

  if (!socket) {
    toast.error("Socket Disconnected");
    return;
  }

  console.log("After socket opening in event to sendback message");

  socket.onmessage = (event) => {
    // Expect "true" or "false" string
    if (event.data === "true") {
      console.log("Inside");

      const handleDelay = async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
        console.log("After socket opening in event to sendback message fetching board");
        try{
        axios.get(`https://${BACKEND_URL}/api/game/rerender/${gameId}`).then(response => {
              setBoard(response.data.board.board);
              prevBoardRef.current = response.data.board.board;
              setIsSet(true);
              setTurn(response.data.turn);
              setCheck(response.data.isSafe);
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
        `https://${BACKEND_URL}/api/game/move/${fromRow}/${fromCol}/${targetRow}/${targetCol}/${gameId}/${userId}`
      );

      setValid(response1.data.isValid);
      setCheck(response1.data.isSafe);
      setCk(!response1.data.isWin.res);
      SetFlag(!flag);
       console.log("Before sending message");
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(response1.data.isValid.toString()); // send "true" or "false"
       console.log("After sending message");
       
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
      {!ck ? (
          <div className="winBox">
            <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#28a745" }}>
              {turn === "black" ? "WHITE WINS!" : "BLACK WINS!"}
            </div>
          </div>
        ) : null}
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

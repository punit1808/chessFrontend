# ChessMaster Frontend

The ChessMaster Frontend is a real‑time multiplayer chess application built in **React**, featuring live WebSocket gameplay, JWT authentication, bot matches, and spectator mode.

---

## ✅ Features

* User authentication (JWT with Bearer Token)
* Join/Start game via Game ID
* Real‑time WebSocket move streaming
* vs Player / vs Bot play
* Spectator mode
* Move highlighting + smooth UI
* API + WS integration w/ backend

---

## 🏗 Tech Stack

* React
* React Router
* Bootstrap
* WebSockets
* JWT

---

## 📁 Folder Structure

```
frontend/
 ├─ public/
 ├─ src/
 │   ├─ components/
 │   │   ├─ StartGame.js
 │   │   └─ Board.js
 │   ├─ utils/
 │   ├─ api/
 │   └─ App.js
 ├─ package.json
 └─ .env
```

---

## ⚙️ Environment Variables

Create `.env` file:

```
REACT_APP_API_BASE_URL=http://localhost:8080
REACT_APP_WS_URL=ws://localhost:8080/ws/game
```

Example for production:

```
REACT_APP_API_BASE_URL=https://your-backend-domain.com
REACT_APP_WS_URL=wss://your-backend-domain.com/ws/game
```

---

## 🔧 Setup

### 1️⃣ Clone Repo

```
git clone <repo-url>
cd frontend
```

### 2️⃣ Install dependencies

```
npm install
```

### 3️⃣ Add `.env`

```
REACT_APP_API_BASE_URL=<backend-url>
REACT_APP_WS_URL=<backend-ws-url>
```

### 4️⃣ Start Project

```
npm start
```

Runs at:

```
http://localhost:3000
```

---

## 🔌 Connecting to Backend

Frontend communicates with backend via:

* **REST API** → `/api/*`
* **WebSockets** → `/ws/game/{gameId}/{playerId}`

All requests requiring authentication must include JWT Bearer Token.

Example:

```
Authorization: Bearer <token>
```

---

## ♟ Game Flow

1. User logs in → JWT stored in memory/cookie
2. Start/Join game
3. WebSocket connects
4. Moves sync across clients
5. Optional: Bot responds via Stockfish
6. Spectators receive same WS events

---

## 🔒 Authentication

* Token stored in browser memory / local storage
* Sent via `Authorization: Bearer <token>` for secured endpoints

---

## 🌐 Deployment

### Build

```
npm run build
```

Produces static build folder:

```
build/
```

Deploy on:

* Vercel
* Netlify
* Render
* S3 + CloudFront
* Nginx

Be sure to set environment variables for prod.

---

## 🚦 WebSocket

Example usage:

```
const ws = new WebSocket(`${REACT_APP_WS_URL}/${gameId}/${playerName}`);
```

Events broadcast:

* Move updates
* Player joins
* Spectator joins
* Bot moves

---

## 🎨 UI

* React + Bootstrap based layout
* Move highlighting
* First Turn: White/Black selector

---

## 📌 Future Enhancements

* Timer / time control
* User profile & stats
* Multi‑lobby / tournaments

---


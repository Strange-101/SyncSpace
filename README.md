<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React 19" />
  <img src="https://img.shields.io/badge/Node.js-Express_5-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Socket.io-4-010101?style=for-the-badge&logo=socket.io&logoColor=white" alt="Socket.io" />
  <img src="https://img.shields.io/badge/WebRTC-Peer_to_Peer-333333?style=for-the-badge&logo=webrtc&logoColor=white" alt="WebRTC" />
  <img src="https://img.shields.io/badge/Vite-7-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
</p>

# 🖊️ SyncSpace — Real-Time Collaborative Whiteboard

**SyncSpace** is a full-stack collaborative whiteboard application where multiple users can draw, brainstorm, and communicate together in real time. Built on the **MERN** stack with **Excalidraw**, **WebRTC**, and **Socket.io**, it delivers a seamless, low-latency collaboration experience.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🎨 **Collaborative Whiteboard** | Real-time drawing powered by [Excalidraw](https://excalidraw.com/) with live element synchronization across all participants |
| 📹 **Video & Audio Calls** | Peer-to-peer video/audio via WebRTC (`simple-peer`), with mute/unmute and camera toggle controls |
| 💬 **In-Room Chat** | Send and receive text messages during a whiteboard session |
| 🏠 **Room System** | Create or join rooms using unique room IDs; share the link to invite others |
| 🚪 **Lobby & Waiting Room** | Hosts control admission — incoming users wait in a lobby until the host admits or denies them |
| 👑 **Host Controls** | Automatic host assignment for the first user; host auto-promotion if the original host disconnects |
| 🔐 **Authentication** | JWT-based signup/login with bcrypt password hashing and protected routes |
| 🛡️ **Protected Routes** | Dashboard, lobby, and workspace pages are guarded — unauthenticated users are redirected to login |
| 📡 **Live Cursor Tracking** | See other participants' pointer positions on the whiteboard in real time |
| 🎨 **Sketchy UI Theme** | Hand-drawn, playful visual design across all pages |

---

## 🏗️ Tech Stack

### Frontend
- **React 19** — UI framework
- **Vite 7** — Lightning-fast dev server & bundler
- **Excalidraw** — Whiteboard canvas engine
- **Tailwind CSS 4** — Utility-first styling
- **React Router v7** — Client-side routing
- **Socket.io Client** — Real-time communication
- **simple-peer** — WebRTC abstraction for video/audio
- **Lucide React** — Icon library
- **uuid** — Unique room ID generation

### Backend
- **Node.js + Express 5** — REST API server
- **Socket.io** — WebSocket server for real-time events
- **MongoDB + Mongoose 9** — Database & ODM
- **JWT (jsonwebtoken)** — Token-based authentication
- **bcryptjs** — Secure password hashing
- **dotenv** — Environment variable management
- **nodemon** — Hot-reload in development

---

## 📁 Project Structure

```
mern-whiteboard/
├── client/                     # React frontend (Vite)
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── BottomBar.jsx       # Media controls bar
│   │   │   ├── ProtectedRoute.jsx  # Auth route guard
│   │   │   ├── SidebarPanel.jsx    # Chat & participants panel
│   │   │   ├── VideoGrid.jsx       # WebRTC video tiles
│   │   │   └── Whiteboard.jsx      # Excalidraw wrapper
│   │   ├── context/
│   │   │   └── AuthContext.jsx     # Auth state & JWT management
│   │   ├── pages/
│   │   │   ├── Landing.jsx         # Landing page + auth forms
│   │   │   ├── Home.jsx            # Dashboard (create/join room)
│   │   │   ├── PreJoinLobby.jsx    # Lobby & waiting room
│   │   │   ├── Workspace.jsx       # Main collaboration workspace
│   │   │   └── components/         # Page-specific components
│   │   │       ├── Hero.jsx
│   │   │       ├── Features.jsx
│   │   │       ├── FeatureCard.jsx
│   │   │       ├── Navbar.jsx
│   │   │       └── Footer.jsx
│   │   ├── App.jsx             # Root component & routes
│   │   └── main.jsx            # Entry point
│   └── index.html
│
└── server/                     # Express backend
    ├── server.js               # Main server (Express + Socket.io)
    ├── controllers/
    │   └── authController.js   # Signup & login logic
    ├── middleware/
    │   └── ...                 # Auth middleware (JWT verification)
    ├── models/
    │   └── User.js             # Mongoose user schema
    ├── routes/
    │   └── authRoutes.js       # /api/auth endpoints
    └── .env                    # Environment variables
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9
- **MongoDB** — local instance or [MongoDB Atlas](https://www.mongodb.com/atlas) connection string

### 1. Clone the Repository

```bash
git clone https://github.com/<your-username>/mern-whiteboard.git
cd mern-whiteboard
```

### 2. Set Up the Server

```bash
cd server
npm install
```

Create a `.env` file in the `server/` directory:

```env
PORT=5001
MONGO_URI=your_mongodb_connection_string_here
JWT_SECRET=your_jwt_secret_here
```

Start the server:

```bash
npm run dev
```

### 3. Set Up the Client

```bash
cd client
npm install
npm run dev
```

The client will start at **http://localhost:5173** by default.

---

## 🔌 API Endpoints

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/signup` | Register a new user |
| `POST` | `/api/auth/login` | Login & receive JWT token |

### Socket.io Events

<details>
<summary><strong>Lobby Events</strong></summary>

| Event | Direction | Description |
|---|---|---|
| `check_room` | Client → Server | Check if a room exists and has a host |
| `room_status` | Server → Client | Room info (host status, member count) |
| `request_join` | Client → Server | Request to join a room |
| `join_waiting` | Server → Client | Placed in waiting room |
| `join_approved` | Server → Client | Admission approved by host |
| `join_denied` | Server → Client | Admission denied by host |
| `admit_user` | Client → Server | Host admits a waiting user |
| `deny_user` | Client → Server | Host denies a waiting user |

</details>

<details>
<summary><strong>Room & Collaboration Events</strong></summary>

| Event | Direction | Description |
|---|---|---|
| `join_room` | Client → Server | Join a room after approval |
| `user_joined` | Server → Client | A new user entered the room |
| `all_users` | Server → Client | List of existing users in the room |
| `user_disconnected` | Server → Client | A user left the room |
| `whiteboard_update` | Bidirectional | Sync Excalidraw elements |
| `pointer_update` | Bidirectional | Sync cursor position |
| `send_message` | Client → Server | Send a chat message |
| `receive_message` | Server → Client | Receive a chat message |

</details>

<details>
<summary><strong>WebRTC Signaling Events</strong></summary>

| Event | Direction | Description |
|---|---|---|
| `offer` | Bidirectional | WebRTC offer exchange |
| `answer` | Bidirectional | WebRTC answer exchange |
| `media_state_change` | Client → Server | Notify audio/video toggle |
| `media_state_update` | Server → Client | Broadcast media state |

</details>

---

## 🧑‍💻 Usage

1. **Sign up / Log in** on the landing page
2. **Create a room** from the dashboard — you'll receive a unique room ID
3. **Share the room link** with collaborators
4. Collaborators go through the **lobby** — the host admits them
5. Everyone can **draw on the whiteboard**, **chat**, and **video call** simultaneously
6. Changes sync in **real time** across all participants

---

## 🛣️ Roadmap

- [ ] Persistent whiteboard state (save/load from database)
- [ ] Room history & session replay
- [ ] File/image upload to canvas
- [ ] Screen sharing
- [ ] Custom user avatars
- [ ] Dark mode toggle
- [ ] Deployment guides (Docker, Vercel + Railway)

---

## 🤝 Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [ISC License](https://opensource.org/licenses/ISC).

---

<p align="center">
  Built with ❤️ using the MERN Stack
</p>

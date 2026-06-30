const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const dotenv = require("dotenv");
const sequelize = require("./db");
const logger = require("./logger");
const pinoHttp = require("pino-http");
const metricsRoutes = require("./routes/metricsRoutes");
const { activeUsers } = require("./metrics");

require("./models/User");

// Load Environment Variables
dotenv.config();

const app = express();
app.use(
  pinoHttp({
    logger,
    autoLogging: true,
  }),
);
const server = http.createServer(app);

// CORS origins — configurable via env
const allowedOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(",").map((s) => s.trim())
  : ["http://localhost:5173", "http://localhost:5174", "http://localhost:5175"];

// Middleware
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);
app.use(express.json());

// --- REST API Routes ---
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

const healthRoutes = require("./routes/healthRoutes");
app.use("/health", healthRoutes);

// ---Monitering
app.use("/metrics", metricsRoutes);

// Socket.io Setup
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
  },
});

// ─── Child loggers by context ───
const lobbyLog = logger.child({ context: "Lobby" });
const roomLog = logger.child({ context: "Room" });
const signalLog = logger.child({ context: "Signal" });

// ─── State Tracking ───
const userNames = new Map(); // socketId → userName
const roomHosts = new Map(); // roomId → hostSocketId (set when host actually joins room)
const waitingRoom = new Map(); // roomId → [{ socketId, userName }]

// Helper: get the actual host socket that is IN the room
function getActiveHost(roomId) {
  const hostId = roomHosts.get(roomId);
  if (!hostId) return null;
  const roomMembers = io.sockets.adapter.rooms.get(roomId);
  if (roomMembers && roomMembers.has(hostId)) return hostId;
  // Host socket is no longer in the room — find a new one
  if (roomMembers && roomMembers.size > 0) {
    const newHost = Array.from(roomMembers)[0];
    roomHosts.set(roomId, newHost);
    lobbyLog.info(
      { roomId, newHost: userNames.get(newHost) || newHost },
      "Auto-promoted new host",
    );
    return newHost;
  }
  roomHosts.delete(roomId);
  return null;
}

io.on("connection", (socket) => {
  activeUsers.inc();
  logger.info({ socketId: socket.id }, "User connected");

  // ─── Lobby: Check Room Status ───
  socket.on("check_room", ({ roomId }) => {
    const roomMembers = io.sockets.adapter.rooms.get(roomId);
    const memberCount = roomMembers ? roomMembers.size : 0;
    const activeHost = getActiveHost(roomId);
    socket.emit("room_status", {
      roomId,
      hasHost: !!activeHost,
      hostName: activeHost ? userNames.get(activeHost) || "Host" : null,
      memberCount,
    });
  });

  // ─── Lobby: Request to Join ───
  socket.on("request_join", ({ roomId, userName }) => {
    userNames.set(socket.id, userName);

    const roomMembers = io.sockets.adapter.rooms.get(roomId);
    const memberCount = roomMembers ? roomMembers.size : 0;
    const activeHost = getActiveHost(roomId);

    if (memberCount === 0 && !activeHost) {
      // No one in the room — this user is the first one, auto-admit
      lobbyLog.info(
        { roomId, userName },
        "Auto-admitted as first user (will become host)",
      );
      socket.emit("join_approved");
    } else if (activeHost) {
      // Room has an active host — put in waiting room
      const queue = waitingRoom.get(roomId) || [];
      // Prevent duplicate entries
      if (!queue.find((u) => u.socketId === socket.id)) {
        queue.push({ socketId: socket.id, userName });
        waitingRoom.set(roomId, queue);
      }
      lobbyLog.info({ roomId, userName }, "User waiting for approval");
      socket.emit("join_waiting");
      // Notify host (who might be in the workspace)
      io.to(activeHost).emit("join_request", { socketId: socket.id, userName });
    } else {
      // Edge case: room has members but no host — auto-admit
      lobbyLog.info({ roomId, userName }, "Auto-admitted (no active host)");
      socket.emit("join_approved");
    }
  });

  // ─── Host: Admit or Deny (can come from lobby OR workspace) ───
  socket.on("admit_user", ({ roomId, targetSocketId }) => {
    const activeHost = getActiveHost(roomId);
    if (activeHost !== socket.id) {
      lobbyLog.warn(
        { roomId, socketId: socket.id },
        "Non-host tried to admit — denied",
      );
      return;
    }
    const queue = waitingRoom.get(roomId) || [];
    waitingRoom.set(
      roomId,
      queue.filter((u) => u.socketId !== targetSocketId),
    );
    io.to(targetSocketId).emit("join_approved");
    lobbyLog.info(
      { roomId, admitted: userNames.get(targetSocketId) || targetSocketId },
      "Host admitted user",
    );
  });

  socket.on("deny_user", ({ roomId, targetSocketId }) => {
    const activeHost = getActiveHost(roomId);
    if (activeHost !== socket.id) return;
    const queue = waitingRoom.get(roomId) || [];
    waitingRoom.set(
      roomId,
      queue.filter((u) => u.socketId !== targetSocketId),
    );
    io.to(targetSocketId).emit("join_denied");
    lobbyLog.info(
      { roomId, denied: userNames.get(targetSocketId) || targetSocketId },
      "Host denied user",
    );
  });

  // ─── Room: Join Room (after lobby approval) ───
  socket.on("join_room", (data) => {
    const roomId = typeof data === "string" ? data : data.roomId;
    const userName = typeof data === "string" ? null : data.userName;

    if (userName) {
      userNames.set(socket.id, userName);
    }

    socket.join(roomId);
    roomLog.info(
      { roomId, userName: userName || socket.id },
      "User joined room",
    );

    // If no host yet, this user becomes the host
    const activeHost = getActiveHost(roomId);
    if (!activeHost) {
      roomHosts.set(roomId, socket.id);
      roomLog.info({ roomId, host: userName || socket.id }, "User became host");
    }

    // Notify others in the room (include name)
    socket.to(roomId).emit("user_joined", {
      id: socket.id,
      name: userNames.get(socket.id) || null,
    });

    // Get all users in the room to send to the new user (with names)
    const usersInRoom = Array.from(io.sockets.adapter.rooms.get(roomId) || []);
    const existingUsers = usersInRoom
      .filter((id) => id !== socket.id)
      .map((id) => ({ id, name: userNames.get(id) || null }));
    socket.emit("all_users", existingUsers);

    // Send any pending waiting room entries to the new host
    if (roomHosts.get(roomId) === socket.id) {
      const queue = waitingRoom.get(roomId) || [];
      queue.forEach((entry) => {
        socket.emit("join_request", {
          socketId: entry.socketId,
          userName: entry.userName,
        });
      });
    }
  });

  // WebRTC Signaling
  socket.on("offer", (payload) => {
    signalLog.info({ from: socket.id, to: payload.target }, "Offer");
    io.to(payload.target).emit("offer", {
      caller: socket.id,
      signal: payload.signal,
    });
  });

  socket.on("answer", (payload) => {
    signalLog.info({ from: socket.id, to: payload.caller }, "Answer");
    io.to(payload.caller).emit("answer", {
      id: socket.id,
      signal: payload.signal,
    });
  });

  // Excalidraw Sync
  socket.on("whiteboard_update", (data) => {
    socket.to(data.roomId).emit("whiteboard_update", data.elements);
  });

  socket.on("pointer_update", (data) => {
    socket.to(data.roomId).emit("pointer_update", {
      userId: socket.id,
      pointer: data.pointer,
    });
  });

  // Chat Messaging
  socket.on("send_message", (data) => {
    socket.to(data.roomId).emit("receive_message", data);
  });

  // Media State Sync
  socket.on("media_state_change", (data) => {
    socket.to(data.roomId).emit("media_state_update", {
      userId: socket.id,
      video: data.video,
      audio: data.audio,
    });
  });

  socket.on("request_media_states", (data) => {
    socket.to(data.roomId).emit("request_media_states");
  });

  // Handle Disconnect
  socket.on("disconnecting", () => {
    const rooms = Array.from(socket.rooms);
    rooms.forEach((roomId) => {
      if (roomId !== socket.id) {
        socket.to(roomId).emit("user_disconnected", socket.id);

        // If host disconnects, promote next user
        if (roomHosts.get(roomId) === socket.id) {
          const roomMembers = io.sockets.adapter.rooms.get(roomId);
          if (roomMembers) {
            const remaining = Array.from(roomMembers).filter(
              (id) => id !== socket.id,
            );
            if (remaining.length > 0) {
              roomHosts.set(roomId, remaining[0]);
              roomLog.info(
                {
                  roomId,
                  newHost: userNames.get(remaining[0]) || remaining[0],
                },
                "New host promoted",
              );
            } else {
              roomHosts.delete(roomId);
              waitingRoom.delete(roomId);
            }
          } else {
            roomHosts.delete(roomId);
            waitingRoom.delete(roomId);
          }
        }

        // Remove from waiting room
        const queue = waitingRoom.get(roomId) || [];
        waitingRoom.set(
          roomId,
          queue.filter((u) => u.socketId !== socket.id),
        );
      }
    });
  });

  socket.on("disconnect", () => {
    activeUsers.dec();

    logger.info({ socketId: socket.id }, "User disconnected");

    userNames.delete(socket.id);
  });
});

const PORT = process.env.PORT || 5001;

const DATABASE_URL = process.env.DATABASE_URL;

if (DATABASE_URL) {
  sequelize
    .authenticate()
    .then(() => {
      logger.info("PostgreSQL connected successfully");
      return sequelize.sync(); // creates tables if they don't exist
    })
    .then(() => {
      server.listen(PORT, () => {
        logger.info(`Server listening on port ${PORT}`);
      });
    })
    .catch((err) => {
      logger.error({ err }, "PostgreSQL connection error");
      server.listen(PORT, () => {
        logger.info(
          `Server listening on port ${PORT} (no database - auth will NOT work)`,
        );
      });
    });
} else {
  logger.warn(
    "DATABASE_URL not configured — auth routes will NOT work. Set DATABASE_URL in .env",
  );
  server.listen(PORT, () => {
    logger.info(`This Server listening on port ${PORT} (no database)`);
  });
}

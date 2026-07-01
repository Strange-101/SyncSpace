<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React 19" />
  <img src="https://img.shields.io/badge/Node.js-Express_5-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js Express 5" />
  <img src="https://img.shields.io/badge/PostgreSQL-Sequelize-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Socket.io-4-010101?style=for-the-badge&logo=socket.io&logoColor=white" alt="Socket.io 4" />
  <img src="https://img.shields.io/badge/WebRTC-Peer_to_Peer-333333?style=for-the-badge&logo=webrtc&logoColor=white" alt="WebRTC" />
  <img src="https://img.shields.io/badge/Docker-Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker" />
  <img src="https://img.shields.io/badge/Prometheus-Grafana-E6522C?style=for-the-badge&logo=prometheus&logoColor=white" alt="Prometheus" />
  <img src="https://img.shields.io/badge/Vite-7-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite 7" />
</p>

<h1 align="center">SyncSpace</h1>
<p align="center"><strong>Real-time collaborative whiteboard with video calling, lobby management, and production-grade infrastructure</strong></p>

---

SyncSpace is a full-stack collaborative workspace where multiple users can draw together on a shared whiteboard, video call, and chat — all in real time. Built with React, Express, WebRTC, and Socket.IO, it delivers a low-latency collaboration experience backed by a PostgreSQL database, structured Pino logging, Prometheus metrics, Grafana dashboards, and a containerized development environment.

The application demonstrates end-to-end engineering practices: real-time bidirectional communication, peer-to-peer media negotiation, token-based auth with Google OAuth, Docker Compose orchestration, observability through metrics and health endpoints, database backup automation, and a CI pipeline that validates both Docker images on every push.

---

##  Features

### User Features

| Feature | Description |
|---|---|
| **Collaborative Whiteboard** | Real-time drawing powered by Excalidraw with live element synchronization across all participants |
| **Video & Audio Calls** | Peer-to-peer video/audio via WebRTC (`simple-peer`) with mute and camera toggle controls |
| **In-Room Chat** | Text messaging during a session, broadcast to all room participants |
| **Live Cursor Tracking** | See other participants' pointer positions on the whiteboard in real time |

### Authentication

| Feature | Description |
|---|---|
|  **Email / Password Auth** | Secure registration and login with bcrypt password hashing (cost factor 12) |
|  **Google OAuth** | Sign in with Google via both ID token and access token flows |
| ️ **Protected Routes** | Dashboard, lobby, and workspace are auth-gated; unauthenticated users are redirected |
|  **Profile Management** | Update display name, avatar URL, and change password from the profile settings panel |

### Collaboration

| Feature | Description |
|---|---|
|  **Room System** | Create or join rooms with unique IDs; share the link to invite collaborators |
|  **Lobby & Waiting Room** | Users queue in a lobby until the host explicitly admits or denies them |
|  **Host Controls** | First user in a room becomes host automatically; host role is promoted to the next connected user on disconnect |

### Real-Time Communication

| Feature | Description |
|---|---|
| **Socket.IO** | Bidirectional event-based communication for all real-time features |
| **WebRTC Signaling** | Server relays SDP offer/answer pairs to establish direct peer-to-peer media connections |
| **Media State Sync** | Audio and video toggle states are broadcast to all participants immediately |

### DevOps & Infrastructure

| Feature | Description |
|---|---|
|  **Docker Compose** | Five-service stack (PostgreSQL, backend, frontend, Prometheus, Grafana) with health-check dependencies |
|  **Health Check** | `GET /health` returns database connectivity, uptime, environment, and version |
|  **CI Pipeline** | GitHub Actions builds both Docker images, injects secrets, and validates the full Compose stack on every push to `main` |
| ️ **PostgreSQL** | Relational database with Sequelize ORM, UUID primary keys, and `sequelize.sync()` auto-migration |

### Monitoring & Observability

| Feature | Description |
|---|---|
|  **Prometheus Metrics** | `GET /metrics` exposes default Node.js runtime metrics (CPU, memory, event loop lag) plus custom business counters |
|  **Grafana Dashboards** | Pre-wired to Prometheus; visualize application health and business metrics |
|  **Structured Logging** | Pino with `pino-http` logs every HTTP request and Socket.IO event as structured JSON; `pino-pretty` in development |
|  **Business Metrics** | Counters for total logins, total signups, and a gauge for currently connected users |

### Operational Tooling

| Feature | Description |
|---|---|
|  **Database Backup** | `scripts/backup-db.sh` — timestamped `pg_dump` into `backups/` via Docker |
|  **Database Restore** | `scripts/restore-db.sh` — interactive restore with overwrite confirmation |
|  **Service Status** | `scripts/status.sh` — prints container states and live health endpoint response |
|  **Log Tailing** | `scripts/logs.sh <service>` — follows logs for any Compose service |

---

##  Tech Stack

### Frontend

| Technology | Version | Purpose |
|---|---|---|
| React | 19 | UI framework |
| Vite | 7 | Dev server and production bundler |
| Tailwind CSS | 4 | Utility-first styling |
| React Router | 7 | Client-side routing |
| Excalidraw | 0.18 | Whiteboard canvas engine |
| Socket.io Client | 4 | Real-time event transport |
| simple-peer | 9 | WebRTC abstraction for video/audio |
| @react-oauth/google | 0.13 | Google OAuth integration |
| Lucide React | latest | Icon library |
| uuid | 13 | Unique room ID generation |

### Backend

| Technology | Version | Purpose |
|---|---|---|
| Node.js | 22 | Runtime |
| Express | 5 | HTTP server and REST API |
| Socket.IO | 4 | WebSocket server |
| Pino | 10 | Structured JSON logging |
| pino-http | 11 | HTTP request logging middleware |
| prom-client | 15 | Prometheus metrics exposition |
| jsonwebtoken | 9 | JWT signing and verification |
| bcryptjs | 3 | Password hashing |
| google-auth-library | 10 | Google ID token verification |
| dotenv | 17 | Environment variable loading |
| nodemon | 3 | Dev hot-reload |

### Database

| Technology | Version | Purpose |
|---|---|---|
| PostgreSQL | 16 | Primary relational database |
| Sequelize | 6 | ORM with hooks, validations, UUID keys |
| pg | 8 | PostgreSQL driver for Node.js |

### Authentication

| Technology | Purpose |
|---|---|
| JWT (7-day expiry) | Stateless session tokens |
| bcryptjs (cost 12) | Password hashing at rest |
| Google OAuth 2.0 | Third-party sign-in (ID token + access token flows) |

### DevOps

| Technology | Purpose |
|---|---|
| Docker | Container runtime |
| Docker Compose | Multi-service orchestration |
| Nginx (alpine) | Production static file serving for frontend |
| Node.js 22 Alpine | Minimal backend container image |

### Monitoring

| Technology | Purpose |
|---|---|
| Prometheus | Metrics collection and time-series storage |
| Grafana OSS | Metrics visualization and dashboards |
| prom-client | Node.js metrics exposition (default + custom) |

### CI/CD

| Technology | Purpose |
|---|---|
| GitHub Actions | Automated build and validation pipeline |

---

##  Architecture

```mermaid
flowchart TD
    Browser["Browser"]
    React["React 19\nVite Dev Server :5173"]
    Express["Express 5\nSocket.IO :5001"]
    PG["PostgreSQL 16\n:5432"]
    Peer["Remote Peer\nBrowser"]

    Browser -->|HTTP + WebSocket| React
    React -->|REST API + Socket.IO| Express
    Express -->|Sequelize ORM| PG
    React <-->|WebRTC P2P\nvideo / audio| Peer

    subgraph Observability
        Health["GET /health\ndatabase · uptime · version"]
        Metrics["GET /metrics\nPrometheus exposition"]
        Prom["Prometheus :9090\nscrape every 15s"]
        Grafana["Grafana :3000\ndashboards"]
    end

    Express --> Health
    Express --> Metrics
    Metrics -->|scrape| Prom
    Prom --> Grafana
```

---

##  Quick Start

### Prerequisites

- **Node.js** ≥ 18 and **npm** ≥ 9
- **Docker** and **Docker Compose** (for the containerized path)
- **PostgreSQL** 14+ (for the local dev path)

### Local Development (without Docker)

**1. Clone the repository**

```bash
git clone https://github.com/<your-username>/syncspace.git
cd syncspace
```

**2. Start the backend**

```bash
cd server
npm install
```

Create `server/.env` (see [Environment Variables](#environment-variables) below), then:

```bash
npm run dev
# Server starts on http://localhost:5001
```

**3. Start the frontend**

```bash
cd client
npm install
npm run dev
# Frontend starts on http://localhost:5173
```

---

##  Docker Deployment

The Compose file defines five services and wires their startup order through health-check dependencies.

```bash
# Build images and start the full stack
docker compose up --build

# Run in the background
docker compose up --build -d

# Tear down (preserves volumes)
docker compose down

# Tear down and remove all data volumes
docker compose down -v
```

**Services started:**

| Container | Image | Port | Description |
|---|---|---|---|
| `postgres` | `postgres:16-alpine` | `5432` | Primary database with readiness health check |
| `backend` | Built from `./server` | `5001` | Express API + Socket.IO (waits for Postgres healthy) |
| `frontend` | Built from `./client` | `5173` | Vite dev server with hot-reload |
| `prometheus` | `prom/prometheus:latest` | `9090` | Scrapes `/metrics` every 15 seconds |
| `grafana` | `grafana/grafana-oss:latest` | `3000` | Dashboard UI (default credentials: `admin` / `admin`) |

> The backend volume-mounts `./server` into the container so code changes hot-reload via nodemon without rebuilding the image.

---

## ⚙️ Environment Variables

Create `server/.env` before running locally. When using Docker Compose, the same file is injected via `env_file`.

```env
# Server
PORT=5001

# PostgreSQL — local dev
DATABASE_URL=postgresql://syncspace:syncspace@localhost:5432/syncspace

# Set to "true" for hosted providers that require TLS (Supabase, Neon, Render, etc.)
DB_SSL=false

# JWT — use a long random secret in production
JWT_SECRET=change_me_to_a_long_random_secret

# Google OAuth — from https://console.cloud.google.com/
GOOGLE_CLIENT_ID=your_google_client_id_here

# Pino log level: trace | debug | info | warn | error
LOG_LEVEL=info

# CORS — comma-separated allowed frontend origins (optional, defaults to localhost variants)
# CORS_ORIGINS=https://yourapp.com
```

When running with Docker Compose, set `DATABASE_URL` to use the service hostname:

```env
DATABASE_URL=postgresql://syncspace:syncspace@postgres:5432/syncspace
```

**Secrets required by CI** (set in GitHub repository settings → Secrets):

| Secret | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string for CI validation |
| `JWT_SECRET` | JWT signing secret |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |

---

##  API Reference

### Authentication — `/api/auth`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Create a new account (name, email, password) |
| `POST` | `/api/auth/login` | Public | Authenticate with email and password; returns JWT |
| `POST` | `/api/auth/google` | Public | Sign in with Google (`credential` or `access_token`) |
| `GET` | `/api/auth/me` | Bearer JWT | Return the authenticated user's profile |
| `PUT` | `/api/auth/profile` | Bearer JWT | Update display name and/or avatar URL |
| `PUT` | `/api/auth/password` | Bearer JWT | Change password (current password required unless Google-only account) |

All authenticated endpoints expect:
```
Authorization: Bearer <token>
```

Successful auth responses return:
```json
{
  "_id": "uuid",
  "name": "Jane Smith",
  "email": "jane@example.com",
  "avatar": "https://...",
  "token": "eyJ..."
}
```

### Health — `/health`

```
GET /health
```

```json
{
  "status": "healthy",
  "database": { "status": "connected" },
  "timestamp": "2026-06-30T18:00:00.000Z",
  "uptime": 3612.4,
  "environment": "development",
  "version": "1.0.0"
}
```

Returns `200` when the database is reachable. The `status` field will be `"unhealthy"` and `database.status` will be `"disconnected"` when PostgreSQL is unavailable.

### Metrics — `/metrics`

```
GET /metrics
```

Returns Prometheus text-format metrics. Consumed by the Prometheus scraper every 15 seconds.

**Default Node.js metrics** (CPU, memory, GC, event loop lag, active handles, etc.) plus these custom metrics:

| Metric name | Type | Description |
|---|---|---|
| `syncspace_logins_total` | Counter | Incremented on every successful login or Google sign-in |
| `syncspace_signups_total` | Counter | Incremented on every successful registration |
| `syncspace_active_users` | Gauge | Incremented on Socket.IO `connection`, decremented on `disconnect` |

---

##  Socket.IO Events

<details>
<summary><strong>Lobby Events</strong></summary>

| Event | Direction | Description |
|---|---|---|
| `check_room` | Client → Server | Query whether a room has an active host and how many members are present |
| `room_status` | Server → Client | Response with `hasHost`, `hostName`, `memberCount` |
| `request_join` | Client → Server | Request admission to a room by name |
| `join_waiting` | Server → Client | Placed in the waiting queue; a host will respond |
| `join_request` | Server → Host | Notify the host that a user is waiting (`socketId`, `userName`) |
| `join_approved` | Server → Client | Host admitted this user; proceed to join the room |
| `join_denied` | Server → Client | Host denied this user |
| `admit_user` | Client → Server | Host admits a specific waiting user (`targetSocketId`) |
| `deny_user` | Client → Server | Host denies a specific waiting user (`targetSocketId`) |

</details>

<details>
<summary><strong>Room Events</strong></summary>

| Event | Direction | Description |
|---|---|---|
| `join_room` | Client → Server | Formally enter a room after lobby approval |
| `user_joined` | Server → Client | Broadcast when a new participant enters (`id`, `name`) |
| `all_users` | Server → Client | Sent to the joining user with the list of current participants |
| `user_disconnected` | Server → Client | Broadcast when a participant leaves |

</details>

<details>
<summary><strong>Whiteboard & Chat Events</strong></summary>

| Event | Direction | Description |
|---|---|---|
| `whiteboard_update` | Bidirectional | Sync Excalidraw element array to all room members |
| `pointer_update` | Bidirectional | Sync cursor position (`userId`, `pointer`) |
| `send_message` | Client → Server | Send a chat message to the room |
| `receive_message` | Server → Client | Deliver a chat message to room participants |

</details>

<details>
<summary><strong>WebRTC Signaling Events</strong></summary>

| Event | Direction | Description |
|---|---|---|
| `offer` | Bidirectional | Relay an SDP offer from caller to target peer |
| `answer` | Bidirectional | Relay an SDP answer back to the caller |
| `media_state_change` | Client → Server | Notify the room of audio/video toggle (`video`, `audio`) |
| `media_state_update` | Server → Client | Broadcast updated media state to all room participants |
| `request_media_states` | Client → Server | Request current media states from all participants |

</details>

---

##  Monitoring

### Health Endpoint

The health endpoint is used by `scripts/status.sh` and can be used by any external uptime monitor:

```bash
curl http://localhost:5001/health | jq .
```

### Prometheus

Prometheus scrapes the backend every 15 seconds using the configuration in `prometheus/prometheus.yml`:

```yaml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: "syncspace-backend"
    static_configs:
      - targets:
          - backend:5001
```

Access the Prometheus UI at **http://localhost:9090** after starting the Compose stack.

### Grafana

Grafana is available at **http://localhost:3000** with the default credentials `admin` / `admin`.

To build a dashboard:
1. Add Prometheus as a data source (`http://prometheus:9090`)
2. Create panels using the custom metrics below

**Example PromQL queries:**

```promql
# Total logins over time
rate(syncspace_logins_total[5m])

# Currently connected users
syncspace_active_users

# Node.js heap used
nodejs_heap_size_used_bytes

# Event loop lag (p99)
nodejs_eventloop_lag_p99_seconds
```

---

##  Bash Scripts

All scripts are located in the `scripts/` directory. Make them executable once:

```bash
chmod +x scripts/*.sh
```

### `backup-db.sh`

Creates a timestamped PostgreSQL dump and stores it in `backups/`.

```bash
./scripts/backup-db.sh
# Output: backups/syncspace_2026-06-30_21-34-18.sql
```

Internally runs `pg_dump` via `docker compose exec` against the `postgres` service. Safe to run while the stack is live.

### `restore-db.sh`

Restores the database from a backup file. Prompts for confirmation before overwriting data.

```bash
./scripts/restore-db.sh backups/syncspace_2026-06-30_21-34-18.sql
```

Exits cleanly if the file does not exist or if confirmation is declined.

### `status.sh`

Prints the current state of all Compose containers followed by a live call to the health endpoint.

```bash
./scripts/status.sh
```

Requires `jq` for formatted health output. Falls back to a plain error message if the backend is unreachable.

### `logs.sh`

Follows live logs for a specific Compose service.

```bash
./scripts/logs.sh backend
./scripts/logs.sh frontend
./scripts/logs.sh postgres
```

---

##  CI/CD

The pipeline is defined in `.github/workflows/ci.yml` and runs on every push and pull request targeting `main`.

**Steps:**

1. **Checkout** — fetch repository with `actions/checkout@v4`
2. **Build backend image** — `docker build -t syncspace-backend ./server`
3. **Build frontend production image** — `docker build -f client/Dockerfile.prod -t syncspace-frontend ./client` (multi-stage Nginx build)
4. **Create `.env`** — writes `server/.env` from GitHub repository secrets (`DATABASE_URL`, `JWT_SECRET`, `GOOGLE_CLIENT_ID`)
5. **Validate Compose config** — `docker compose config` ensures the YAML and all references are valid
6. **Start stack** — `docker compose up -d`
7. **Verify containers** — `docker compose ps` confirms services are running

The production frontend image (`Dockerfile.prod`) uses a two-stage build: Node.js 22 Alpine compiles the Vite bundle, then Nginx Alpine serves the static output. This image is validated in CI but not currently used by `docker compose up`, which runs the Vite dev server for hot-reload.

---

##  Future Improvements

- **Persistent whiteboard state** — serialize Excalidraw elements to PostgreSQL so rooms retain their canvas between sessions
- **Session replay** — record and replay whiteboard events for asynchronous review
- **Screen sharing** — add a screen-capture track to the existing WebRTC peer connections
- **File and image upload** — drag images onto the canvas, stored in object storage (S3-compatible)
- **Sequelize migrations** — replace `sequelize.sync()` with versioned migration files via `sequelize-cli`
- **Horizontal scaling** — replace the in-process Socket.IO state (Maps) with a Redis adapter for multi-instance deployments
- **Rate limiting** — add `express-rate-limit` on authentication endpoints
- **Refresh tokens** — implement token rotation to reduce the 7-day JWT exposure window
- **End-to-end tests** — Playwright or Cypress coverage for the lobby and workspace flows
- **Production Compose profile** — a separate profile that uses `Dockerfile.prod` for both frontend (Nginx) and backend (no nodemon)

---

##  Contributing

Contributions are welcome. Please open an issue first to discuss the change you want to make.

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'feat: add your feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a pull request against `main`

---

##  License

This project is open source and available under the [ISC License](https://opensource.org/licenses/ISC).

---

<p align="center">Built with React · Express · PostgreSQL · Socket.IO · WebRTC · Docker · Prometheus</p>

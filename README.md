# 💰 Personal Expense Tracker

A full-stack web application designed to help individuals monitor daily expenses, categorize transactions, and visualize spending habits over time. Built with a modern React frontend and a Node.js/Express REST API backed by PostgreSQL and Prisma ORM.

---

## 📑 Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Architecture & Data Flow](#architecture--data-flow)
- [Database Schema](#database-schema)
- [API Reference](#api-reference)
- [Installation & Local Setup](#installation--local-setup)
- [Application Screenshots](#application-screenshots)
- [Future Improvements](#future-improvements)

---

## 🔍 Overview

Managing personal finances often feels cumbersome with spreadsheets or overly complicated enterprise apps. This project provides a clean, responsive, and secure personal expense tracker that focuses on usability:
- Authenticated user accounts with individual private data boundaries
- Dynamic expense management with real-time summary statistics
- Category breakdown bar visualization without external charting overhead
- Category and date-range filtering for financial auditing

---

## ✨ Key Features

- **User Authentication**: Secure account registration and login using JWT (JSON Web Tokens) and bcrypt password hashing (10 salt rounds).
- **Protected Routing**: Client-side navigation guards restricting unauthorized access to private dashboard views.
- **Full Expense CRUD**: Add, inspect, update, and remove expenses seamlessly.
- **Categorization**: Organize purchases by standard categories (Food, Transport, Entertainment, Shopping, Bills, Health, Education, Other).
- **Multiple Currencies**: Record expenses in Japanese yen (JPY) or US dollars (USD); dashboard totals are kept separate by currency.
- **Interactive Dashboard**:
  - Total spending & transaction count metrics.
  - Visual category spending distribution.
  - Category and date range filtering.
- **Responsive UI**: Custom CSS styling with CSS variables, accessible forms, and mobile-friendly viewport adaptations.

---

## 🛠️ Tech Stack

### Frontend
- **React 18** (Component architecture, Hooks: `useState`, `useEffect`)
- **Vite** (Next-generation frontend tooling and rapid bundling)
- **React Router v7** (Client-side routing and protected routes)
- **Axios** (HTTP client with automatic JWT header interceptors)
- **CSS3** (Responsive design, custom properties, flexbox/grid)

### Backend
- **Node.js** & **Express.js** (REST API framework)
- **Prisma ORM** (Type-safe database modeling and migrations)
- **PostgreSQL** (Relational database)
- **JSON Web Tokens (`jsonwebtoken`)** (Stateless authentication)
- **bcryptjs** (One-way password hashing)
- **CORS & dotenv** (Security and environment configuration)

---

## 🏗️ Architecture & Data Flow

The project follows a standard multi-tier client-server pattern:

```
┌─────────────────────────────────┐
│     Client Browser (React)      │
│  - Pages & Components           │
│  - Axios Request Interceptor    │
└────────────────┬────────────────┘
                 │ HTTP / REST (JSON + JWT Bearer)
                 ▼
┌─────────────────────────────────┐
│     Express.js API Server       │
│  - CORS & JSON Body Parsing     │
│  - JWT Auth Middleware          │
│  - Controllers & Validation     │
└────────────────┬────────────────┘
                 │ Prisma ORM Client
                 ▼
┌─────────────────────────────────┐
│       PostgreSQL Database       │
│  - User & Expense Tables        │
└─────────────────────────────────┘
```

1. **Authentication Flow**: When a user logs in, the backend issues a signed JWT containing the user ID. The client stores it in `localStorage`.
2. **Authorized Requests**: Axios automatically injects the token (`Authorization: Bearer <token>`) into every outgoing API request.
3. **Data Isolation**: Express middleware verifies the token and attaches `req.user.userId`. Prisma queries strictly scope all read/write actions to that specific `userId`.

---

## 🗄️ Database Schema

Defined in `backend/prisma/schema.prisma`:

### `User` Model
| Field | Type | Description |
|---|---|---|
| `id` | `Int` | Primary Key, Auto-increment |
| `name` | `String` | Full name of the user |
| `email` | `String` | Unique user email address |
| `password` | `String` | Bcrypt password hash |
| `createdAt` | `DateTime`| Account creation timestamp |
| `expenses` | `Expense[]`| One-to-Many relation with Expense |

### `Expense` Model
| Field | Type | Description |
|---|---|---|
| `id` | `Int` | Primary Key, Auto-increment |
| `title` | `String` | Short title/description of expense |
| `amount` | `Float` | Expense amount in its selected currency |
| `category` | `String` | Category identifier |
| `currency` | `String` | Currency code (`JPY` or `USD`; new expenses default to `JPY`) |
| `date` | `DateTime`| Date of the transaction |
| `description` | `String` | Optional notes |
| `createdAt` | `DateTime`| Record creation timestamp |
| `userId` | `Int` | Foreign Key referencing `User.id` (Cascade delete) |

---

## 🔌 API Reference

### Auth Endpoints (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register new user account | No |
| `POST` | `/api/auth/login` | Authenticate user & return JWT | No |

### Expense Endpoints (`/api/expenses`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/expenses` | Get user expenses (supports `?category=...&startDate=...&endDate=...`) | Yes |
| `GET` | `/api/expenses/summary` | Retrieve totals grouped by currency and category | Yes |
| `GET` | `/api/expenses/:id` | Retrieve single expense by ID | Yes |
| `POST` | `/api/expenses` | Create a new expense | Yes |
| `PUT` | `/api/expenses/:id` | Update an existing expense | Yes |
| `DELETE` | `/api/expenses/:id` | Remove an expense | Yes |

---

## 🚀 Installation & Local Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (v20.19+ or v22.12+ for Vite 8)
- `npm` (bundled with Node.js)
- A PostgreSQL database and its connection URL

### 1. Clone the repository
```bash
git clone https://github.com/ids4225git/expense-track.git
cd expense-track
```

### 2. Set up the Backend
```bash
cd backend
npm install

cp .env.example .env
# Then set DATABASE_URL in .env to your PostgreSQL URL.
# Keep .env private; never commit it.

# Generate Prisma Client and create/update the database tables
npx prisma generate
npx prisma migrate dev

# Start the Express server
npm run dev
```
The backend will run on `http://localhost:3000`.

### 3. Set up the Frontend
Open a new terminal window:
```bash
cd frontend
npm install

cp .env.example .env
# Start Vite development server
npm run dev
```
The frontend will run on `http://localhost:5173`. Open this URL in your browser.

### Run locally with Docker Compose

Install and start Docker Desktop, then from the project root run:

```powershell
docker compose up --build
```

Open `http://localhost:5173`. The API is available at `http://localhost:3000`.
Compose starts PostgreSQL, runs the Prisma migrations, and starts the frontend and
backend. This local setup uses a separate Docker volume; it does not import or alter
the SQLite database in `backend/prisma`.

To access the app from a phone connected to the same Tailscale network, copy the root
`.env.example` to `.env` and set `TAILSCALE_IP` in `.env` to this PC's Tailscale IP.
The root `.env` is ignored by Git; do not commit it. Recreate the services with
`docker compose up -d --force-recreate`, then open
`http://<PC-TAILSCALE-IP>:5173` on the phone. The database is not published to the
host. Keep Tailscale enabled on both devices, and do not expose these ports through
router port forwarding or Tailscale Funnel.

Press `Ctrl+C` to stop the services. Run `docker compose down` to remove the stopped
containers while keeping the PostgreSQL data volume. These credentials are for local
development only and must not be used for a public deployment.

### 5. Deploy a staging environment to Render

1. Create a PostgreSQL database on Render. Copy its connection URL into the backend
   service's `DATABASE_URL` environment variable.
2. Create a backend Web Service with root directory `backend`:
   - Build command: `npm ci && npx prisma generate`
   - Start command: `npx prisma migrate deploy && npm start`
   - Set `DATABASE_URL`, a strong private `JWT_SECRET`, and `FRONTEND_URL` to the
     deployed frontend's origin.
3. Create a frontend Static Site with root directory `frontend`:
   - Build command: `npm ci && npm run build`
   - Publish directory: `dist`
   - Set `VITE_API_URL` to the backend's public URL, without `/api`.
4. After both services have URLs, set `FRONTEND_URL` and `VITE_API_URL` to their
   respective service URLs and redeploy if needed.

Environment variables are configured in Render's service settings, not committed to
Git. `VITE_API_URL` is public browser configuration; never put secrets in `VITE_*`
variables. A new staging database starts empty; the local SQLite database is not
automatically copied.

---

## 📸 Application Screenshots

*(Tip: Take screenshots of your running app and store them in a `/screenshots` folder)*

| View | Description |
|---|---|
| `dashboard.png` | **Dashboard**: Overview cards, category spending chart, and filtered expense list |
| `add-expense.png` | **Expense Form**: Clean input validation and category dropdown |
| `login.png` | **Authentication**: Clean login/register interface with error states |

---

## 🔮 Future Improvements

- [ ] Export transactions to CSV / PDF reports.
- [ ] Monthly budget threshold alerts (e.g. notify when category reaches 80% limit).
- [ ] Recurring expense scheduler (subscriptions, rent).
- [ ] Dark / Light mode UI toggle.
- [ ] Currency conversion with real-time exchange rates.
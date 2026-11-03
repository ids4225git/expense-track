// =============================================================
// SERVER.JS — The Entry Point of the Backend
// =============================================================
// This file creates the Express server, sets up middleware,
// connects all the routes, and starts listening for requests.
//
// Think of this as the "main()" of your backend application.
// =============================================================

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables from .env file FIRST,
// so they're available everywhere in the app.
dotenv.config();

// Import route files (we'll create these next)
const authRoutes = require('./routes/authRoutes');
const expenseRoutes = require('./routes/expenseRoutes');

// Create the Express application
const app = express();

// =============================================================
// MIDDLEWARE
// =============================================================
// Middleware are functions that run BEFORE your route handlers.
// They process every incoming request.

// CORS: Allows the React frontend (running on a different port)
// to make requests to this backend. Without this, the browser
// would block the requests for security reasons.
app.use(cors());

// JSON Parser: Tells Express to automatically parse JSON request
// bodies. Without this, req.body would be undefined.
app.use(express.json());

// =============================================================
// ROUTES
// =============================================================
// Connect our route files to URL paths.
// Any request starting with /api/auth goes to authRoutes.
// Any request starting with /api/expenses goes to expenseRoutes.
app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);

// Simple health check endpoint — useful to verify the server is running
app.get('/', (req, res) => {
  res.json({ message: 'Expense Tracker API is running!' });
});

// =============================================================
// START THE SERVER
// =============================================================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

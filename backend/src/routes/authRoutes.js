// =============================================================
// AUTH ROUTES — URL Definitions for Authentication
// =============================================================
// This file maps URLs to controller functions.
// It's like a directory: "if someone visits THIS url,
// run THIS function."
//
// Routes are simple — they just connect URLs to controllers.
// The actual logic lives in the controller files.
// =============================================================

const express = require('express');
const { register, login } = require('../controllers/authController');

// Create a new router (a mini Express app just for auth routes)
const router = express.Router();

// POST /api/auth/register → runs the register() controller
router.post('/register', register);

// POST /api/auth/login → runs the login() controller
router.post('/login', login);

module.exports = router;

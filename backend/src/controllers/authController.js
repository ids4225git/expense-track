// =============================================================
// AUTH CONTROLLER — Handles Registration and Login
// =============================================================
// Controllers contain the logic for handling requests.
// Each function here receives (req, res) from Express:
//   - req (request): contains the data the client sent
//   - res (response): used to send data back to the client
// =============================================================

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../services/prisma');

// =============================================================
// REGISTER — Create a new user account
// =============================================================
// POST /api/auth/register
// Request body: { name, email, password }
// Response: { message, user: { id, name, email } }
async function register(req, res) {
  try {
    const { name, email, password } = req.body;

    // --- VALIDATION ---
    // Make sure the client sent all required fields
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters.' });
    }

    // Check if a user with this email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ error: 'An account with this email already exists.' });
    }

    // --- HASH THE PASSWORD ---
    // bcrypt.hash() takes the plain password and a "salt rounds" number.
    // Salt rounds (10) means bcrypt will do 2^10 = 1024 rounds of hashing.
    // This makes it extremely slow to crack with brute force.
    const hashedPassword = await bcrypt.hash(password, 10);

    // --- CREATE THE USER ---
    // Prisma creates a new row in the User table and returns it.
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword, // Store the HASH, never the plain password
      },
    });

    // Send back the user info (but NOT the password!)
    res.status(201).json({
      message: 'Account created successfully!',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Something went wrong during registration.' });
  }
}

// =============================================================
// LOGIN — Authenticate and get a JWT token
// =============================================================
// POST /api/auth/login
// Request body: { email, password }
// Response: { message, token, user: { id, name, email } }
async function login(req, res) {
  try {
    const { email, password } = req.body;

    // --- VALIDATION ---
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    // --- FIND THE USER ---
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Don't reveal whether the email exists or not (security best practice)
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // --- CHECK THE PASSWORD ---
    // bcrypt.compare() hashes the provided password and compares it
    // to the stored hash. Returns true if they match.
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // --- CREATE A JWT TOKEN ---
    // jwt.sign() creates a token containing the user's ID.
    // The token expires in 24 hours — after that, the user must log in again.
    const token = jwt.sign(
      { userId: user.id },           // Payload: data stored inside the token
      process.env.JWT_SECRET,         // Secret key used to sign the token
      { expiresIn: '24h' }           // Token expires in 24 hours
    );

    // Send the token and user info back to the frontend
    res.json({
      message: 'Login successful!',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Something went wrong during login.' });
  }
}

module.exports = { register, login };

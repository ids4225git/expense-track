// =============================================================
// AUTH MIDDLEWARE — Protects Routes from Unauthorized Access
// =============================================================
// This middleware runs BEFORE protected route handlers.
// It checks if the request has a valid JWT token.
//
// How it works:
// 1. The frontend sends the JWT in the Authorization header:
//    Authorization: Bearer eyJhbGciOi...
// 2. This middleware extracts and verifies the token.
// 3. If valid, it adds the user's ID to req.user so the
//    controller knows WHO is making the request.
// 4. If invalid, it sends a 401 Unauthorized response.
// =============================================================

const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
  // Get the Authorization header from the request
  const authHeader = req.headers.authorization;

  // Check if the header exists and starts with "Bearer "
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided. Please log in.' });
  }

  // Extract the token (remove "Bearer " prefix)
  const token = authHeader.split(' ')[1];

  try {
    // Verify the token using our secret key.
    // If the token is valid, jwt.verify() returns the payload
    // we put inside when we created it (contains userId).
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the user info to the request object.
    // Now any controller after this middleware can access req.user.userId
    req.user = { userId: decoded.userId };

    // Call next() to pass control to the next middleware or route handler
    next();
  } catch (error) {
    // Token is invalid or expired
    return res.status(401).json({ error: 'Invalid or expired token. Please log in again.' });
  }
}

module.exports = authMiddleware;

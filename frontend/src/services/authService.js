// =============================================================
// AUTH SERVICE — Authentication API Calls
// =============================================================
// This file contains functions that call the auth API endpoints.
// Components import these functions instead of making raw
// HTTP requests. This keeps components clean and focused on UI.
// =============================================================

import api from './api';

// Register a new user
// Sends: POST /api/auth/register with { name, email, password }
// Returns: { message, user }
export async function registerUser(name, email, password) {
  const response = await api.post('/api/auth/register', {
    name,
    email,
    password,
  });
  return response.data;
}

// Log in an existing user
// Sends: POST /api/auth/login with { email, password }
// Returns: { message, token, user }
export async function loginUser(email, password) {
  const response = await api.post('/api/auth/login', {
    email,
    password,
  });
  return response.data;
}

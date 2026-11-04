// =============================================================
// API SERVICE — Central HTTP Client Configuration
// =============================================================
// This file creates a pre-configured Axios instance that all
// our API calls will use. It automatically:
// 1. Points all requests to our backend server
// 2. Attaches the JWT token to every request (if logged in)
//
// Instead of writing the full URL and token logic in every
// component, we configure it once here.
// =============================================================

import axios from 'axios';

const apiBaseUrl = import.meta.env.VITE_API_URL;

if (!apiBaseUrl && !import.meta.env.DEV) {
  throw new Error('VITE_API_URL must be set for production builds.');
}

// Create an Axios instance with a base URL.
// Now instead of axios.get('http://localhost:3000/api/expenses'),
// we just write api.get('/api/expenses').
const api = axios.create({
  baseURL: apiBaseUrl || 'http://localhost:3000',
});

// =============================================================
// REQUEST INTERCEPTOR
// =============================================================
// An interceptor runs automatically before EVERY request.
// Here we check if the user has a token in localStorage,
// and if so, attach it to the Authorization header.
//
// This means components don't need to worry about tokens —
// they just call api.get('/api/expenses') and the token
// is automatically included.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

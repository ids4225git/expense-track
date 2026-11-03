// =============================================================
// EXPENSE SERVICE — Expense API Calls
// =============================================================
// Functions for all expense CRUD operations.
// Each function calls one API endpoint and returns the data.
//
// The JWT token is automatically attached by the api.js
// interceptor, so we don't need to worry about it here.
// =============================================================

import api from './api';

// Get all expenses (with optional filters)
// Sends: GET /api/expenses?category=Food&startDate=2024-01-01
export async function getExpenses(filters = {}) {
  const response = await api.get('/api/expenses', {
    params: filters, // Axios converts this object to URL query params
  });
  return response.data;
}

// Get a single expense by ID
// Sends: GET /api/expenses/:id
export async function getExpense(id) {
  const response = await api.get(`/api/expenses/${id}`);
  return response.data;
}

// Create a new expense
// Sends: POST /api/expenses with expense data in the body
export async function createExpense(expenseData) {
  const response = await api.post('/api/expenses', expenseData);
  return response.data;
}

// Update an existing expense
// Sends: PUT /api/expenses/:id with updated data in the body
export async function updateExpense(id, expenseData) {
  const response = await api.put(`/api/expenses/${id}`, expenseData);
  return response.data;
}

// Delete an expense
// Sends: DELETE /api/expenses/:id
export async function deleteExpense(id) {
  const response = await api.delete(`/api/expenses/${id}`);
  return response.data;
}

// Get spending summary
// Sends: GET /api/expenses/summary
export async function getExpenseSummary() {
  const response = await api.get('/api/expenses/summary');
  return response.data;
}

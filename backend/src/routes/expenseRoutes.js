// =============================================================
// EXPENSE ROUTES — URL Definitions for Expenses
// =============================================================
// All routes here are PROTECTED by the auth middleware.
// This means only logged-in users can access them.
//
// IMPORTANT: The /summary route must come BEFORE /:id
// because Express matches routes top-to-bottom. If /:id came
// first, "summary" would be treated as an ID parameter!
// =============================================================

const express = require('express');
const authMiddleware = require('../middleware/auth');
const {
  getExpenses,
  getExpense,
  createExpense,
  updateExpense,
  deleteExpense,
  getSummary,
} = require('../controllers/expenseController');

const router = express.Router();

// Apply auth middleware to ALL routes in this file.
// This means every request must include a valid JWT token.
router.use(authMiddleware);

// GET /api/expenses/summary — Must be BEFORE /:id (see note above)
router.get('/summary', getSummary);

// GET    /api/expenses      → Get all expenses (with optional filters)
// POST   /api/expenses      → Create a new expense
router.get('/', getExpenses);
router.post('/', createExpense);

// GET    /api/expenses/:id  → Get a single expense
// PUT    /api/expenses/:id  → Update an expense
// DELETE /api/expenses/:id  → Delete an expense
router.get('/:id', getExpense);
router.put('/:id', updateExpense);
router.delete('/:id', deleteExpense);

module.exports = router;

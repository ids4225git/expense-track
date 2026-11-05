// =============================================================
// EXPENSE CONTROLLER — Handles All Expense Operations
// =============================================================
// This is the biggest controller — it handles CRUD operations:
//   C = Create (add a new expense)
//   R = Read   (get expenses)
//   U = Update (edit an expense)
//   D = Delete (remove an expense)
//
// IMPORTANT: Every function uses req.user.userId to ensure
// users can only access THEIR OWN expenses.
// This value is set by the auth middleware.
// =============================================================

const prisma = require('../services/prisma');
const SUPPORTED_CURRENCIES = new Set(['JPY', 'USD']);

// =============================================================
// GET ALL EXPENSES — with optional filtering
// =============================================================
// GET /api/expenses
// Optional query parameters: ?category=Food&startDate=2024-01-01&endDate=2024-12-31
async function getExpenses(req, res) {
  try {
    const userId = req.user.userId;

    // Read optional filter values from the URL query string
    // Example: /api/expenses?category=Food&startDate=2024-01-01
    const { category, startDate, endDate } = req.query;

    // Build the "where" filter object for Prisma
    // We always filter by userId (users only see their own expenses)
    const where = { userId };

    // Add category filter if provided
    if (category) {
      where.category = category;
    }

    // Add date range filter if provided
    if (startDate || endDate) {
      where.date = {};
      if (startDate) {
        where.date.gte = new Date(startDate); // gte = greater than or equal
      }
      if (endDate) {
        where.date.lte = new Date(endDate);   // lte = less than or equal
      }
    }

    // Query the database with our filters, sorted by date (newest first)
    const expenses = await prisma.expense.findMany({
      where,
      orderBy: { date: 'desc' },
    });

    res.json(expenses);
  } catch (error) {
    console.error('Get expenses error:', error);
    res.status(500).json({ error: 'Failed to fetch expenses.' });
  }
}

// =============================================================
// GET SINGLE EXPENSE
// =============================================================
// GET /api/expenses/:id
// The :id is a URL parameter — e.g., /api/expenses/5 means id=5
async function getExpense(req, res) {
  try {
    const userId = req.user.userId;
    const expenseId = parseInt(req.params.id); // URL params are strings, convert to number

    const expense = await prisma.expense.findUnique({
      where: { id: expenseId },
    });

    // Check if expense exists
    if (!expense) {
      return res.status(404).json({ error: 'Expense not found.' });
    }

    // Check if this expense belongs to the logged-in user
    if (expense.userId !== userId) {
      return res.status(403).json({ error: 'You do not have access to this expense.' });
    }

    res.json(expense);
  } catch (error) {
    console.error('Get expense error:', error);
    res.status(500).json({ error: 'Failed to fetch expense.' });
  }
}

// =============================================================
// CREATE EXPENSE
// =============================================================
// POST /api/expenses
// Request body: { title, amount, category, currency, date, description }
async function createExpense(req, res) {
  try {
    const userId = req.user.userId;
    const { title, amount, category, date, description } = req.body;
    const currency = req.body.currency ?? 'JPY';

    // --- VALIDATION ---
    if (!title || !amount || !category || !date) {
      return res.status(400).json({
        error: 'Title, amount, category, and date are required.',
      });
    }

    if (typeof amount !== 'number' || amount <= 0) {
      return res.status(400).json({ error: 'Amount must be a positive number.' });
    }

    if (!SUPPORTED_CURRENCIES.has(currency)) {
      return res.status(400).json({ error: 'Currency must be JPY or USD.' });
    }

    if (currency === 'JPY' && !Number.isInteger(amount)) {
      return res.status(400).json({ error: 'JPY amounts must be whole numbers.' });
    }

    // Create the expense in the database
    const expense = await prisma.expense.create({
      data: {
        title,
        amount,
        category,
        currency,
        date: new Date(date),       // Convert date string to Date object
        description: description || '',
        userId,                     // Link expense to the logged-in user
      },
    });

    res.status(201).json(expense);
  } catch (error) {
    console.error('Create expense error:', error);
    res.status(500).json({ error: 'Failed to create expense.' });
  }
}

// =============================================================
// UPDATE EXPENSE
// =============================================================
// PUT /api/expenses/:id
// Request body: { title, amount, category, currency, date, description }
async function updateExpense(req, res) {
  try {
    const userId = req.user.userId;
    const expenseId = parseInt(req.params.id);
    const { title, amount, category, date, description } = req.body;
    const requestedCurrency = req.body.currency;

    // First, check if the expense exists and belongs to this user
    const existingExpense = await prisma.expense.findUnique({
      where: { id: expenseId },
    });

    if (!existingExpense) {
      return res.status(404).json({ error: 'Expense not found.' });
    }

    if (existingExpense.userId !== userId) {
      return res.status(403).json({ error: 'You do not have access to this expense.' });
    }

    // --- VALIDATION ---
    if (!title || !amount || !category || !date) {
      return res.status(400).json({
        error: 'Title, amount, category, and date are required.',
      });
    }

    if (typeof amount !== 'number' || amount <= 0) {
      return res.status(400).json({ error: 'Amount must be a positive number.' });
    }

    if (requestedCurrency !== undefined && !SUPPORTED_CURRENCIES.has(requestedCurrency)) {
      return res.status(400).json({ error: 'Currency must be JPY or USD.' });
    }

    const currency = requestedCurrency ?? existingExpense.currency;
    if (currency === 'JPY' && !Number.isInteger(amount)) {
      return res.status(400).json({ error: 'JPY amounts must be whole numbers.' });
    }

    // Update the expense in the database
    const updatedExpense = await prisma.expense.update({
      where: { id: expenseId },
      data: {
        title,
        amount,
        category,
        currency,
        date: new Date(date),
        description: description || '',
      },
    });

    res.json(updatedExpense);
  } catch (error) {
    console.error('Update expense error:', error);
    res.status(500).json({ error: 'Failed to update expense.' });
  }
}

// =============================================================
// DELETE EXPENSE
// =============================================================
// DELETE /api/expenses/:id
async function deleteExpense(req, res) {
  try {
    const userId = req.user.userId;
    const expenseId = parseInt(req.params.id);

    // Check ownership before deleting
    const expense = await prisma.expense.findUnique({
      where: { id: expenseId },
    });

    if (!expense) {
      return res.status(404).json({ error: 'Expense not found.' });
    }

    if (expense.userId !== userId) {
      return res.status(403).json({ error: 'You do not have access to this expense.' });
    }

    // Delete the expense from the database
    await prisma.expense.delete({
      where: { id: expenseId },
    });

    res.json({ message: 'Expense deleted successfully.' });
  } catch (error) {
    console.error('Delete expense error:', error);
    res.status(500).json({ error: 'Failed to delete expense.' });
  }
}

// =============================================================
// GET EXPENSE SUMMARY — Spending overview by category
// =============================================================
// GET /api/expenses/summary
// Returns currency-separated totals and category totals.
async function getSummary(req, res) {
  try {
    const userId = req.user.userId;

    // Get all expenses for this user
    const expenses = await prisma.expense.findMany({
      where: { userId },
    });

    const currencyMap = {};
    const categoryMap = {};
    for (const expense of expenses) {
      if (!currencyMap[expense.currency]) {
        currencyMap[expense.currency] = {
          currency: expense.currency,
          totalAmount: 0,
          count: 0,
        };
      }
      currencyMap[expense.currency].totalAmount += expense.amount;
      currencyMap[expense.currency].count += 1;

      const key = `${expense.currency}:${expense.category}`;
      if (!categoryMap[key]) {
        categoryMap[key] = {
          category: expense.category,
          currency: expense.currency,
          total: 0,
          count: 0,
        };
      }
      categoryMap[key].total += expense.amount;
      categoryMap[key].count += 1;
    }

    const totalsByCurrency = Object.values(currencyMap)
      .map((item) => ({
        ...item,
        totalAmount: Math.round(item.totalAmount * 100) / 100,
      }))
      .sort((a, b) => a.currency.localeCompare(b.currency));
    const byCategory = Object.values(categoryMap).sort((a, b) => b.total - a.total);

    res.json({
      totalsByCurrency,
      totalCount: expenses.length,
      byCategory,
    });
  } catch (error) {
    console.error('Summary error:', error);
    res.status(500).json({ error: 'Failed to generate summary.' });
  }
}

module.exports = {
  getExpenses,
  getExpense,
  createExpense,
  updateExpense,
  deleteExpense,
  getSummary,
};

// =============================================================
// DASHBOARD PAGE — Main View After Login
// =============================================================
// Shows:
// - Summary cards (total spending, number of expenses)
// - Category breakdown chart
// - List of recent expenses with filter options
// - Edit and delete buttons for each expense
// =============================================================

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getExpenses, deleteExpense, getExpenseSummary } from '../services/expenseService';
import ExpenseCard from '../components/ExpenseCard';
import CategoryChart from '../components/CategoryChart';
import { formatCurrency } from '../utils/currency';

function DashboardPage() {
  const navigate = useNavigate();

  // State for expenses and summary data
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filter state
  const [categoryFilter, setCategoryFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Categories for the filter dropdown
  const categories = ['Food', 'Transport', 'Entertainment', 'Shopping', 'Bills', 'Health', 'Education', 'Other'];

  // Fetch data when the component loads or filters change
  useEffect(() => {
    fetchData();
  }, [categoryFilter, startDate, endDate]);

  async function fetchData() {
    try {
      setLoading(true);

      // Build filter object (only include non-empty values)
      const filters = {};
      if (categoryFilter) filters.category = categoryFilter;
      if (startDate) filters.startDate = startDate;
      if (endDate) filters.endDate = endDate;

      // Fetch both expenses and summary in parallel
      const [expensesData, summaryData] = await Promise.all([
        getExpenses(filters),
        getExpenseSummary(),
      ]);

      setExpenses(expensesData);
      setSummary(summaryData);
    } catch (err) {
      // If we get a 401, the token is invalid — redirect to login
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('userName');
        navigate('/login');
        return;
      }
      setError('Failed to load expenses.');
    } finally {
      setLoading(false);
    }
  }

  // Handle expense deletion
  async function handleDelete(id) {
    if (!window.confirm('Are you sure you want to delete this expense?')) {
      return;
    }

    try {
      await deleteExpense(id);
      // Refresh the data after deletion
      fetchData();
    } catch (err) {
      setError('Failed to delete expense.');
    }
  }

  // Clear all filters
  function clearFilters() {
    setCategoryFilter('');
    setStartDate('');
    setEndDate('');
  }

  if (loading) {
    return <div className="loading">Loading your expenses...</div>;
  }

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>

      {error && <p className="form-error">{error}</p>}

      {/* Summary Cards */}
      {summary && (
        <div className="summary-cards">
          {summary.totalsByCurrency.map((total) => (
            <div className="summary-card" key={total.currency}>
              <h3>Total Spent ({total.currency})</h3>
              <p className="summary-value">
                {formatCurrency(total.totalAmount, total.currency)}
              </p>
            </div>
          ))}
          <div className="summary-card">
            <h3>Total Expenses</h3>
            <p className="summary-value">{summary.totalCount}</p>
          </div>
          <div className="summary-card">
            <h3>Categories</h3>
            <p className="summary-value">
              {new Set(summary.byCategory.map((item) => item.category)).size}
            </p>
          </div>
        </div>
      )}

      {/* Category Chart */}
      {summary && summary.byCategory.length > 0 && (
        <div className="section">
          <h2>Spending by Category</h2>
          <CategoryChart data={summary.byCategory} />
        </div>
      )}

      {/* Filters */}
      <div className="section">
        <h2>Your Expenses</h2>
        <div className="filters">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="filter-select"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="filter-date"
            placeholder="Start date"
          />

          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="filter-date"
            placeholder="End date"
          />

          {(categoryFilter || startDate || endDate) && (
            <button onClick={clearFilters} className="btn btn-secondary">
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Expense List */}
      <div className="expense-list">
        {expenses.length === 0 ? (
          <div className="empty-state">
            <p>💭 No expenses found.</p>
            <p>Click "Add Expense" to get started!</p>
          </div>
        ) : (
          expenses.map((expense) => (
            <ExpenseCard
              key={expense.id}
              expense={expense}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default DashboardPage;

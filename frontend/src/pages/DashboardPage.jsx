// =============================================================
// DASHBOARD PAGE — Main View After Login
// =============================================================
// Web (900px+):  KPI cards, monthly chart, category breakdown,
//                expense table with filters.
// Mobile:        teal summary card, top 3 categories, expense list.
//
// Totals are always shown for ONE currency at a time (JPY or USD);
// yen and dollars are never added together. The expense list shows
// every expense in its own currency.
// =============================================================

import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getExpenses, deleteExpense, getExpenseSummary } from '../services/expenseService';
import Card from '../components/Card';
import KpiCard from '../components/KpiCard';
import SpendingChart from '../components/SpendingChart';
import CategoryBreakdown from '../components/CategoryBreakdown';
import TransactionTable from '../components/TransactionTable';
import HeroSummary from '../components/HeroSummary';
import TopCategories from '../components/TopCategories';
import Icon from '../components/Icon';
import { Skeleton, EmptyState, ErrorMessage } from '../components/StateViews';
import { CATEGORIES } from '../utils/categories';
import { formatCurrency } from '../utils/currency';
import {
  filterByCurrency,
  getMonthlyTotals,
  getMonthStats,
  getCategoryBreakdown,
  describeChange,
  formatMonthYear,
  getGreeting,
} from '../utils/expenseStats';

// Grey placeholder shapes shown on first load
function DashboardSkeleton() {
  return (
    <div className="page-stack" aria-busy="true">
      <span className="visually-hidden" role="status">Loading your expenses…</span>
      <Skeleton height={56} />
      <div className="kpi-grid">
        <Skeleton height={118} />
        <Skeleton height={118} />
        <Skeleton height={118} />
        <Skeleton height={118} />
      </div>
      <div className="dashboard-row">
        <Skeleton height={320} />
        <Skeleton height={320} />
      </div>
      <Skeleton height={360} />
    </div>
  );
}

function DashboardPage() {
  const navigate = useNavigate();
  const userName = localStorage.getItem('userName');
  // Read the clock once when the page opens
  const [today] = useState(() => new Date());

  // Data from the API
  const [expenses, setExpenses] = useState([]);       // filtered list for the table
  const [allExpenses, setAllExpenses] = useState([]); // unfiltered, for monthly stats
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filter state (sent to the API)
  const [categoryFilter, setCategoryFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  // Search state (filters the loaded list in the browser)
  const [search, setSearch] = useState('');
  // Which currency the totals are shown in
  const [selectedCurrency, setSelectedCurrency] = useState(null);

  // useCallback keeps the same function between renders unless a
  // filter changes, so the useEffect below re-runs only when needed.
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      // Build filter object (only include non-empty values)
      const filters = {};
      if (categoryFilter) filters.category = categoryFilter;
      if (startDate) filters.startDate = startDate;
      if (endDate) filters.endDate = endDate;
      const hasFilters = Object.keys(filters).length > 0;

      // Fetch in parallel. The monthly stats need ALL expenses, so when
      // a filter is active we also load the unfiltered list.
      const [expensesData, summaryData, allData] = await Promise.all([
        getExpenses(filters),
        getExpenseSummary(),
        hasFilters ? getExpenses() : null,
      ]);

      setExpenses(expensesData);
      setSummary(summaryData);
      setAllExpenses(allData ?? expensesData);
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
  }, [categoryFilter, startDate, endDate, navigate]);

  // Fetch data when the page loads or a filter changes
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handle expense deletion
  async function handleDelete(id) {
    if (!window.confirm('Are you sure you want to delete this expense?')) {
      return;
    }

    try {
      await deleteExpense(id);
      // Refresh the data after deletion
      fetchData();
    } catch {
      setError('Failed to delete expense.');
    }
  }

  // Clear all filters and the search box
  function clearFilters() {
    setCategoryFilter('');
    setStartDate('');
    setEndDate('');
    setSearch('');
  }

  // ---------- First load: skeleton, or an error with Retry ----------
  if (!summary) {
    if (loading) return <DashboardSkeleton />;
    return (
      <div className="page-stack">
        <h1 className="page-title">Overview</h1>
        <ErrorMessage message={error || 'Failed to load expenses.'} onRetry={fetchData} />
      </div>
    );
  }

  // ---------- Numbers for the selected currency ----------
  const currencies = summary.totalsByCurrency.map((total) => total.currency);
  const currency = currencies.includes(selectedCurrency)
    ? selectedCurrency
    : currencies.includes('JPY')
      ? 'JPY'
      : currencies[0] || 'JPY';

  const currencyExpenses = filterByCurrency(allExpenses, currency);
  const monthStats = getMonthStats(currencyExpenses, today);
  const monthlyTotals = getMonthlyTotals(currencyExpenses, today);
  const categoryItems = getCategoryBreakdown(summary.byCategory, currency);
  const allTime = summary.totalsByCurrency.find((total) => total.currency === currency);

  // ---------- Expense list after the search box ----------
  const searchText = search.trim().toLowerCase();
  const visibleExpenses = searchText
    ? expenses.filter(
        (expense) =>
          expense.title.toLowerCase().includes(searchText) ||
          expense.description?.toLowerCase().includes(searchText)
      )
    : expenses;
  const hasFilters = Boolean(categoryFilter || startDate || endDate || searchText);

  const daysSoFar = today.getDate();

  return (
    <div className="page-stack">
      {/* Header: greeting + search, currency switch, add button */}
      <header className="page-header">
        <div className="page-heading">
          <span className="page-eyebrow">{formatMonthYear(today)}</span>
          <h1 className="page-title">
            {getGreeting(today)}{userName ? `, ${userName}` : ''}
          </h1>
        </div>
        <div className="header-actions">
          <label className="search-field">
            <Icon name="search" size={16} />
            <input
              type="search"
              placeholder="Search expenses"
              aria-label="Search expenses"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </label>
          {currencies.length > 1 && (
            <div className="segmented" role="group" aria-label="Show totals in">
              {currencies.map((code) => (
                <button
                  key={code}
                  type="button"
                  aria-pressed={code === currency}
                  onClick={() => setSelectedCurrency(code)}
                >
                  {code}
                </button>
              ))}
            </div>
          )}
          <Link to="/add" className="btn btn-primary desktop-only">
            <Icon name="plus" size={16} strokeWidth={2.4} />
            Add expense
          </Link>
        </div>
      </header>

      {/* Error after data was loaded (e.g. a failed delete) */}
      {error && <ErrorMessage message={error} onRetry={fetchData} />}

      {/* Mobile: teal summary + top categories */}
      <HeroSummary stats={monthStats} currency={currency} />
      <TopCategories items={categoryItems} currency={currency} />

      {/* Web: KPI row */}
      <section className="kpi-grid desktop-only" aria-label="Summary">
        <KpiCard
          label="Spent this month"
          value={formatCurrency(monthStats.thisMonth, currency)}
          note={describeChange(monthStats)}
          noteTone={monthStats.change !== null && monthStats.change < 0 ? 'positive' : undefined}
        />
        <KpiCard
          label="Daily average"
          value={formatCurrency(monthStats.dailyAverage, currency)}
          note={`Over ${daysSoFar} ${daysSoFar === 1 ? 'day' : 'days'}`}
        />
        <KpiCard
          label="Expenses this month"
          value={monthStats.count}
          note={`In ${currency}`}
        />
        <KpiCard
          label="All-time total"
          value={formatCurrency(allTime?.totalAmount ?? 0, currency)}
          note={`${allTime?.count ?? 0} ${currency} expenses in total`}
        />
      </section>

      {/* Web: chart + category breakdown */}
      <div className="dashboard-row desktop-only">
        <Card title="Monthly spending" action={<span className="card-meta">{currency}</span>}>
          <SpendingChart months={monthlyTotals} currency={currency} />
        </Card>
        <Card title="By category" action={<span className="card-meta">All time · {currency}</span>}>
          <CategoryBreakdown items={categoryItems} currency={currency} />
        </Card>
      </div>

      {/* Expense list with filters (web table / mobile list) */}
      <Card
        title="Expenses"
        action={
          !loading && (
            <span className="card-meta">
              {visibleExpenses.length} {visibleExpenses.length === 1 ? 'expense' : 'expenses'}
            </span>
          )
        }
      >
        <div className="filters">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="field-control"
            aria-label="Filter by category"
          >
            <option value="">All categories</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <label className="filter-date">
            From
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="field-control"
            />
          </label>

          <label className="filter-date">
            To
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="field-control"
            />
          </label>

          {hasFilters && (
            <button type="button" onClick={clearFilters} className="btn btn-secondary">
              Clear filters
            </button>
          )}
        </div>

        {loading ? (
          <div className="page-stack" aria-busy="true">
            <span className="visually-hidden" role="status">Loading expenses…</span>
            <Skeleton height={48} />
            <Skeleton height={48} />
            <Skeleton height={48} />
          </div>
        ) : visibleExpenses.length > 0 ? (
          <TransactionTable expenses={visibleExpenses} onDelete={handleDelete} />
        ) : hasFilters ? (
          <EmptyState
            title="No expenses match your filters"
            text="Try a different category, date range or search."
            action={
              <button type="button" onClick={clearFilters} className="btn btn-secondary">
                Clear filters
              </button>
            }
          />
        ) : (
          <EmptyState
            title="No expenses yet"
            text="Add your first expense to see your spending here."
            action={
              <Link to="/add" className="btn btn-primary">
                <Icon name="plus" size={16} strokeWidth={2.4} />
                Add expense
              </Link>
            }
          />
        )}
      </Card>
    </div>
  );
}

export default DashboardPage;

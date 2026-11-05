// =============================================================
// EXPENSE STATS — numbers for the dashboard
// =============================================================
// Pure functions: they take the expense list from the API and
// return totals. No API calls, no React — easy to reason about.
//
// Expenses are saved with a date like "2026-11-05T00:00:00.000Z"
// (midnight UTC of the chosen day). We read that date in UTC so
// an expense never slips into the previous day or month because
// of your time zone.
// =============================================================

const MONTH_SHORT = new Intl.DateTimeFormat('en-US', { month: 'short', timeZone: 'UTC' });
const MONTH_LONG = new Intl.DateTimeFormat('en-US', { month: 'long', timeZone: 'UTC' });
const MONTH_YEAR = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' });
const DAY_DATE = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  timeZone: 'UTC',
});

// Turn (year, month) into one number so months are easy to compare:
// Dec 2025 = 24311, Jan 2026 = 24312, ...
function toMonthIndex(year, month) {
  return year * 12 + month;
}

function expenseMonthIndex(expense) {
  const date = new Date(expense.date);
  return toMonthIndex(date.getUTCFullYear(), date.getUTCMonth());
}

function monthName(monthIndex, formatter) {
  const year = Math.floor(monthIndex / 12);
  const month = monthIndex % 12;
  return formatter.format(new Date(Date.UTC(year, month, 1)));
}

// Only the expenses in one currency (we never add yen and dollars together)
export function filterByCurrency(expenses, currency) {
  return expenses.filter((expense) => expense.currency === currency);
}

// Totals for the last `count` months, oldest first, ending with this month.
// Returns [{ key, label: 'Jun', total, isCurrent }, ...]
export function getMonthlyTotals(expenses, today, count = 6) {
  const currentIndex = toMonthIndex(today.getFullYear(), today.getMonth());
  const totals = new Map();

  for (const expense of expenses) {
    const index = expenseMonthIndex(expense);
    totals.set(index, (totals.get(index) || 0) + expense.amount);
  }

  const months = [];
  for (let index = currentIndex - count + 1; index <= currentIndex; index++) {
    months.push({
      key: index,
      label: monthName(index, MONTH_SHORT),
      total: totals.get(index) || 0,
      isCurrent: index === currentIndex,
    });
  }
  return months;
}

// This month's numbers compared with last month.
export function getMonthStats(expenses, today) {
  const currentIndex = toMonthIndex(today.getFullYear(), today.getMonth());
  let thisMonth = 0;
  let lastMonth = 0;
  let count = 0;

  for (const expense of expenses) {
    const index = expenseMonthIndex(expense);
    if (index === currentIndex) {
      thisMonth += expense.amount;
      count += 1;
    } else if (index === currentIndex - 1) {
      lastMonth += expense.amount;
    }
  }

  return {
    thisMonth,
    lastMonth,
    count,
    // Average per day so far this month (today counts as a day)
    dailyAverage: thisMonth / today.getDate(),
    // Change vs last month as a fraction (0.08 = 8% more), or null if no data
    change: lastMonth > 0 ? (thisMonth - lastMonth) / lastMonth : null,
    lastMonthName: monthName(currentIndex - 1, MONTH_LONG),
  };
}

// Category totals for one currency with each category's share of the total.
// `byCategory` comes from GET /api/expenses/summary.
export function getCategoryBreakdown(byCategory, currency) {
  const items = byCategory.filter((item) => item.currency === currency);
  const total = items.reduce((sum, item) => sum + item.total, 0);
  return items
    .map((item) => ({ ...item, share: total > 0 ? item.total / total : 0 }))
    .sort((a, b) => b.total - a.total);
}

// Text like "↓ 8% vs October" for the "spent this month" cards
export function describeChange(stats) {
  if (stats.change === null) {
    return `No spending in ${stats.lastMonthName}`;
  }
  const percent = Math.round(Math.abs(stats.change) * 100);
  if (percent === 0) {
    return `Same as ${stats.lastMonthName}`;
  }
  const arrow = stats.change < 0 ? '↓' : '↑';
  return `${arrow} ${percent}% vs ${stats.lastMonthName}`;
}

export function formatMonthYear(date) {
  return MONTH_YEAR.format(date);
}

export function formatExpenseDate(isoDate) {
  return DAY_DATE.format(new Date(isoDate));
}

export function getGreeting(date) {
  const hour = date.getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

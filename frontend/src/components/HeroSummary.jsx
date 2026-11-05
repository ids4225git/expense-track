// =============================================================
// HERO SUMMARY — teal "spent this month" card (mobile home)
// =============================================================
// Props:
//   - stats:    result of getMonthStats()
//   - currency: 'JPY' | 'USD'
// The design kit shows a budget bar here; the app has no budgets
// yet, so the footer compares with last month instead.
// =============================================================

import { formatCurrency } from '../utils/currency';
import { describeChange } from '../utils/expenseStats';

function HeroSummary({ stats, currency }) {
  return (
    <section className="hero mobile-only" aria-label="This month">
      <span className="hero-label">Spent this month ({currency})</span>
      <span className="hero-amount">{formatCurrency(stats.thisMonth, currency)}</span>
      <div className="hero-footer">
        <span>{describeChange(stats)}</span>
        <span>
          {stats.count} {stats.count === 1 ? 'expense' : 'expenses'}
        </span>
      </div>
    </section>
  );
}

export default HeroSummary;

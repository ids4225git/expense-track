// =============================================================
// SPENDING CHART — monthly bar chart (plain divs, no library)
// =============================================================
// Props:
//   - months:   [{ key, label, total, isCurrent }] from getMonthlyTotals()
//   - currency: 'JPY' | 'USD'
// Past months use the light chart color, the current month the accent.
// =============================================================

import { formatCompactCurrency, formatCurrency } from '../utils/currency';

const MAX_BAR_HEIGHT = 170; // px — leaves room for the value label above

function SpendingChart({ months, currency }) {
  const maxTotal = Math.max(...months.map((month) => month.total));

  if (maxTotal === 0) {
    return <p className="no-data">No {currency} spending in the last {months.length} months.</p>;
  }

  // One sentence for screen readers instead of reading every bar
  const description = months
    .map((month) => `${month.label} ${formatCurrency(month.total, currency)}`)
    .join(', ');

  return (
    <>
      <div className="chart-legend">
        <span className="legend-item">
          <span className="legend-swatch past" />
          Past months
        </span>
        <span className="legend-item">
          <span className="legend-swatch" />
          This month
        </span>
      </div>

      <div className="bar-chart" role="img" aria-label={`Spending per month: ${description}`}>
        {months.map((month) => (
          <div key={month.key} className="bar-col">
            <span className="bar-value">
              {month.total > 0 ? formatCompactCurrency(month.total, currency) : ''}
            </span>
            <div
              className={month.isCurrent ? 'bar current' : 'bar'}
              style={{ height: `${(month.total / maxTotal) * MAX_BAR_HEIGHT}px` }}
            />
          </div>
        ))}
      </div>

      <div className="bar-labels" aria-hidden="true">
        {months.map((month) => (
          <span key={month.key}>{month.label}</span>
        ))}
      </div>
    </>
  );
}

export default SpendingChart;

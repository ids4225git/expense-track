// =============================================================
// CATEGORY BREAKDOWN — stacked bar + list of categories
// =============================================================
// Props:
//   - items:    [{ category, total, count, share }] from getCategoryBreakdown()
//   - currency: 'JPY' | 'USD'
// Replaces the old CategoryChart component.
// =============================================================

import { getCategoryColors } from '../utils/categories';
import { formatCurrency } from '../utils/currency';

function CategoryBreakdown({ items, currency }) {
  if (items.length === 0) {
    return <p className="no-data">No {currency} spending yet.</p>;
  }

  return (
    <>
      <div className="stack-bar" aria-hidden="true">
        {items.map((item) => (
          <div
            key={item.category}
            style={{
              width: `${item.share * 100}%`,
              background: getCategoryColors(item.category).solid,
            }}
          />
        ))}
      </div>

      <ul className="category-list">
        {items.map((item) => (
          <li key={item.category} className="category-row">
            <span
              className="dot"
              style={{ background: getCategoryColors(item.category).solid }}
            />
            <span className="category-name">{item.category}</span>
            <span className="category-share">{Math.round(item.share * 100)}%</span>
            <span className="category-amount">{formatCurrency(item.total, currency)}</span>
          </li>
        ))}
      </ul>
    </>
  );
}

export default CategoryBreakdown;

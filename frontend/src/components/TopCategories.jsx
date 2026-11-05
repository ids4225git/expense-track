// =============================================================
// TOP CATEGORIES — three category tiles (mobile home)
// =============================================================
// Props:
//   - items:    result of getCategoryBreakdown() (sorted, highest first)
//   - currency: 'JPY' | 'USD'
// =============================================================

import { useId } from 'react';
import { getCategoryColors } from '../utils/categories';
import { formatCompactCurrency } from '../utils/currency';

function TopCategories({ items, currency }) {
  const titleId = useId();
  const top = items.slice(0, 3);

  if (top.length === 0) return null;

  return (
    <section className="top-categories mobile-only" aria-labelledby={titleId}>
      <h2 id={titleId} className="section-title">Top categories</h2>
      <div className="top-category-grid">
        {top.map((item) => {
          const colors = getCategoryColors(item.category);
          return (
            <div key={item.category} className="top-category">
              <span className="top-category-icon" style={{ background: colors.tint }}>
                <span className="dot" style={{ background: colors.solid }} />
              </span>
              <span className="top-category-name">{item.category}</span>
              <span className="top-category-amount">
                {formatCompactCurrency(item.total, currency)}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default TopCategories;

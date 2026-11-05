// =============================================================
// CATEGORY CHART COMPONENT — Simple Bar Chart
// =============================================================
// Displays spending by category as a simple CSS-based bar chart.
// No chart library needed — just divs with dynamic widths!
//
// Props:
//   - data: array of { category, currency, total, count } objects
// =============================================================

import { formatCurrency } from '../utils/currency';

function CategoryChart({ data }) {
  if (!data || data.length === 0) {
    return <p className="no-data">No spending data yet.</p>;
  }

  // Colors for different categories
  const categoryColors = {
    Food: '#FF6384',
    Transport: '#36A2EB',
    Entertainment: '#FFCE56',
    Shopping: '#4BC0C0',
    Bills: '#9966FF',
    Health: '#FF9F40',
    Education: '#C9CBCF',
    Other: '#7C8CF8',
  };

  const currencies = [...new Set(data.map((item) => item.currency))].sort();

  return (
    <div className="category-chart">
      {currencies.map((currency) => {
        const currencyData = data.filter((item) => item.currency === currency);
        const maxTotal = Math.max(...currencyData.map((item) => item.total));

        return (
          <div key={currency} className="category-chart-group">
            <h3>{currency}</h3>
            {currencyData.map((item) => (
              <div key={`${currency}-${item.category}`} className="chart-row">
                <span className="chart-label">{item.category}</span>
                <div className="chart-bar-container">
                  <div
                    className="chart-bar"
                    style={{
                      width: `${(item.total / maxTotal) * 100}%`,
                      backgroundColor: categoryColors[item.category] || '#7C8CF8',
                    }}
                  >
                    <span className="chart-value">
                      {formatCurrency(item.total, currency)}
                    </span>
                  </div>
                </div>
                <span className="chart-count">{item.count} items</span>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}

export default CategoryChart;

// =============================================================
// CATEGORY CHART COMPONENT — Simple Bar Chart
// =============================================================
// Displays spending by category as a simple CSS-based bar chart.
// No chart library needed — just divs with dynamic widths!
//
// Props:
//   - data: array of { category, total, count } objects
// =============================================================

function CategoryChart({ data }) {
  if (!data || data.length === 0) {
    return <p className="no-data">No spending data yet.</p>;
  }

  // Find the highest total to calculate relative bar widths
  const maxTotal = Math.max(...data.map((item) => item.total));

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

  return (
    <div className="category-chart">
      {data.map((item) => (
        <div key={item.category} className="chart-row">
          <span className="chart-label">{item.category}</span>
          <div className="chart-bar-container">
            <div
              className="chart-bar"
              style={{
                // Width is proportional to the max value (percentage)
                width: `${(item.total / maxTotal) * 100}%`,
                backgroundColor: categoryColors[item.category] || '#7C8CF8',
              }}
            >
              <span className="chart-value">${item.total.toFixed(2)}</span>
            </div>
          </div>
          <span className="chart-count">{item.count} items</span>
        </div>
      ))}
    </div>
  );
}

export default CategoryChart;

// =============================================================
// KPI CARD — one headline number
// =============================================================
// Props:
//   - label:    small text above the number ("Spent this month")
//   - value:    the number, already formatted ("¥184,320")
//   - note:     small text below (optional)
//   - noteTone: 'positive' (accent) | 'warning' | undefined (muted)
// =============================================================

function KpiCard({ label, value, note, noteTone }) {
  return (
    <div className="card kpi-card">
      <span className="kpi-label">{label}</span>
      <span className="kpi-value">{value}</span>
      {note && <span className={`kpi-note ${noteTone || ''}`.trim()}>{note}</span>}
    </div>
  );
}

export default KpiCard;

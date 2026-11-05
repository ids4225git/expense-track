// =============================================================
// EXPENSE CARD COMPONENT — Displays a Single Expense
// =============================================================
// A reusable card that shows expense details with edit/delete
// buttons. Used in the Dashboard to list expenses.
//
// Props:
//   - expense: the expense object { id, title, amount, ... }
//   - onDelete: function to call when delete is clicked
// =============================================================

import { Link } from 'react-router-dom';
import { formatCurrency } from '../utils/currency';

function ExpenseCard({ expense, onDelete }) {
  // Format the date to a readable string (e.g., "Oct 5, 2024")
  const formattedDate = new Date(expense.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  // Map categories to emoji icons for visual appeal
  const categoryIcons = {
    Food: '🍔',
    Transport: '🚗',
    Entertainment: '🎬',
    Shopping: '🛍️',
    Bills: '📄',
    Health: '🏥',
    Education: '📚',
    Other: '📌',
  };

  const icon = categoryIcons[expense.category] || '📌';

  return (
    <div className="expense-card">
      <div className="expense-card-header">
        <span className="expense-icon">{icon}</span>
        <div className="expense-info">
          <h3 className="expense-title">{expense.title}</h3>
          <p className="expense-category">{expense.category}</p>
        </div>
        <span className="expense-amount">
          {formatCurrency(expense.amount, expense.currency)}
        </span>
      </div>

      <div className="expense-card-body">
        <p className="expense-date">{formattedDate}</p>
        {expense.description && (
          <p className="expense-description">{expense.description}</p>
        )}
      </div>

      <div className="expense-card-actions">
        <Link to={`/edit/${expense.id}`} className="btn btn-edit">
          ✏️ Edit
        </Link>
        <button
          onClick={() => onDelete(expense.id)}
          className="btn btn-delete"
        >
          🗑️ Delete
        </button>
      </div>
    </div>
  );
}

export default ExpenseCard;

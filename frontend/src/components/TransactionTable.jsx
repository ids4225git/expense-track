// =============================================================
// TRANSACTION TABLE — list of expenses with edit / delete
// =============================================================
// Renders two versions of the same data; CSS shows one of them:
//   - web (640px+): a table — expense · category · date · amount · actions
//   - mobile:       a compact list — tap a row to edit it
//
// Props:
//   - expenses: array of expenses from the API
//   - onDelete: function(id) called when Delete is clicked
// Replaces the old ExpenseCard component.
// =============================================================

import { Link } from 'react-router-dom';
import Icon from './Icon';
import { getCategoryColors } from '../utils/categories';
import { formatCurrency } from '../utils/currency';
import { formatExpenseDate } from '../utils/expenseStats';

// Rounded square with the first letter of the title, in category colors
function CategoryTile({ expense }) {
  const colors = getCategoryColors(expense.category);
  return (
    <span
      className="cat-tile"
      style={{ background: colors.tint, color: colors.ink }}
      aria-hidden="true"
    >
      {expense.title.charAt(0).toUpperCase()}
    </span>
  );
}

function TransactionTable({ expenses, onDelete }) {
  return (
    <>
      {/* Web: table */}
      <div className="table-scroll">
        <table className="tx-table">
          <thead>
            <tr>
              <th scope="col">Expense</th>
              <th scope="col">Category</th>
              <th scope="col">Date</th>
              <th scope="col" className="numeric">Amount</th>
              <th scope="col" className="actions">
                <span className="visually-hidden">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense) => (
              <tr key={expense.id}>
                <td>
                  <div className="tx-expense">
                    <CategoryTile expense={expense} />
                    <div className="tx-text">
                      <span className="tx-title">{expense.title}</span>
                      {expense.description && (
                        <span className="tx-sub">{expense.description}</span>
                      )}
                    </div>
                  </div>
                </td>
                <td className="tx-category">{expense.category}</td>
                <td className="tx-date">{formatExpenseDate(expense.date)}</td>
                <td className="numeric tx-amount">
                  {formatCurrency(expense.amount, expense.currency)}
                </td>
                <td className="actions">
                  <Link
                    to={`/edit/${expense.id}`}
                    className="icon-button"
                    aria-label={`Edit ${expense.title}`}
                  >
                    <Icon name="edit" />
                  </Link>
                  <button
                    type="button"
                    className="icon-button danger"
                    aria-label={`Delete ${expense.title}`}
                    onClick={() => onDelete(expense.id)}
                  >
                    <Icon name="trash" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile: list */}
      <ul className="tx-list">
        {expenses.map((expense) => (
          <li key={expense.id} className="tx-row">
            <Link to={`/edit/${expense.id}`} className="tx-row-link">
              <CategoryTile expense={expense} />
              <span className="tx-text">
                <span className="tx-title">{expense.title}</span>
                <span className="tx-sub">
                  {expense.category} · {formatExpenseDate(expense.date)}
                </span>
              </span>
              <span className="tx-amount">
                −{formatCurrency(expense.amount, expense.currency)}
              </span>
            </Link>
            <button
              type="button"
              className="icon-button danger"
              aria-label={`Delete ${expense.title}`}
              onClick={() => onDelete(expense.id)}
            >
              <Icon name="trash" size={16} />
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}

export default TransactionTable;

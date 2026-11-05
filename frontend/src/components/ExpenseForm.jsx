// =============================================================
// EXPENSE FORM COMPONENT — Reusable Add/Edit Form
// =============================================================
// This form is used by both the Add Expense and Edit Expense
// pages. It handles its own form state and validation.
//
// Layout (from the design kit's "Add expense" screen):
//   header (close · title) → big amount → currency switch →
//   category chips → title / note / date fields → Save button
//
// Props:
//   - initialData: pre-filled data for editing (optional)
//   - onSubmit:    function called with form data when submitted
//   - buttonText:  text for the submit button
//   - heading:     title at the top of the form ("New expense")
//   - submitError: error message from the server (optional)
// =============================================================

import { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from './Icon';
import { CATEGORIES, getCategoryColors } from '../utils/categories';
import { CURRENCY_SYMBOLS } from '../utils/currency';

const CURRENCIES = ['JPY', 'USD'];

// Today's date as YYYY-MM-DD in YOUR time zone.
// (toISOString() would use UTC, which in Japan before 9am is yesterday.)
function todayInputValue() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${now.getFullYear()}-${month}-${day}`;
}

// Keep only digits and one decimal point, max 2 decimals: "1,2a3.456" → "123.45"
function cleanAmount(value) {
  const [whole, ...decimals] = value.replace(/[^\d.]/g, '').split('.');
  return decimals.length > 0 ? `${whole}.${decimals.join('').slice(0, 2)}` : whole;
}

function ExpenseForm({
  initialData = {},
  onSubmit,
  buttonText = 'Save',
  heading = 'Expense',
  submitError = '',
}) {
  // Form state — initialize with provided data or empty defaults
  const [title, setTitle] = useState(initialData.title || '');
  const [amount, setAmount] = useState(
    initialData.amount != null ? String(initialData.amount) : ''
  );
  const [currency, setCurrency] = useState(initialData.currency || 'JPY');
  const [category, setCategory] = useState(initialData.category || 'Food');
  const [date, setDate] = useState(() =>
    initialData.date
      ? new Date(initialData.date).toISOString().split('T')[0] // Format as YYYY-MM-DD
      : todayInputValue() // Default to today
  );
  const [description, setDescription] = useState(initialData.description || '');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e) {
    // Prevent the browser from refreshing the page on form submit
    e.preventDefault();
    setError('');

    // Basic validation
    if (!title.trim() || !amount || !date) {
      setError('Title, amount, and date are required.');
      return;
    }

    if (Number(amount) <= 0) {
      setError('Amount must be a positive number.');
      return;
    }

    if (currency === 'JPY' && !Number.isInteger(Number(amount))) {
      setError('Japanese yen amounts must be whole numbers.');
      return;
    }

    // Call the parent's onSubmit with the form data.
    // "saving" disables the button so a double-click can't save twice.
    try {
      setSaving(true);
      await onSubmit({
        title: title.trim(),
        amount: Number(amount),
        currency,
        category,
        date,
        description: description.trim(),
      });
    } finally {
      setSaving(false);
    }
  }

  const shownError = error || submitError;

  return (
    <form onSubmit={handleSubmit} className="card form-sheet" noValidate>
      <header className="form-sheet-header">
        <Link to="/" className="icon-button round" aria-label="Close">
          <Icon name="close" strokeWidth={2.2} />
        </Link>
        <h1 className="form-sheet-title">{heading}</h1>
        <span className="header-spacer" aria-hidden="true" />
      </header>

      {/* Big amount */}
      <div className="amount-field">
        <label htmlFor="amount" className="amount-label">Amount</label>
        <div className={amount ? 'amount-input-row' : 'amount-input-row is-empty'}>
          <span aria-hidden="true">{CURRENCY_SYMBOLS[currency]}</span>
          <input
            id="amount"
            className="amount-input"
            type="text"
            // Phones show a number keyboard (with "." only for dollars)
            inputMode={currency === 'JPY' ? 'numeric' : 'decimal'}
            autoComplete="off"
            value={amount}
            onChange={(e) => setAmount(cleanAmount(e.target.value))}
            placeholder="0"
            style={{ width: `${Math.max(amount.length, 1) + 0.5}ch` }}
          />
        </div>
      </div>

      {/* Currency */}
      <div className="centered-row">
        <div className="segmented" role="group" aria-label="Currency">
          {CURRENCIES.map((code) => (
            <button
              key={code}
              type="button"
              aria-pressed={currency === code}
              onClick={() => setCurrency(code)}
            >
              {CURRENCY_SYMBOLS[code]} {code}
            </button>
          ))}
        </div>
      </div>

      {/* Category chips */}
      <div className="chip-group" role="group" aria-label="Category">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            className="chip"
            aria-pressed={category === cat}
            onClick={() => setCategory(cat)}
          >
            <span className="dot" style={{ background: getCategoryColors(cat).solid }} />
            {cat}
          </button>
        ))}
      </div>

      {/* Title, note and date */}
      <div className="field-group">
        <label className="field-row">
          <span className="field-row-label">Title</span>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Lunch at cafe"
          />
        </label>
        <label className="field-row">
          <span className="field-row-label">Note</span>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Optional"
          />
        </label>
        <label className="field-row">
          <span className="field-row-label">Date</span>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </label>
      </div>

      {shownError && (
        <p className="form-error" role="alert">
          <Icon name="alert" size={16} />
          {shownError}
        </p>
      )}

      <button type="submit" className="btn btn-primary btn-lg btn-block" disabled={saving}>
        {saving ? 'Saving…' : buttonText}
      </button>
    </form>
  );
}

export default ExpenseForm;

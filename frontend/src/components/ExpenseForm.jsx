// =============================================================
// EXPENSE FORM COMPONENT — Reusable Add/Edit Form
// =============================================================
// This form is used by both the Add Expense and Edit Expense
// pages. It handles its own form state and validation.
//
// Props:
//   - initialData: pre-filled data for editing (optional)
//   - onSubmit: function called with form data when submitted
//   - buttonText: text for the submit button
// =============================================================

import { useState } from 'react';

// Predefined categories for the dropdown
const CATEGORIES = [
  'Food',
  'Transport',
  'Entertainment',
  'Shopping',
  'Bills',
  'Health',
  'Education',
  'Other',
];

function ExpenseForm({ initialData = {}, onSubmit, buttonText = 'Save' }) {
  // Form state — initialize with provided data or empty defaults
  const [title, setTitle] = useState(initialData.title || '');
  const [amount, setAmount] = useState(initialData.amount || '');
  const [category, setCategory] = useState(initialData.category || 'Food');
  const [date, setDate] = useState(
    initialData.date
      ? new Date(initialData.date).toISOString().split('T')[0] // Format as YYYY-MM-DD
      : new Date().toISOString().split('T')[0] // Default to today
  );
  const [description, setDescription] = useState(initialData.description || '');
  const [error, setError] = useState('');

  function handleSubmit(e) {
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

    // Call the parent's onSubmit with the form data
    onSubmit({
      title: title.trim(),
      amount: Number(amount),
      category,
      date,
      description: description.trim(),
    });
  }

  return (
    <form onSubmit={handleSubmit} className="expense-form">
      {error && <p className="form-error">{error}</p>}

      <div className="form-group">
        <label htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., Lunch at cafe"
        />
      </div>

      <div className="form-group">
        <label htmlFor="amount">Amount ($)</label>
        <input
          id="amount"
          type="number"
          step="0.01"
          min="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="e.g., 12.50"
        />
      </div>

      <div className="form-group">
        <label htmlFor="category">Category</label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="date">Date</label>
        <input
          id="date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="description">Description (optional)</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add any extra details..."
          rows="3"
        />
      </div>

      <button type="submit" className="btn btn-primary">
        {buttonText}
      </button>
    </form>
  );
}

export default ExpenseForm;

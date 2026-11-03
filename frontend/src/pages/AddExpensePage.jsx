// =============================================================
// ADD EXPENSE PAGE
// =============================================================
// Simple page that renders the ExpenseForm component.
// When the form is submitted, it calls the API to create
// a new expense and redirects back to the Dashboard.
// =============================================================

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ExpenseForm from '../components/ExpenseForm';
import { createExpense } from '../services/expenseService';

function AddExpensePage() {
  const navigate = useNavigate();
  const [error, setError] = useState('');

  async function handleSubmit(formData) {
    try {
      await createExpense(formData);
      navigate('/'); // Go back to dashboard after creating
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create expense.');
    }
  }

  return (
    <div className="page">
      <h1>Add New Expense</h1>
      {error && <p className="form-error">{error}</p>}
      <ExpenseForm onSubmit={handleSubmit} buttonText="Add Expense" />
    </div>
  );
}

export default AddExpensePage;

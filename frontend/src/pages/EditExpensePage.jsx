// =============================================================
// EDIT EXPENSE PAGE
// =============================================================
// Loads an existing expense by ID (from the URL), pre-fills
// the form, and saves updates when submitted.
//
// The expense ID comes from the URL parameter :id
// using React Router's useParams() hook.
// =============================================================

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ExpenseForm from '../components/ExpenseForm';
import { getExpense, updateExpense } from '../services/expenseService';

function EditExpensePage() {
  const navigate = useNavigate();
  const { id } = useParams(); // Get the expense ID from the URL

  const [expense, setExpense] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Load the expense data when the page mounts
  useEffect(() => {
    async function loadExpense() {
      try {
        const data = await getExpense(id);
        setExpense(data);
      } catch (err) {
        setError('Failed to load expense.');
      } finally {
        setLoading(false);
      }
    }
    loadExpense();
  }, [id]);

  async function handleSubmit(formData) {
    try {
      await updateExpense(id, formData);
      navigate('/'); // Go back to dashboard after updating
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update expense.');
    }
  }

  if (loading) {
    return <div className="loading">Loading expense...</div>;
  }

  if (!expense) {
    return <div className="page"><p className="form-error">Expense not found.</p></div>;
  }

  return (
    <div className="page">
      <h1>Edit Expense</h1>
      {error && <p className="form-error">{error}</p>}
      <ExpenseForm
        initialData={expense}
        onSubmit={handleSubmit}
        buttonText="Save Changes"
      />
    </div>
  );
}

export default EditExpensePage;

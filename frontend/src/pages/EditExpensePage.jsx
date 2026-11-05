// =============================================================
// EDIT EXPENSE PAGE
// =============================================================
// Loads an existing expense by ID (from the URL), pre-fills
// the form, and saves updates when submitted.
//
// The expense ID comes from the URL parameter :id
// using React Router's useParams() hook.
// =============================================================

import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import ExpenseForm from '../components/ExpenseForm';
import { Skeleton, ErrorMessage } from '../components/StateViews';
import { getExpense, updateExpense } from '../services/expenseService';

function EditExpensePage() {
  const navigate = useNavigate();
  const { id } = useParams(); // Get the expense ID from the URL

  const [expense, setExpense] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [error, setError] = useState('');

  // Load the expense data (also used by the Retry button)
  const loadExpense = useCallback(async () => {
    try {
      setLoading(true);
      setLoadError('');
      const data = await getExpense(id);
      setExpense(data);
    } catch (err) {
      setLoadError(
        err.response?.status === 404 ? 'Expense not found.' : 'Failed to load expense.'
      );
    } finally {
      setLoading(false);
    }
  }, [id]);

  // Load the expense when the page opens (or the ID in the URL changes)
  useEffect(() => {
    loadExpense();
  }, [loadExpense]);

  async function handleSubmit(formData) {
    try {
      setError('');
      await updateExpense(id, formData);
      navigate('/'); // Go back to dashboard after updating
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update expense.');
    }
  }

  if (loading) {
    return (
      <div className="form-page" aria-busy="true">
        <span className="visually-hidden" role="status">Loading expense…</span>
        <Skeleton height={560} />
      </div>
    );
  }

  if (!expense) {
    const notFound = loadError === 'Expense not found.';
    return (
      <div className="form-page page-stack">
        <ErrorMessage
          message={loadError || 'Expense not found.'}
          onRetry={notFound ? undefined : loadExpense}
        />
        <Link to="/" className="btn btn-secondary">Back to overview</Link>
      </div>
    );
  }

  return (
    <div className="form-page">
      <ExpenseForm
        initialData={expense}
        heading="Edit expense"
        onSubmit={handleSubmit}
        buttonText="Save changes"
        submitError={error}
      />
    </div>
  );
}

export default EditExpensePage;

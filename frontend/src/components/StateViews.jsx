// =============================================================
// STATE VIEWS — loading, empty and error states
// =============================================================
// Skeleton:     grey placeholder block shown while data loads
// EmptyState:   "nothing here yet" message with an optional action
// ErrorMessage: warning-colored message with an optional Retry
// =============================================================

import Icon from './Icon';

export function Skeleton({ height = 120, className = '' }) {
  return (
    <div
      className={`skeleton ${className}`.trim()}
      style={{ height }}
      aria-hidden="true"
    />
  );
}

export function EmptyState({ title, text, action }) {
  return (
    <div className="empty-state">
      <p className="empty-title">{title}</p>
      {text && <p className="empty-text">{text}</p>}
      {action}
    </div>
  );
}

export function ErrorMessage({ message, onRetry }) {
  return (
    <div className="error-message" role="alert">
      <Icon name="alert" />
      <span>{message}</span>
      {onRetry && (
        <button type="button" className="link-button" onClick={onRetry}>
          Retry
        </button>
      )}
    </div>
  );
}

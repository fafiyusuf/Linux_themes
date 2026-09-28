import React from 'react';

export default function ToastContainer({ toasts }) {
  if (toasts.length === 0) return null;
  return (
    <div className="toast-container" aria-live="polite">
      {toasts.map(toast => (
        <div key={toast.id} className={`toast ${toast.type}`}>
          <div className="toast-dot" />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="toast-title">{toast.title}</div>
            <div className="toast-message">{toast.message}</div>
          </div>
          {toast.action && (
            <button
              className="toast-action-btn"
              onClick={toast.action.action}
              aria-label={toast.action.label}
            >
              {toast.action.label}
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

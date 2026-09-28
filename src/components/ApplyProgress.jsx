import React from 'react';

export default function ApplyProgress({ steps }) {
  const done = steps.filter(s => s.status === 'done').length;
  return (
    <div className="apply-bar">
      <div className="apply-spinner" />
      <span className="apply-bar-label">
        Applying — {done}/{steps.length}
      </span>
      <div className="apply-bar-steps">
        {steps.map(step => (
          <span
            key={step.id}
            className={`apply-bar-step ${step.status}`}
          >
            {step.status === 'done' ? '✓ ' : ''}{step.label}
          </span>
        ))}
      </div>
    </div>
  );
}

import React, { useState, useMemo } from 'react';
import ThemeDetail from './ThemeDetail.jsx';

export default function LibraryPage({ themes, appliedTheme, onSelect, onApply, onRemove }) {
  const [selected, setSelected] = useState(appliedTheme || null);
  const selectedTheme = selected ? themes.find(t => t.id === selected.id) || null : null;
  const nonApplied = themes.filter(t => !t.applied);

  if (themes.length === 0) {
    return (
      <>
        <div className="page-header">
          <span className="page-header-title">Installed Themes</span>
        </div>
        <div className="library-layout">
          <div className="empty-state">
            <div className="empty-state-title">No themes installed</div>
            Browse the themes library and install some.
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="page-header">
        <span className="page-header-title">Installed Themes</span>
        <div className="page-header-right" style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
          {themes.length} installed
        </div>
      </div>

      <div className="discover-layout">
        {/* List */}
        <div className="themes-area" style={{ borderRight: '1px solid var(--border)' }}>
          {appliedTheme && (
            <div className="library-section">
              <div className="library-section-header">
                <span className="library-section-title">Currently Applied</span>
              </div>
              <div className="applied-panel">
                <div
                  className="applied-panel-preview"
                  style={{ background: appliedTheme.gradient }}
                />
                <div className="applied-panel-body">
                  <div className="applied-panel-info">
                    <div className="applied-panel-status">Active</div>
                    <div className="applied-panel-name">{appliedTheme.name}</div>
                    <div className="applied-panel-sub">
                      {Object.values(appliedTheme.components).filter(Boolean).length} components active
                      · by {appliedTheme.author}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => setSelected(appliedTheme)}
                    >
                      Details
                    </button>
                    <button
                      id={`lib-remove-${appliedTheme.id}`}
                      className="btn btn-danger btn-sm"
                      onClick={() => onRemove(appliedTheme.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {nonApplied.length > 0 && (
            <div className="library-section">
              <div className="library-section-header">
                <span className="library-section-title">Other Installed</span>
              </div>
              <div className="theme-list">
                {nonApplied.map(theme => (
                  <div
                    key={theme.id}
                    className="theme-row"
                    style={selectedTheme?.id === theme.id ? { background: 'var(--bg-surface)', borderColor: 'var(--border-strong)' } : {}}
                    onClick={() => setSelected(theme)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={e => e.key === 'Enter' && setSelected(theme)}
                  >
                    <div className="theme-row-preview">
                      <div
                        className="theme-row-preview-gradient"
                        style={{ background: theme.gradient }}
                      />
                    </div>
                    <div className="theme-row-info">
                      <div className="theme-row-name">{theme.name}</div>
                      <div className="theme-row-meta">
                        <span>{theme.category}</span>
                        <span className="theme-row-dot">·</span>
                        <span>by {theme.author}</span>
                      </div>
                    </div>
                    <div
                      className="theme-row-actions"
                      onClick={e => e.stopPropagation()}
                    >
                      <button
                        id={`lib-apply-${theme.id}`}
                        className="btn btn-primary btn-sm"
                        onClick={() => onApply(theme.id)}
                      >
                        Apply
                      </button>
                      <button
                        id={`lib-remove-${theme.id}`}
                        className="btn btn-secondary btn-sm"
                        onClick={() => onRemove(theme.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Detail panel */}
        <div className="detail-panel">
          {selectedTheme ? (
            <ThemeDetail
              theme={selectedTheme}
              onApply={onApply}
              onRemove={onRemove}
            />
          ) : (
            <div className="detail-empty">
              <span>Select a theme for details</span>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

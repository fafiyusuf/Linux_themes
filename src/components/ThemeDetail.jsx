import React from 'react';

const COMPONENT_CONFIG = {
  wallpaper: 'Wallpaper',
  colors: 'Colors',
  icons: 'Icons',
  cursor: 'Cursor',
  gtk: 'GTK Theme',
  gnome: 'GNOME Shell',
  terminal: 'Terminal',
};

export default function ThemeDetail({ theme, onInstall, onApply, onRemove }) {
  const colorEntries = Object.entries(theme.colors);
  const componentEntries = Object.entries(theme.components);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Preview hero — wallpaper photo or gradient fallback */}
      <div className="detail-preview" style={{ position: 'relative', overflow: 'hidden' }}>
        {theme.wallpaper ? (
          <img
            src={theme.wallpaper}
            alt={theme.name}
            style={{
              position: 'absolute', inset: 0,
              width: '100%', height: '100%',
              objectFit: 'cover',
              display: 'block',
            }}
            draggable={false}
          />
        ) : (
          <div
            className="detail-preview-gradient"
            style={{ background: theme.gradient }}
          />
        )}
        <div className="detail-preview-overlay" />
      </div>

      {/* Body */}
      <div className="detail-body" style={{ flex: 1, overflowY: 'auto' }}>
        <div className="detail-name">{theme.name}</div>
        <div className="detail-by">
          by {theme.author} · v{theme.version} · {theme.category}
        </div>

        {/* Stats */}
        <div className="detail-stats">
          <div>
            <div className="detail-stat-val">{theme.rating}</div>
            <div className="detail-stat-label">Rating</div>
          </div>
          <div>
            <div className="detail-stat-val">{theme.downloads.toLocaleString()}</div>
            <div className="detail-stat-label">Downloads</div>
          </div>
          <div>
            <div className="detail-stat-val">
              {componentEntries.filter(([, v]) => v).length}/7
            </div>
            <div className="detail-stat-label">Components</div>
          </div>
        </div>

        {/* Description */}
        <div className="detail-section">
          <div className="detail-section-label">Description</div>
          <p className="detail-description">{theme.description}</p>
        </div>

        {/* Color palette */}
        <div className="detail-section">
          <div className="detail-section-label">Colors</div>
          <div className="palette-row">
            {colorEntries.map(([name, hex]) => (
              <div
                key={name}
                className="palette-swatch"
                style={{ background: hex }}
                title={`${name}: ${hex}`}
              />
            ))}
          </div>
        </div>

        {/* Icon preview — only shown when the theme ships icons */}
        {theme.icons && theme.icons.length > 0 && (
          <div className="detail-section">
            <div className="detail-section-label">Icons Preview</div>
            <div className="icon-preview-strip">
              {theme.icons.map(icon => (
                <div key={icon.name} className="icon-preview-item">
                  <img
                    src={icon.src}
                    alt={icon.name}
                    className="icon-preview-img"
                    draggable={false}
                  />
                  <span className="icon-preview-label">{icon.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Components */}
        <div className="detail-section">
          <div className="detail-section-label">Components</div>
          <table className="components-table">
            <tbody>
              {componentEntries.map(([key, supported]) => (
                <tr key={key}>
                  <td>{COMPONENT_CONFIG[key]}</td>
                  <td>
                    {supported
                      ? <span className="comp-check">Included</span>
                      : <span className="comp-no">—</span>
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Actions — fixed at bottom */}
      <div className="detail-actions">
        {theme.applied ? (
          <>
            <button
              className="btn btn-secondary"
              style={{ flex: 1, cursor: 'default', opacity: 0.7 }}
              disabled
            >
              Applied
            </button>
            {onRemove && (
              <button
                id={`detail-remove-${theme.id}`}
                className="btn btn-danger"
                onClick={() => onRemove(theme.id)}
              >
                Remove
              </button>
            )}
          </>
        ) : theme.installed ? (
          <>
            <button
              id={`detail-apply-${theme.id}`}
              className="btn btn-primary"
              style={{ flex: 1 }}
              onClick={() => onApply(theme.id)}
            >
              Apply
            </button>
            {onRemove && (
              <button
                id={`detail-remove-${theme.id}`}
                className="btn btn-danger"
                onClick={() => onRemove(theme.id)}
              >
                Remove
              </button>
            )}
          </>
        ) : (
          <button
            id={`detail-install-${theme.id}`}
            className="btn btn-primary"
            style={{ flex: 1 }}
            onClick={() => onInstall(theme.id)}
          >
            Install
          </button>
        )}
      </div>
    </div>
  );
}

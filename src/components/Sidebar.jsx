import React from 'react';

export default function Sidebar({ page, setPage, installedCount, appliedTheme }) {
  const navItems = [
    { id: 'discover', label: 'Browse', icon: '⊞' },
    { id: 'library', label: 'Installed', icon: '▤', count: installedCount },
    { id: 'settings', label: 'Settings', icon: '⚙' },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo-mark">A</div>
        <span className="sidebar-logo-name">Aura</span>
      </div>

      <nav className="sidebar-nav">
        {navItems.map(item => (
          <button
            key={item.id}
            id={`nav-${item.id}`}
            className={`sidebar-nav-item${page === item.id ? ' active' : ''}`}
            onClick={() => setPage(item.id)}
          >
            <span className="sidebar-nav-icon">{item.icon}</span>
            {item.label}
            {item.count > 0 && (
              <span className="sidebar-nav-count">{item.count}</span>
            )}
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        {appliedTheme ? (
          <div className="sidebar-active-theme">
            <div className="sidebar-active-theme-label">Applied</div>
            <div className="sidebar-active-theme-name">{appliedTheme.name}</div>
            <div className="sidebar-active-theme-swatch">
              {Object.values(appliedTheme.colors).slice(0, 5).map((color, i) => (
                <div
                  key={i}
                  className="swatch-dot"
                  style={{ background: color }}
                  title={color}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="sidebar-no-theme">No theme applied</div>
        )}
      </div>
    </aside>
  );
}

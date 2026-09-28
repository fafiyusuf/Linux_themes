import React, { useState, useMemo } from 'react';
import { categories } from '../data/themes.js';
import ThemeDetail from './ThemeDetail.jsx';

const COMPONENT_LABELS = {
  wallpaper: 'Wallpaper',
  colors: 'Colors',
  icons: 'Icons',
  cursor: 'Cursor',
  gtk: 'GTK',
  gnome: 'GNOME',
  terminal: 'Terminal',
};

const FILTER_GROUPS = [
  {
    label: 'Style',
    items: ['All', 'Featured', 'Dark', 'Light'],
  },
  {
    label: 'Category',
    items: ['Nature', 'Space', 'Synthwave', 'Minimal', 'Warm'],
  },
];

export default function DiscoverPage({ themes, onInstall, onApply }) {
  const [activeFilter, setActiveFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);

  const filtered = useMemo(() => {
    let list = themes;
    if (activeFilter === 'Featured') list = list.filter(t => t.featured);
    else if (activeFilter !== 'All') list = list.filter(t =>
      t.category === activeFilter || t.style.includes(activeFilter)
    );
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(t =>
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.tags.some(tag => tag.includes(q))
      );
    }
    return list;
  }, [themes, activeFilter, search]);

  // Keep selected in sync if themes state changes (e.g. after install)
  const selectedTheme = selected ? themes.find(t => t.id === selected.id) || selected : null;

  return (
    <>
      <div className="page-header">
        <span className="page-header-title">Browse Themes</span>
        <div className="page-header-right">
          <div className="search-wrap">
            <span className="search-icon">⌕</span>
            <input
              id="search-input"
              className="search-input"
              type="text"
              placeholder="Search..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <button className="btn btn-secondary btn-sm" id="import-btn">
            Import .fytheme
          </button>
        </div>
      </div>

      <div className="discover-layout">
        {/* Filter panel — left column */}
        <div className="filter-panel">
          {FILTER_GROUPS.map(group => (
            <div key={group.label} className="filter-panel-section">
              <div className="filter-panel-label">{group.label}</div>
              {group.items.map(item => {
                const count = item === 'All'
                  ? themes.length
                  : item === 'Featured'
                    ? themes.filter(t => t.featured).length
                    : themes.filter(t => t.category === item || t.style.includes(item)).length;
                return (
                  <button
                    key={item}
                    id={`filter-${item.toLowerCase()}`}
                    className={`filter-item${activeFilter === item ? ' active' : ''}`}
                    onClick={() => setActiveFilter(item)}
                  >
                    {item}
                    <span className="filter-count">{count}</span>
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Theme list */}
        <div className="themes-area">
          <div className="themes-area-header">
            <span className="themes-area-title">
              {activeFilter === 'All' ? 'All themes' : activeFilter}
            </span>
            <span className="themes-area-count">{filtered.length} results</span>
          </div>

          {filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-title">No results</div>
              Try a different search or filter.
            </div>
          ) : (
            <div className="theme-list" id="theme-list">
              {filtered.map(theme => (
                <ThemeRow
                  key={theme.id}
                  theme={theme}
                  isSelected={selectedTheme?.id === theme.id}
                  onSelect={() => setSelected(theme)}
                  onInstall={onInstall}
                  onApply={onApply}
                />
              ))}
            </div>
          )}
        </div>

        {/* Detail panel — right column */}
        <div className="detail-panel">
          {selectedTheme ? (
            <ThemeDetail
              theme={selectedTheme}
              onInstall={onInstall}
              onApply={onApply}
            />
          ) : (
            <div className="detail-empty">
              <span>Select a theme to preview</span>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function ThemeRow({ theme, isSelected, onSelect, onInstall, onApply }) {
  const availableComponents = Object.entries(theme.components)
    .filter(([, v]) => v)
    .map(([k]) => COMPONENT_LABELS[k]);

  return (
    <div
      id={`row-${theme.id}`}
      className={`theme-row${theme.applied ? ' applied' : ''}${isSelected ? ' selected' : ''}`}
      onClick={onSelect}
      style={isSelected ? { background: 'var(--bg-surface)', borderColor: 'var(--border-strong)' } : {}}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onSelect()}
    >
      {/* Color preview */}
      <div className="theme-row-preview">
        <div
          className="theme-row-preview-gradient"
          style={{ background: theme.gradient }}
        />
      </div>

      {/* Info */}
      <div className="theme-row-info">
        <div className="theme-row-name">
          {theme.name}
          {theme.applied && <span className="status-tag">Applied</span>}
          {theme.installed && !theme.applied && <span className="status-tag-brand">Installed</span>}
        </div>
        <div className="theme-row-meta">
          <span>{theme.category}</span>
          <span className="theme-row-dot">·</span>
          <span>by {theme.author}</span>
          <span className="theme-row-dot">·</span>
          <span>{theme.downloads.toLocaleString()} downloads</span>
        </div>
        <div className="theme-row-components">
          {availableComponents.map(c => (
            <span key={c} className="comp-tag">{c}</span>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div
        className="theme-row-actions"
        onClick={e => e.stopPropagation()}
      >
        {theme.applied ? null : theme.installed ? (
          <button
            id={`apply-${theme.id}`}
            className="btn btn-primary btn-sm"
            onClick={() => onApply(theme.id)}
          >
            Apply
          </button>
        ) : (
          <button
            id={`install-${theme.id}`}
            className="btn btn-secondary btn-sm"
            onClick={() => onInstall(theme.id)}
          >
            Install
          </button>
        )}
      </div>
    </div>
  );
}

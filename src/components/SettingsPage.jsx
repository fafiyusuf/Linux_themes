import React, { useState, useEffect } from 'react';

export default function SettingsPage({ appliedTheme, engine, onToast }) {
  const [autoBackup, setAutoBackup] = useState(true);
  const [safeMode, setSafeMode] = useState(true);
  const [notifications, setNotifications] = useState(false);
  const [animations, setAnimations] = useState(true);
  const [backups, setBackups] = useState([]);
  const [backupsLoading, setBackupsLoading] = useState(true);

  const { env, envLoading, isElectron } = engine || {};

  // Load backup list on mount
  useEffect(() => {
    if (!engine?.listBackups) { setBackupsLoading(false); return; }
    engine.listBackups()
      .then(list => setBackups(list || []))
      .catch(() => {})
      .finally(() => setBackupsLoading(false));
  }, [engine]);

  // Build env table rows from real data or fallback
  const ENV_INFO = env ? [
    { key: 'Desktop',     val: env.desktop || 'Unknown' },
    { key: 'Session',     val: env.sessionType || 'Unknown' },
    { key: 'GNOME',       val: env.gnomeVersion || 'Not detected' },
    { key: 'GTK',         val: env.gtkVersion || 'Not detected' },
    { key: 'libadwaita',  val: env.libadwaitaVersion || 'Not detected' },
    { key: 'Distribution',val: env.distribution || 'Unknown' },
    { key: 'Kernel',      val: env.kernel || 'Unknown' },
  ] : [
    { key: 'Status', val: envLoading ? 'Detecting…' : 'Not running in Electron' },
  ];

  const caps = env?.capabilities || {};
  const COMPAT = [
    { label: 'Wallpaper',     ok: caps.wallpaper     ?? false },
    { label: 'Accent colors', ok: caps.accentColor   ?? false },
    { label: 'Color scheme',  ok: caps.colorScheme   ?? false },
    { label: 'Icon themes',   ok: caps.iconTheme     ?? false },
    { label: 'Cursor themes', ok: caps.cursorTheme   ?? false },
    { label: 'GTK themes',    ok: caps.gtkTheme      ?? false },
    { label: 'GNOME Shell',   ok: caps.gnomeShell    ?? false },
    { label: 'Terminal',      ok: Array.isArray(caps.terminals) && caps.terminals.length > 0 },
  ];

  return (
    <>
      <div className="page-header">
        <span className="page-header-title">Settings</span>
      </div>

      <div className="settings-layout">

        {/* Environment */}
        <div className="settings-section">
          <div className="settings-section-header">
            <div className="settings-section-title">Environment</div>
          </div>
          <div className="settings-group" style={{ marginTop: '12px', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
            <table className="env-table" style={{ borderTop: '1px solid var(--border)' }}>
              <tbody>
                {ENV_INFO.map(({ key, val }) => (
                  <tr key={key}>
                    <td>{key}</td>
                    <td>{val}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Compatibility */}
        <div className="settings-section">
          <div className="settings-section-header">
            <div className="settings-section-title">Compatibility</div>
          </div>
          <div className="settings-group" style={{ marginTop: '12px', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
            <div className="compat-list" style={{ borderTop: '1px solid var(--border)' }}>
              {COMPAT.map(item => (
                <div key={item.label} className="compat-row">
                  <span className="compat-row-label">{item.label}</span>
                  {item.ok
                    ? <span className="compat-ok">Supported</span>
                    : <span className="compat-na">Not available</span>
                  }
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Theme behavior */}
        <div className="settings-section">
          <div className="settings-section-header">
            <div className="settings-section-title">Theme Behavior</div>
          </div>
          <div className="settings-group">
            <SettingsToggle
              id="toggle-backup"
              label="Auto Backup"
              desc="Save current configuration before applying a new theme"
              value={autoBackup}
              onChange={setAutoBackup}
            />
            <SettingsToggle
              id="toggle-safemode"
              label="Safe Mode"
              desc="Validate theme package before applying"
              value={safeMode}
              onChange={setSafeMode}
            />
            <SettingsToggle
              id="toggle-notifications"
              label="Notifications"
              desc="Show a desktop notification when a theme is applied"
              value={notifications}
              onChange={setNotifications}
            />
            <SettingsToggle
              id="toggle-animations"
              label="Animations"
              desc="Enable UI transitions"
              value={animations}
              onChange={setAnimations}
            />
          </div>
        </div>

        {/* Backup & Rollback */}
        <div className="settings-section">
          <div className="settings-section-header">
            <div className="settings-section-title">Backup &amp; Rollback</div>
          </div>
          <div className="settings-group">
            <div className="settings-row" style={{ gap: '8px', flexWrap: 'wrap' }}>
              <div className="settings-row-info">
                <div className="settings-row-label">Manual Backup</div>
                <div className="settings-row-desc">Save your current desktop state right now</div>
              </div>
              <button
                id="backup-btn"
                className="btn btn-secondary btn-sm"
                onClick={async () => {
                  try {
                    const b = await engine.createBackup('Manual backup');
                    onToast?.('success', 'Backup created', 'Saved snapshot');
                    setBackups(prev => [{ id: b.id, label: b.label || 'Manual backup', timestamp: b.id }, ...prev]);
                  } catch (e) {
                    onToast?.('error', 'Backup failed', e.message);
                  }
                }}
              >
                Create Backup
              </button>
            </div>

            {/* Live backup list */}
            <div style={{ marginTop: '4px' }}>
              {backupsLoading && (
                <div className="settings-row-desc" style={{ padding: '8px 0' }}>Loading backups…</div>
              )}
              {!backupsLoading && backups.length === 0 && (
                <div className="settings-row-desc" style={{ padding: '8px 0', fontStyle: 'italic', opacity: 0.6 }}>
                  No backups yet — one is created automatically before every theme apply.
                </div>
              )}
              {backups.map(b => (
                <div key={b.id} className="settings-row" style={{ padding: '8px 0', gap: '8px', flexWrap: 'wrap', borderTop: '1px solid var(--border)' }}>
                  <div className="settings-row-info" style={{ minWidth: 0 }}>
                    <div className="settings-row-label" style={{ fontSize: '0.82rem' }}>{b.label}</div>
                    <div className="settings-row-desc" style={{ fontSize: '0.72rem', opacity: 0.55 }}>
                      {b.timestamp ? b.timestamp.slice(0, 19).replace('T', ' ') : b.id}
                    </div>
                  </div>
                  <button
                    className="btn btn-danger btn-sm"
                    style={{ fontSize: '0.72rem', padding: '3px 10px', flexShrink: 0 }}
                    onClick={async () => {
                      try {
                        await engine.restoreBackup(b.id);
                        onToast?.('success', 'Restored', `Rolled back to: ${b.label}`);
                      } catch (e) {
                        onToast?.('error', 'Rollback failed', e.message);
                      }
                    }}
                  >
                    Restore
                  </button>
                </div>
              ))}
            </div>

            <div className="settings-row" style={{ gap: '8px', flexWrap: 'wrap', borderTop: '1px solid var(--border)', paddingTop: '12px', marginTop: '4px' }}>
              <div className="settings-row-info">
                <div className="settings-row-label">Diagnostic Log</div>
                <div className="settings-row-desc">Export logs for debugging theme application issues</div>
              </div>
              <button
                id="export-log-btn"
                className="btn btn-secondary btn-sm"
                onClick={async () => {
                  const log = await engine.exportLog();
                  if (!log) { onToast?.('info', 'Log', 'No log data yet.'); return; }
                  const blob = new Blob([log], { type: 'text/plain' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url; a.download = 'aura-log.txt'; a.click();
                  URL.revokeObjectURL(url);
                }}
              >
                Export Log
              </button>
            </div>
          </div>
        </div>

        {/* About */}
        <div className="settings-section">
          <div className="settings-section-header">
            <div className="settings-section-title">About</div>
          </div>
          <div className="settings-group">
            <div className="settings-row">
              <div className="settings-row-info">
                <div className="settings-row-label">Aura</div>
                <div className="settings-row-desc">
                  Version 0.1.0 · GNOME theme manager for Arch Linux
                </div>
              </div>
              <button id="github-btn" className="btn btn-ghost btn-sm">
                GitHub
              </button>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}

function SettingsToggle({ id, label, desc, value, onChange }) {
  return (
    <div className="settings-row">
      <div className="settings-row-info">
        <div className="settings-row-label">{label}</div>
        <div className="settings-row-desc">{desc}</div>
      </div>
      <div
        id={id}
        className={`toggle${value ? ' on' : ''}`}
        role="switch"
        aria-checked={value}
        tabIndex={0}
        onClick={() => onChange(!value)}
        onKeyDown={e => e.key === 'Enter' && onChange(!value)}
      >
        <div className="toggle-thumb" />
      </div>
    </div>
  );
}

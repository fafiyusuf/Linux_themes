import React, { useState } from 'react';

const ENV_INFO = [
  { key: 'Desktop', val: 'GNOME 46' },
  { key: 'Session', val: 'Wayland' },
  { key: 'GTK Version', val: '4.12.3' },
  { key: 'libadwaita', val: '1.4.2' },
  { key: 'Distribution', val: 'Arch Linux' },
  { key: 'Kernel', val: '6.9.3-arch1' },
];

const COMPAT = [
  { label: 'Wallpaper', ok: true },
  { label: 'Accent colors', ok: true },
  { label: 'Icon themes', ok: true },
  { label: 'Cursor themes', ok: true },
  { label: 'GTK themes', ok: true },
  { label: 'GNOME Shell', ok: true },
  { label: 'Terminal', ok: true },
  { label: 'Extensions API', ok: false },
];

export default function SettingsPage({ appliedTheme }) {
  const [autoBackup, setAutoBackup] = useState(true);
  const [safeMode, setSafeMode] = useState(true);
  const [notifications, setNotifications] = useState(false);
  const [animations, setAnimations] = useState(true);

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
            <div className="settings-section-title">Backup & Rollback</div>
          </div>
          <div className="settings-group">
            <div className="settings-row" style={{ gap: '8px', flexWrap: 'wrap' }}>
              <div className="settings-row-info">
                <div className="settings-row-label">Desktop Configuration</div>
                <div className="settings-row-desc">Manage saved backups and restore previous state</div>
              </div>
              <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                <button id="backup-btn" className="btn btn-secondary btn-sm">
                  Create Backup
                </button>
                <button id="rollback-btn" className="btn btn-danger btn-sm">
                  Rollback
                </button>
              </div>
            </div>
            <div className="settings-row" style={{ gap: '8px', flexWrap: 'wrap' }}>
              <div className="settings-row-info">
                <div className="settings-row-label">Diagnostic Log</div>
                <div className="settings-row-desc">Export logs for debugging theme application issues</div>
              </div>
              <button id="export-log-btn" className="btn btn-secondary btn-sm">
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

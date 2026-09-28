import React, { useState, useCallback } from 'react';
import { themes as initialThemes, getInstalledThemes, getAppliedTheme } from './data/themes.js';
import { useEngine } from './hooks/useEngine.js';
import Sidebar from './components/Sidebar.jsx';
import DiscoverPage from './components/DiscoverPage.jsx';
import LibraryPage from './components/LibraryPage.jsx';
import SettingsPage from './components/SettingsPage.jsx';
import ToastContainer from './components/ToastContainer.jsx';
import ApplyProgress from './components/ApplyProgress.jsx';

export default function App() {
  const [page, setPage] = useState('discover');
  const [themes, setThemes] = useState(initialThemes);
  const [toasts, setToasts] = useState([]);
  const [applySteps, setApplySteps] = useState([]);

  const engine = useEngine();

  const addToast = useCallback((type, title, message) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, type, title, message }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  }, []);

  const handleInstall = useCallback((themeId) => {
    const theme = themes.find(t => t.id === themeId);
    setThemes(prev => prev.map(t =>
      t.id === themeId ? { ...t, installed: true, downloads: t.downloads + 1 } : t
    ));
    addToast('success', 'Installed', `"${theme?.name}" added to library.`);
  }, [themes, addToast]);

  const handleApply = useCallback(async (themeId) => {
    const theme = themes.find(t => t.id === themeId);
    if (!theme) return;

    const stepLabels = {
      wallpaper: 'Wallpaper',
      colors: 'Colors',
      icons: 'Icons',
      cursor: 'Cursor',
      gtk: 'GTK',
      gnome: 'GNOME Shell',
      terminal: 'Terminal',
    };

    // Backup step comes first, then all enabled components
    const componentSteps = Object.entries(theme.components)
      .filter(([, v]) => v)
      .map(([k]) => ({ id: k, label: stepLabels[k], status: 'pending' }));

    const allSteps = [
      { id: '__backup__', label: 'Backup', status: 'pending' },
      ...componentSteps,
    ];

    setApplySteps(allSteps);

    let backupId = null;

    try {
      // ── Step 1: Create mandatory backup ───────────────────────────────────
      setApplySteps(prev => prev.map(s =>
        s.id === '__backup__' ? { ...s, status: 'active' } : s
      ));

      try {
        const backup = await engine.createBackup(`Before applying ${theme.name}`);
        backupId = backup.id;
        setApplySteps(prev => prev.map(s =>
          s.id === '__backup__' ? { ...s, status: 'done' } : s
        ));
      } catch (backupErr) {
        // Mark backup failed but don't block the apply — still safer than no backup
        setApplySteps(prev => prev.map(s =>
          s.id === '__backup__' ? { ...s, status: 'error', detail: backupErr.message } : s
        ));
        addToast('error', 'Backup failed', `Could not save backup: ${backupErr.message}`);
        setApplySteps([]);
        return; // Abort: don't apply without a backup
      }

      // ── Step 2: Apply each component with animation ────────────────────────
      const themeDir = theme.localPath || `/themes/${theme.id}`;

      const animateSteps = async () => {
        for (let i = 0; i < componentSteps.length; i++) {
          setApplySteps(prev => prev.map(s =>
            s.id === componentSteps[i].id ? { ...s, status: 'active' } : s
          ));
          await new Promise(r => setTimeout(r, 350));
          setApplySteps(prev => prev.map(s =>
            s.id === componentSteps[i].id ? { ...s, status: 'done' } : s
          ));
        }
      };

      const [applyResult] = await Promise.all([
        engine.applyTheme(themeDir, { id: theme.id, name: theme.name, components: theme.components, style: theme.style }),
        animateSteps(),
      ]);

      // Merge real engine results into step statuses
      if (applyResult?.results) {
        setApplySteps(prev => prev.map(s => {
          if (s.id === '__backup__') return s;
          const r = applyResult.results[s.id];
          if (!r) return s;
          return {
            ...s,
            status: r.status === 'success' ? 'done' : r.status === 'error' ? 'error' : 'done',
            detail: r.message,
          };
        }));
        await new Promise(r => setTimeout(r, 800));
      }

      await new Promise(r => setTimeout(r, 200));
      setApplySteps([]);

      setThemes(prev => prev.map(t => ({
        ...t,
        applied: t.id === themeId,
        installed: t.id === themeId ? true : t.installed,
      })));

      // Show success toast with Undo action
      const resolvedBackupId = backupId ?? (applyResult?.backupId);
      addToast('success', 'Theme applied', `"${theme.name}" is now active.`, resolvedBackupId
        ? { label: 'Undo', action: () => handleRollback(resolvedBackupId, theme.name) }
        : null
      );

    } catch (err) {
      setApplySteps([]);
      addToast('error', 'Apply failed', err.message);
    }
  }, [themes, addToast, engine]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleRollback = useCallback(async (backupId, themeName) => {
    try {
      await engine.restoreBackup(backupId);
      setThemes(prev => prev.map(t => ({ ...t, applied: false })));
      addToast('success', 'Rolled back', `Restored settings from before "${themeName}".`);
    } catch (err) {
      addToast('error', 'Rollback failed', err.message);
    }
  }, [engine, addToast]);

  const handleRemove = useCallback((themeId) => {
    const theme = themes.find(t => t.id === themeId);
    setThemes(prev => prev.map(t =>
      t.id === themeId ? { ...t, installed: false, applied: false } : t
    ));
    addToast('info', 'Removed', `"${theme?.name}" uninstalled.`);
  }, [themes, addToast]);

  const installedThemes = getInstalledThemes(themes);
  const appliedTheme = getAppliedTheme(themes);

  return (
    <div className="app-layout">
      <Sidebar
        page={page}
        setPage={setPage}
        installedCount={installedThemes.length}
        appliedTheme={appliedTheme}
      />
      <main className="main-content">
        {applySteps.length > 0 && (
          <ApplyProgress steps={applySteps} />
        )}
        {page === 'discover' && (
          <DiscoverPage
            themes={themes}
            onInstall={handleInstall}
            onApply={handleApply}
          />
        )}
        {page === 'library' && (
          <LibraryPage
            themes={installedThemes}
            appliedTheme={appliedTheme}
            onApply={handleApply}
            onRemove={handleRemove}
          />
        )}
        {page === 'settings' && (
          <SettingsPage
            appliedTheme={appliedTheme}
            engine={engine}
            onToast={addToast}
          />
        )}
      </main>
      <ToastContainer toasts={toasts} />
    </div>
  );
}

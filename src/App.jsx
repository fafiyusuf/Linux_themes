import React, { useState, useCallback } from 'react';
import { themes as initialThemes, getInstalledThemes, getAppliedTheme } from './data/themes.js';
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

    const steps = Object.entries(theme.components)
      .filter(([, v]) => v)
      .map(([k]) => ({ id: k, label: stepLabels[k], status: 'pending' }));

    setApplySteps(steps);

    for (let i = 0; i < steps.length; i++) {
      setApplySteps(prev => prev.map((s, idx) =>
        idx === i ? { ...s, status: 'active' } : s
      ));
      await new Promise(r => setTimeout(r, 380));
      setApplySteps(prev => prev.map((s, idx) =>
        idx === i ? { ...s, status: 'done' } : s
      ));
    }

    await new Promise(r => setTimeout(r, 350));
    setApplySteps([]);

    setThemes(prev => prev.map(t => ({
      ...t,
      applied: t.id === themeId,
      installed: t.id === themeId ? true : t.installed,
    })));

    addToast('success', 'Theme applied', `"${theme.name}" is now active.`);
  }, [themes, addToast]);

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
          <SettingsPage appliedTheme={appliedTheme} />
        )}
      </main>
      <ToastContainer toasts={toasts} />
    </div>
  );
}

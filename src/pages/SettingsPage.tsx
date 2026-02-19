import { useState } from 'react';
import { Settings, Moon, Sun, Monitor, LayoutGrid, List, Type, Maximize2, Minimize2, Trash2, AlertTriangle, Check } from 'lucide-react';
import { useAppStore } from '../stores/appStore';
import { cn } from '../utils/classNames';

export function SettingsPage() {
  const { theme, settings, setTheme, updateSettings, resetSettings, clearRecentItems, favorites } = useAppStore();
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleClearData = () => {
    clearRecentItems();
    setShowClearConfirm(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Settings className="w-6 h-6 text-sky-500" />
          Settings
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Customize your MedMicro experience
        </p>
      </div>

      <div className="space-y-6 max-w-2xl">
        {/* Appearance */}
        <div className="card p-5">
          <h2 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Monitor className="w-5 h-5 text-sky-500" />
            Appearance
          </h2>

          <div className="space-y-4">
            {/* Theme */}
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                Theme
              </label>
              <div className="flex gap-2">
                <ThemeButton
                  active={theme === 'light'}
                  onClick={() => setTheme('light')}
                  icon={<Sun className="w-4 h-4" />}
                  label="Light"
                />
                <ThemeButton
                  active={theme === 'dark'}
                  onClick={() => setTheme('dark')}
                  icon={<Moon className="w-4 h-4" />}
                  label="Dark"
                />
                <ThemeButton
                  active={theme === 'system'}
                  onClick={() => setTheme('system')}
                  icon={<Monitor className="w-4 h-4" />}
                  label="System"
                />
              </div>
            </div>

            {/* Font Size */}
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                Font Size
              </label>
              <div className="flex gap-2">
                <SizeButton
                  active={settings.fontSize === 'small'}
                  onClick={() => updateSettings({ fontSize: 'small' })}
                  icon={<Type className="w-3 h-3" />}
                  label="Small"
                />
                <SizeButton
                  active={settings.fontSize === 'medium'}
                  onClick={() => updateSettings({ fontSize: 'medium' })}
                  icon={<Type className="w-4 h-4" />}
                  label="Medium"
                />
                <SizeButton
                  active={settings.fontSize === 'large'}
                  onClick={() => updateSettings({ fontSize: 'large' })}
                  icon={<Type className="w-5 h-5" />}
                  label="Large"
                />
              </div>
            </div>
          </div>
        </div>

        {/* View Preferences */}
        <div className="card p-5">
          <h2 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <LayoutGrid className="w-5 h-5 text-sky-500" />
            View Preferences
          </h2>

          <div className="space-y-4">
            {/* Default View */}
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                Default View
              </label>
              <div className="flex gap-2">
                <ViewButton
                  active={settings.defaultView === 'grid'}
                  onClick={() => updateSettings({ defaultView: 'grid' })}
                  icon={<LayoutGrid className="w-4 h-4" />}
                  label="Grid"
                />
                <ViewButton
                  active={settings.defaultView === 'list'}
                  onClick={() => updateSettings({ defaultView: 'list' })}
                  icon={<List className="w-4 h-4" />}
                  label="List"
                />
              </div>
            </div>

            {/* Compact Mode */}
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium text-slate-900 dark:text-white">Compact Mode</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Show more content with less padding
                </p>
              </div>
              <button
                onClick={() => updateSettings({ compactMode: !settings.compactMode })}
                className={cn(
                  'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                  settings.compactMode ? 'bg-sky-500' : 'bg-slate-200 dark:bg-slate-700'
                )}
              >
                <span
                  className={cn(
                    'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                    settings.compactMode ? 'translate-x-6' : 'translate-x-1'
                  )}
                />
              </button>
            </div>

            {/* Show Quick Flags */}
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium text-slate-900 dark:text-white">Show Quick Flags</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Display quick flags on medication cards
                </p>
              </div>
              <button
                onClick={() => updateSettings({ showQuickFlags: !settings.showQuickFlags })}
                className={cn(
                  'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                  settings.showQuickFlags ? 'bg-sky-500' : 'bg-slate-200 dark:bg-slate-700'
                )}
              >
                <span
                  className={cn(
                    'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                    settings.showQuickFlags ? 'translate-x-6' : 'translate-x-1'
                  )}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Data Management */}
        <div className="card p-5">
          <h2 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Trash2 className="w-5 h-5 text-sky-500" />
            Data Management
          </h2>

          <div className="space-y-4">
            {/* Clear Recent Items */}
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium text-slate-900 dark:text-white">Clear History</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Remove all recently viewed items
                </p>
              </div>
              <button
                onClick={() => setShowClearConfirm(true)}
                className="btn-secondary text-sm text-red-600 dark:text-red-400"
              >
                <Trash2 className="w-4 h-4" />
                Clear
              </button>
            </div>

            {/* Stats */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    {favorites.length}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Favorites</p>
                </div>
                <div className="text-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">-</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Notes</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reset */}
        <div className="card p-5">
          <h2 className="font-semibold text-slate-900 dark:text-white mb-4">
            Reset Settings
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
            Restore all settings to their default values. This will not delete your favorites or notes.
          </p>
          <button onClick={resetSettings} className="btn-secondary text-sm">
            Reset to Defaults
          </button>
        </div>

        {/* About */}
        <div className="card p-5">
          <h2 className="font-semibold text-slate-900 dark:text-white mb-2">
            About MedMicro
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Version 2.0.0
          </p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">
            A clinical reference tool for medical residents. Not a substitute for clinical judgment.
          </p>
        </div>
      </div>

      {/* Clear Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl p-6 max-w-sm w-full animate-slide-up">
            <div className="flex items-center gap-3 text-amber-500 mb-4">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="font-semibold text-slate-900 dark:text-white">
                Clear History?
              </h3>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
              This will permanently delete all your recently viewed items. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleClearData}
                className="flex-1 btn bg-red-500 hover:bg-red-600 text-white"
              >
                <Trash2 className="w-4 h-4" />
                Clear
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface ThemeButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

function ThemeButton({ active, onClick, icon, label }: ThemeButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all',
        active
          ? 'border-sky-500 bg-sky-50 dark:bg-sky-900/20 text-sky-700 dark:text-sky-300'
          : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
      )}
    >
      {icon}
      <span className="text-sm font-medium">{label}</span>
      {active && <Check className="w-4 h-4 ml-auto" />}
    </button>
  );
}

interface SizeButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

function SizeButton({ active, onClick, icon, label }: SizeButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all',
        active
          ? 'border-sky-500 bg-sky-50 dark:bg-sky-900/20 text-sky-700 dark:text-sky-300'
          : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
      )}
    >
      {icon}
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
}

interface ViewButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

function ViewButton({ active, onClick, icon, label }: ViewButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all',
        active
          ? 'border-sky-500 bg-sky-50 dark:bg-sky-900/20 text-sky-700 dark:text-sky-300'
          : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
      )}
    >
      {icon}
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
}

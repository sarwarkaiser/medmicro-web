import { useEffect } from 'react';
import { useAppStore } from '../stores/appStore';
import { Navigation } from './Navigation';
import { SearchBar } from './SearchBar';
import { cn } from '../utils/classNames';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { theme, settings } = useAppStore();

  // Apply theme
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
  }, [theme]);

  // Apply font size
  useEffect(() => {
    const root = window.document.documentElement;
    root.style.fontSize =
      settings.fontSize === 'small' ? '14px' : settings.fontSize === 'large' ? '18px' : '16px';
  }, [settings.fontSize]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-200">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-teal-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                M
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">MedMicro</h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">Clinical Reference</p>
              </div>
            </div>

            {/* Search */}
            <div className="flex-1 max-w-xl">
              <SearchBar />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          {/* Sidebar Navigation */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24">
              <Navigation />
            </div>
          </aside>

          {/* Page Content */}
          <main className={cn('flex-1 min-w-0', settings.compactMode ? 'max-w-4xl' : '')}>
            <div className="animate-fade-in">{children}</div>
          </main>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 z-50">
        <MobileNavigation />
      </div>
    </div>
  );
}

function ThemeToggle() {
  const { theme, toggleTheme } = useAppStore();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
      title={`Theme: ${theme}`}
    >
      {theme === 'dark' ? (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
      ) : theme === 'light' ? (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      ) : (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      )}
    </button>
  );
}

function MobileNavigation() {
  const navItems = [
    { id: 'medications', label: 'Meds', icon: '💊' },
    { id: 'guidelines', label: 'Guidelines', icon: '📚' },
    { id: 'criteria', label: 'DSM-5', icon: '📋' },
    { id: 'calculators', label: 'Tools', icon: '🧮' },
    { id: 'favorites', label: 'Saved', icon: '⭐' },
  ];

  const currentPath = window.location.pathname;

  return (
    <nav className="flex justify-around py-2">
      {navItems.map((item) => {
        const isActive = currentPath.includes(item.id);
        return (
          <a
            key={item.id}
            href={`/${item.id}`}
            className={cn(
              'flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-colors',
              isActive
                ? 'text-sky-600 dark:text-sky-400'
                : 'text-slate-500 dark:text-slate-400'
            )}
          >
            <span className="text-lg">{item.icon}</span>
            <span className="text-xs font-medium">{item.label}</span>
          </a>
        );
      })}
    </nav>
  );
}

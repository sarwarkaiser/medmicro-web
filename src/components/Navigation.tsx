import { useState } from 'react';
import {
  Pill,
  BookOpen,
  ClipboardList,
  Calculator,
  Star,
  Clock,
  ChevronDown,
  Activity,
  AlertTriangle,
  Settings,
} from 'lucide-react';
import { cn } from '../utils/classNames';
import { useAppStore } from '../stores/appStore';
import { medicationClasses, indications } from '../data/medications';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  href: string;
  badge?: string;
}

const mainNavItems: NavItem[] = [
  { id: 'medications', label: 'Medications', icon: <Pill className="w-5 h-5" />, href: '/medications' },
  { id: 'guidelines', label: 'Guidelines', icon: <BookOpen className="w-5 h-5" />, href: '/guidelines' },
  { id: 'criteria', label: 'DSM-5 Criteria', icon: <ClipboardList className="w-5 h-5" />, href: '/criteria' },
  { id: 'calculators', label: 'Calculators', icon: <Calculator className="w-5 h-5" />, href: '/calculators' },
  { id: 'interactions', label: 'Drug Interactions', icon: <AlertTriangle className="w-5 h-5" />, href: '/interactions', badge: 'New' },
];

export function Navigation() {
  const { favorites } = useAppStore();
  const [expandedSections, setExpandedSections] = useState<string[]>(['browse', 'quick-access']);

  const toggleSection = (section: string) => {
    setExpandedSections((prev) =>
      prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]
    );
  };

  const currentPath = window.location.pathname;

  return (
    <nav className="space-y-6">
      {/* Quick Access */}
      <div>
        <button
          onClick={() => toggleSection('quick-access')}
          className="flex items-center justify-between w-full text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2"
        >
          <span>Quick Access</span>
          <ChevronDown
            className={cn(
              'w-4 h-4 transition-transform',
              expandedSections.includes('quick-access') ? '' : '-rotate-90'
            )}
          />
        </button>
        {expandedSections.includes('quick-access') && (
          <div className="space-y-1 animate-slide-up">
            <a
              href="/favorites"
              className={cn(
                'nav-item',
                currentPath === '/favorites' && 'nav-item-active'
              )}
            >
              <Star className="w-5 h-5" />
              <span>Favorites</span>
              {favorites.length > 0 && (
                <span className="ml-auto bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 text-xs font-medium px-2 py-0.5 rounded-full">
                  {favorites.length}
                </span>
              )}
            </a>
            <a
              href="/recent"
              className={cn(
                'nav-item',
                currentPath === '/recent' && 'nav-item-active'
              )}
            >
              <Clock className="w-5 h-5" />
              <span>Recently Viewed</span>
            </a>
          </div>
        )}
      </div>

      {/* Main Navigation */}
      <div>
        <button
          onClick={() => toggleSection('main')}
          className="flex items-center justify-between w-full text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2"
        >
          <span>Reference</span>
          <ChevronDown
            className={cn(
              'w-4 h-4 transition-transform',
              expandedSections.includes('main') ? '' : '-rotate-90'
            )}
          />
        </button>
        {expandedSections.includes('main') && (
          <div className="space-y-1 animate-slide-up">
            {mainNavItems.map((item) => (
              <a
                key={item.id}
                href={item.href}
                className={cn(
                  'nav-item',
                  currentPath.includes(item.id) && 'nav-item-active'
                )}
              >
                {item.icon}
                <span>{item.label}</span>
                {item.badge && (
                  <span className="ml-auto bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-xs font-medium px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </a>
            ))}
          </div>
        )}
      </div>

      {/* Browse by Class */}
      <div>
        <button
          onClick={() => toggleSection('browse')}
          className="flex items-center justify-between w-full text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2"
        >
          <span>Browse by Class</span>
          <ChevronDown
            className={cn(
              'w-4 h-4 transition-transform',
              expandedSections.includes('browse') ? '' : '-rotate-90'
            )}
          />
        </button>
        {expandedSections.includes('browse') && (
          <div className="space-y-1 animate-slide-up">
            {medicationClasses.map((cls) => (
              <a
                key={cls.id}
                href={`/medications?class=${cls.id}`}
                className="nav-item"
              >
                <span
                  className={cn(
                    'w-2 h-2 rounded-full',
                    cls.color === 'blue' && 'bg-blue-500',
                    cls.color === 'cyan' && 'bg-cyan-500',
                    cls.color === 'purple' && 'bg-purple-500',
                    cls.color === 'amber' && 'bg-amber-500',
                    cls.color === 'green' && 'bg-green-500',
                    cls.color === 'slate' && 'bg-slate-500',
                    cls.color === 'teal' && 'bg-teal-500',
                    cls.color === 'orange' && 'bg-orange-500'
                  )}
                />
                <span className="text-sm">{cls.name}</span>
              </a>
            ))}
          </div>
        )}
      </div>

      {/* Browse by Condition */}
      <div>
        <button
          onClick={() => toggleSection('conditions')}
          className="flex items-center justify-between w-full text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2"
        >
          <span>By Condition</span>
          <ChevronDown
            className={cn(
              'w-4 h-4 transition-transform',
              expandedSections.includes('conditions') ? '' : '-rotate-90'
            )}
          />
        </button>
        {expandedSections.includes('conditions') && (
          <div className="space-y-1 animate-slide-up">
            {indications.slice(0, 8).map((condition) => (
              <a
                key={condition}
                href={`/medications?condition=${encodeURIComponent(condition)}`}
                className="nav-item"
              >
                <Activity className="w-4 h-4" />
                <span className="text-sm truncate">{condition}</span>
              </a>
            ))}
            <a
              href="/medications"
              className="nav-item text-sky-600 dark:text-sky-400"
            >
              <span className="text-sm">View all conditions →</span>
            </a>
          </div>
        )}
      </div>

      {/* Settings */}
      <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
        <a
          href="/settings"
          className={cn(
            'nav-item',
            currentPath === '/settings' && 'nav-item-active'
          )}
        >
          <Settings className="w-5 h-5" />
          <span>Settings</span>
        </a>
      </div>
    </nav>
  );
}

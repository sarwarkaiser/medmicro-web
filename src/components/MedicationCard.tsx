import { Heart, AlertCircle, ArrowRight } from 'lucide-react';
import type { Medication } from '../types';
import { cn, getClassColor, getFlagColor } from '../utils/classNames';
import { useAppStore } from '../stores/appStore';

interface MedicationCardProps {
  medication: Medication;
  compact?: boolean;
}

export function MedicationCard({ medication, compact }: MedicationCardProps) {
  const { favorites, addFavorite, removeFavorite, addRecentItem } = useAppStore();
  const isFavorite = favorites.includes(medication.id);

  const handleClick = () => {
    addRecentItem({
      id: medication.id,
      type: 'medication',
      name: medication.name,
    });
  };

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isFavorite) {
      removeFavorite(medication.id);
    } else {
      addFavorite(medication.id);
    }
  };

  if (compact) {
    return (
      <a
        href={`/medications/${medication.id}`}
        onClick={handleClick}
        className="card card-hover p-3 flex items-center gap-3 group"
      >
        <div
          className={cn(
            'w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold',
            getClassColor(medication.class)
          )}
        >
          {medication.name.slice(0, 2)}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-slate-900 dark:text-white truncate">
            {medication.name}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
            {medication.genericName}
          </p>
        </div>
        <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-sky-500 transition-colors" />
      </a>
    );
  }

  return (
    <a
      href={`/medications/${medication.id}`}
      onClick={handleClick}
      className="card card-hover p-5 group relative"
    >
      {/* Favorite button */}
      <button
        onClick={toggleFavorite}
        className={cn(
          'absolute top-3 right-3 p-2 rounded-full transition-all',
          isFavorite
            ? 'text-red-500 bg-red-50 dark:bg-red-900/20'
            : 'text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
        )}
      >
        <Heart
          className={cn('w-4 h-4', isFavorite && 'fill-current')}
        />
      </button>

      {/* Header */}
      <div className="flex items-start gap-3 mb-3 pr-8">
        <div
          className={cn(
            'w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold shrink-0',
            getClassColor(medication.class)
          )}
        >
          {medication.name.slice(0, 2)}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-lg text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
            {medication.name}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {medication.genericName}
          </p>
        </div>
      </div>

      {/* Class badge */}
      <div className="mb-3">
        <span
          className={cn(
            'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
            getClassColor(medication.class)
          )}
        >
          {medication.class}
        </span>
      </div>

      {/* Quick flags */}
      {medication.quickFlags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {medication.quickFlags.slice(0, 4).map((flag) => (
            <span
              key={flag}
              className={cn(
                'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium',
                getFlagColor(flag)
              )}
            >
              {flag}
            </span>
          ))}
          {medication.quickFlags.length > 4 && (
            <span className="text-xs text-slate-400 dark:text-slate-500">
              +{medication.quickFlags.length - 4}
            </span>
          )}
        </div>
      )}

      {/* Indications */}
      <div className="flex flex-wrap gap-1 mb-4">
        {medication.indications.slice(0, 3).map((ind) => (
          <span
            key={ind}
            className="text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded"
          >
            {ind}
          </span>
        ))}
        {medication.indications.length > 3 && (
          <span className="text-xs text-slate-400">
            +{medication.indications.length - 3}
          </span>
        )}
      </div>

      {/* Key info */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-700/50">
        <div className="flex items-center justify-between text-sm">
          <div>
            <span className="text-slate-500 dark:text-slate-400">Start: </span>
            <span className="font-medium text-slate-700 dark:text-slate-300">
              {medication.dosing.adult.start}
            </span>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-sky-500 transition-colors" />
        </div>
        {medication.warnings.length > 0 && (
          <div className="flex items-center gap-1.5 mt-2 text-amber-600 dark:text-amber-400 text-xs">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>{medication.warnings.length} warning(s)</span>
          </div>
        )}
      </div>
    </a>
  );
}

interface MedicationListItemProps {
  medication: Medication;
}

export function MedicationListItem({ medication }: MedicationListItemProps) {
  const { favorites, addFavorite, removeFavorite, addRecentItem } = useAppStore();
  const isFavorite = favorites.includes(medication.id);

  const handleClick = () => {
    addRecentItem({
      id: medication.id,
      type: 'medication',
      name: medication.name,
    });
  };

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isFavorite) {
      removeFavorite(medication.id);
    } else {
      addFavorite(medication.id);
    }
  };

  return (
    <a
      href={`/medications/${medication.id}`}
      onClick={handleClick}
      className="card card-hover p-4 flex items-center gap-4 group"
    >
      <div
        className={cn(
          'w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold shrink-0',
          getClassColor(medication.class)
        )}
      >
        {medication.name.slice(0, 2)}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-semibold text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
            {medication.name}
          </h3>
          <span className="text-sm text-slate-500 dark:text-slate-400">
            ({medication.genericName})
          </span>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={cn(
              'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium',
              getClassColor(medication.class)
            )}
          >
            {medication.class}
          </span>
          {medication.quickFlags.slice(0, 3).map((flag) => (
            <span
              key={flag}
              className={cn(
                'inline-flex items-center px-2 py-0.5 rounded text-xs',
                getFlagColor(flag)
              )}
            >
              {flag}
            </span>
          ))}
        </div>
      </div>

      <div className="hidden sm:block text-right">
        <div className="text-sm text-slate-600 dark:text-slate-300">
          {medication.dosing.adult.start}
        </div>
        <div className="text-xs text-slate-500 dark:text-slate-400">
          starting dose
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={toggleFavorite}
          className={cn(
            'p-2 rounded-full transition-all',
            isFavorite
              ? 'text-red-500'
              : 'text-slate-300 hover:text-red-500'
          )}
        >
          <Heart
            className={cn('w-5 h-5', isFavorite && 'fill-current')}
          />
        </button>
        <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-sky-500 transition-colors" />
      </div>
    </a>
  );
}

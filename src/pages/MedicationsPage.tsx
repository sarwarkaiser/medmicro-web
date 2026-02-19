import { useState, useMemo } from 'react';
import { Pill, LayoutGrid, List, Filter, X, Sparkles, Beaker, Heart, Clock } from 'lucide-react';
import type { Medication, SearchFilters } from '../types';
import { MedicationCard, MedicationListItem } from '../components/MedicationCard';
import { SearchBar, FilterChip } from '../components/SearchBar';
import { MedicationSkeletonGrid } from '../components/Skeleton';
import { useMedicationSearch } from '../hooks/useSearch';
import { useAppStore } from '../stores/appStore';
import { medicationClasses, quickFlags } from '../data/medications';
import { cn } from '../utils/classNames';

interface MedicationsPageProps {
  medications: Medication[];
  loading: boolean;
}

export function MedicationsPage({ medications, loading }: MedicationsPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({});
  const [showFilters, setShowFilters] = useState(false);
  const { settings, updateSettings, favorites } = useAppStore();

  const filteredMeds = useMedicationSearch(medications, searchQuery, filters);

  const stats = useMemo(() => {
    return {
      total: medications.length,
      byClass: medicationClasses.map((cls) => ({
        ...cls,
        count: medications.filter((m) => m.class === cls.id).length,
      })),
    };
  }, [medications]);

  const toggleClassFilter = (classId: string) => {
    setFilters((prev) => {
      const current = prev.class || [];
      const updated = current.includes(classId as any)
        ? current.filter((c) => c !== classId)
        : [...current, classId as any];
      return { ...prev, class: updated.length > 0 ? updated : undefined };
    });
  };

  const toggleFlagFilter = (flagId: string) => {
    setFilters((prev) => {
      const current = prev.flags || [];
      const updated = current.includes(flagId as any)
        ? current.filter((f) => f !== flagId)
        : [...current, flagId as any];
      return { ...prev, flags: updated.length > 0 ? updated : undefined };
    });
  };

  const clearFilters = () => {
    setFilters({});
    setSearchQuery('');
  };

  const activeFilterCount =
    (filters.class?.length || 0) + (filters.flags?.length || 0);

  // Quick filters for common use cases
  const quickFilters = [
    { 
      id: 'first-line', 
      label: 'First-line', 
      icon: <Sparkles className="w-3 h-3" />,
      filter: { flags: ['First-line'] as const }
    },
    { 
      id: 'pregnancy-safe', 
      label: 'Pregnancy Safe', 
      icon: <Heart className="w-3 h-3" />,
      filter: { flags: ['Pregnancy-safe'] as const }
    },
    { 
      id: 'qt-safe', 
      label: 'QT Safe', 
      icon: <Beaker className="w-3 h-3" />,
      filter: { flags: ['QT-safe'] as const }
    },
    { 
      id: 'weight-neutral', 
      label: 'Weight Neutral', 
      icon: <Scale className="w-3 h-3" />,
      filter: { flags: ['Weight-neutral'] as const }
    },
    { 
      id: 'sedating', 
      label: 'Sedating', 
      icon: <Clock className="w-3 h-3" />,
      filter: { flags: ['Sedating'] as const }
    },
  ];

  const applyQuickFilter = (filterId: string) => {
    const quickFilter = quickFilters.find(qf => qf.id === filterId);
    if (quickFilter) {
      setFilters(prev => {
        const currentFlags = prev.flags || [];
        const newFlag = quickFilter.filter.flags[0];
        const isActive = currentFlags.includes(newFlag);
        
        if (isActive) {
          // Remove the filter
          const updated = currentFlags.filter(f => f !== newFlag);
          return { ...prev, flags: updated.length > 0 ? updated : undefined };
        } else {
          // Add the filter
          return { ...prev, flags: [...currentFlags, newFlag] };
        }
      });
    }
  };

  const isQuickFilterActive = (flagId: string) => {
    return filters.flags?.includes(flagId as any) || false;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="h-8 w-48 bg-slate-200 dark:bg-slate-700 rounded animate-pulse mb-2" />
            <div className="h-4 w-32 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
          </div>
        </div>
        <div className="h-10 w-full bg-slate-200 dark:bg-slate-700 rounded-xl animate-pulse" />
        <MedicationSkeletonGrid count={6} view={settings.defaultView} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Pill className="w-6 h-6 text-sky-500" />
            Medications
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            {stats.total} medications in database
            {favorites.length > 0 && (
              <span className="ml-2 text-sky-600 dark:text-sky-400">
                • {favorites.length} in favorites
              </span>
            )}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
            <button
              onClick={() => updateSettings({ defaultView: 'grid' })}
              className={cn(
                'p-2 rounded-md transition-colors',
                settings.defaultView === 'grid'
                  ? 'bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-400 shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
              )}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => updateSettings({ defaultView: 'list' })}
              className={cn(
                'p-2 rounded-md transition-colors',
                settings.defaultView === 'list'
                  ? 'bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-400 shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
              )}
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              'btn-secondary relative',
              activeFilterCount > 0 && 'text-sky-600 dark:text-sky-400'
            )}
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-sky-500 text-white text-xs rounded-full flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Search */}
      <SearchBar
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder="Search medications by name, class, or indication..."
      />

      {/* Quick Filters */}
      <div className="flex flex-wrap gap-2">
        {quickFilters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => applyQuickFilter(filter.id)}
            className={cn(
              'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border transition-all duration-200',
              isQuickFilterActive(filter.filter.flags[0])
                ? 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300 border-sky-200 dark:border-sky-800'
                : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'
            )}
          >
            {filter.icon}
            {filter.label}
          </button>
        ))}
        {activeFilterCount > 0 && (
          <button
            onClick={clearFilters}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300 transition-colors"
          >
            <X className="w-3 h-3" />
            Clear all
          </button>
        )}
      </div>

      {/* Advanced Filters Panel */}
      {showFilters && (
        <div className="card p-4 animate-slide-up">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900 dark:text-white">Advanced Filters</h3>
            <button
              onClick={clearFilters}
              className="text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300 flex items-center gap-1"
            >
              <X className="w-4 h-4" />
              Clear all
            </button>
          </div>

          <div className="mb-4">
            <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Medication Class
            </h4>
            <div className="flex flex-wrap gap-2">
              {stats.byClass.map((cls) => (
                <FilterChip
                  key={cls.id}
                  label={cls.name}
                  count={cls.count}
                  active={filters.class?.includes(cls.id as any)}
                  onClick={() => toggleClassFilter(cls.id)}
                  color={cls.color as any}
                />
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Properties
            </h4>
            <div className="flex flex-wrap gap-2">
              {quickFlags.slice(0, 12).map((flag) => (
                <FilterChip
                  key={flag.id}
                  label={flag.name}
                  active={filters.flags?.includes(flag.id as any)}
                  onClick={() => toggleFlagFilter(flag.id)}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Results Info */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Showing {filteredMeds.length} of {medications.length} medications
          {searchQuery && (
            <span className="ml-1">
              for "<span className="text-sky-600 dark:text-sky-400">{searchQuery}</span>"
            </span>
          )}
        </p>
      </div>

      {/* Results */}
      {filteredMeds.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Pill className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
            No medications found
          </h3>
          <p className="text-slate-500 dark:text-slate-400 mb-4">
            Try adjusting your search or filters
          </p>
          <button onClick={clearFilters} className="btn-secondary">
            Clear all filters
          </button>
        </div>
      ) : settings.defaultView === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredMeds.map((med) => (
            <MedicationCard key={med.id} medication={med} />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredMeds.map((med) => (
            <MedicationListItem key={med.id} medication={med} />
          ))}
        </div>
      )}
    </div>
  );
}

// Add Scale icon for the quick filter
function Scale({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
    </svg>
  );
}

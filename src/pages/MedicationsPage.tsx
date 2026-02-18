import { useState, useMemo } from 'react';
import { Pill, LayoutGrid, List, Filter, X } from 'lucide-react';
import type { Medication, SearchFilters } from '../types';
import { MedicationCard, MedicationListItem } from '../components/MedicationCard';
import { SearchBar, FilterChip } from '../components/SearchBar';
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
  const { settings, updateSettings } = useAppStore();

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Pill className="w-6 h-6 text-sky-500" />
            Medications
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            {stats.total} medications in database
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

      <SearchBar
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder="Search medications by name, class, or indication..."
      />

      {showFilters && (
        <div className="card p-4 animate-slide-up">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900 dark:text-white">Filters</h3>
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
              {quickFlags.slice(0, 8).map((flag) => (
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

      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Showing {filteredMeds.length} of {medications.length} medications
        </p>
      </div>

      {filteredMeds.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Pill className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
            No medications found
          </h3>
          <p className="text-slate-500 dark:text-slate-400">
            Try adjusting your search or filters
          </p>
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

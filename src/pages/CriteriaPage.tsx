import { useState, useMemo } from 'react';
import { ClipboardList, Check, X, AlertCircle } from 'lucide-react';
import type { Dsm5Criteria, Criterion } from '../types';
import { SearchBar, FilterChip } from '../components/SearchBar';
import { cn } from '../utils/classNames';

interface CriteriaPageProps {
  criteria: Dsm5Criteria[];
  loading: boolean;
}

const categories = [
  { id: 'Depressive', name: 'Depressive', color: 'blue' as const },
  { id: 'Bipolar', name: 'Bipolar', color: 'purple' as const },
  { id: 'Anxiety', name: 'Anxiety', color: 'green' as const },
  { id: 'Psychotic', name: 'Psychotic', color: 'red' as const },
  { id: 'Trauma', name: 'Trauma', color: 'amber' as const },
];

export function CriteriaPage({ criteria, loading }: CriteriaPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [expandedCriteria, setExpandedCriteria] = useState<string | null>(null);
  const [checkedCriteria, setCheckedCriteria] = useState<Record<string, boolean>>({});

  const filteredCriteria = useMemo(() => {
    let filtered = criteria;

    if (selectedCategory) {
      filtered = filtered.filter((c) => c.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.disorder.toLowerCase().includes(query) ||
          c.code.toLowerCase().includes(query) ||
          c.criteria.some((crit) => crit.text.toLowerCase().includes(query))
      );
    }

    return filtered;
  }, [criteria, searchQuery, selectedCategory]);

  const toggleCriterion = (criterionId: string) => {
    setCheckedCriteria((prev) => ({
      ...prev,
      [criterionId]: !prev[criterionId],
    }));
  };

  const clearChecks = () => {
    setCheckedCriteria({});
  };

  const getCheckedCount = (criteria: Dsm5Criteria) => {
    return criteria.criteria.filter((c) => checkedCriteria[`${criteria.id}-${c.letter}`]).length;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ClipboardList className="w-6 h-6 text-sky-500" />
            DSM-5 Criteria
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            {criteria.length} diagnostic criteria with interactive checklist
          </p>
        </div>

        {Object.keys(checkedCriteria).length > 0 && (
          <button onClick={clearChecks} className="btn-secondary text-sm">
            <X className="w-4 h-4" />
            Clear checks
          </button>
        )}
      </div>

      {/* Search */}
      <SearchBar
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder="Search disorders by name or code..."
      />

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2">
        <FilterChip
          label="All"
          active={!selectedCategory}
          onClick={() => setSelectedCategory(null)}
          count={criteria.length}
        />
        {categories.map((cat) => (
          <FilterChip
            key={cat.id}
            label={cat.name}
            active={selectedCategory === cat.id}
            onClick={() =>
              setSelectedCategory(cat.id === selectedCategory ? null : cat.id)
            }
            count={criteria.filter((c) => c.category === cat.id).length}
            color={cat.color}
          />
        ))}
      </div>

      {/* Results count */}
      <p className="text-sm text-slate-500 dark:text-slate-400">
        Showing {filteredCriteria.length} of {criteria.length} disorders
      </p>

      {/* Criteria List */}
      {filteredCriteria.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <ClipboardList className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
            No criteria found
          </h3>
          <p className="text-slate-500 dark:text-slate-400">
            Try adjusting your search or filters
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredCriteria.map((disorder) => (
            <CriteriaCard
              key={disorder.id}
              disorder={disorder}
              isExpanded={expandedCriteria === disorder.id}
              onToggle={() =>
                setExpandedCriteria(
                  expandedCriteria === disorder.id ? null : disorder.id
                )
              }
              checkedCriteria={checkedCriteria}
              onToggleCriterion={toggleCriterion}
              checkedCount={getCheckedCount(disorder)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface CriteriaCardProps {
  disorder: Dsm5Criteria;
  isExpanded: boolean;
  onToggle: () => void;
  checkedCriteria: Record<string, boolean>;
  onToggleCriterion: (id: string) => void;
  checkedCount: number;
}

function CriteriaCard({
  disorder,
  isExpanded,
  onToggle,
  checkedCriteria,
  onToggleCriterion,
  checkedCount,
}: CriteriaCardProps) {
  const categoryColors: Record<string, string> = {
    Depressive: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    Bipolar: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
    Anxiety: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
    Psychotic: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
    Trauma: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  };

  return (
    <div className="card overflow-hidden">
      <div
        className="p-5 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
        onClick={onToggle}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span
                className={cn(
                  'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                  categoryColors[disorder.category] ||
                    'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                )}
              >
                {disorder.category}
              </span>
              <span className="text-xs font-mono text-slate-400 dark:text-slate-500">
                {disorder.code}
              </span>
            </div>
            <h3 className="font-semibold text-lg text-slate-900 dark:text-white">
              {disorder.disorder}
            </h3>
            {checkedCount > 0 && (
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                {checkedCount} of {disorder.criteria.length} criteria checked
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            {checkedCount === disorder.criteria.length && checkedCount > 0 && (
              <span className="text-green-500">
                <Check className="w-5 h-5" />
              </span>
            )}
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="border-t border-slate-200 dark:border-slate-700/50 p-5 animate-slide-up">
          {/* Screening Questions */}
          {disorder.screeningQuestions && disorder.screeningQuestions.length > 0 && (
            <div className="mb-6 p-4 bg-sky-50 dark:bg-sky-900/20 rounded-lg">
              <h4 className="font-medium text-sky-900 dark:text-sky-300 mb-2 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Screening Questions
              </h4>
              <ul className="space-y-2">
                {disorder.screeningQuestions.map((q, idx) => (
                  <li key={idx} className="text-sm text-sky-800 dark:text-sky-200">
                    • {q.question}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Criteria */}
          <div className="space-y-3">
            <h4 className="font-medium text-slate-900 dark:text-white mb-3">
              Diagnostic Criteria
            </h4>
            {disorder.criteria.map((criterion) => (
              <CriterionRow
                key={criterion.letter}
                criterion={criterion}
                isChecked={checkedCriteria[`${disorder.id}-${criterion.letter}`]}
                onToggle={() =>
                  onToggleCriterion(`${disorder.id}-${criterion.letter}`)
                }
              />
            ))}
          </div>

          {/* Specifiers */}
          {disorder.specifiers && disorder.specifiers.length > 0 && (
            <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700/50">
              <h4 className="font-medium text-slate-900 dark:text-white mb-3">
                Specifiers
              </h4>
              <div className="space-y-2">
                {disorder.specifiers.map((spec, idx) => (
                  <div key={idx} className="text-sm">
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      {spec.name}:
                    </span>{' '}
                    <span className="text-slate-600 dark:text-slate-400">
                      {spec.description}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Differential Diagnosis */}
          {disorder.differentialDx && disorder.differentialDx.length > 0 && (
            <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700/50">
              <h4 className="font-medium text-slate-900 dark:text-white mb-2">
                Differential Diagnosis
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Rule out: {disorder.differentialDx.join(', ')}
              </p>
            </div>
          )}

          {/* Notes */}
          {disorder.notes && (
            <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700/50">
              <p className="text-sm text-slate-500 dark:text-slate-400 italic">
                {disorder.notes}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

interface CriterionRowProps {
  criterion: Criterion;
  isChecked: boolean;
  onToggle: () => void;
}

function CriterionRow({ criterion, isChecked, onToggle }: CriterionRowProps) {
  return (
    <div
      className={cn(
        'flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors',
        isChecked
          ? 'bg-green-50 dark:bg-green-900/20'
          : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
      )}
      onClick={onToggle}
    >
      <div
        className={cn(
          'w-6 h-6 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors',
          isChecked
            ? 'bg-green-500 border-green-500'
            : 'border-slate-300 dark:border-slate-600'
        )}
      >
        {isChecked && <Check className="w-4 h-4 text-white" />}
      </div>
      <div className="flex-1">
        <p
          className={cn(
            'text-sm transition-colors',
            isChecked
              ? 'text-green-800 dark:text-green-200'
              : 'text-slate-700 dark:text-slate-300'
          )}
        >
          <span className="font-medium">{criterion.letter}.</span>{' '}
          {criterion.text}
          {criterion.required && (
            <span className="ml-1 text-red-500">*</span>
          )}
        </p>
        {criterion.subcriteria && criterion.subcriteria.length > 0 && (
          <ul className="mt-2 ml-4 space-y-1">
            {criterion.subcriteria.map((sub, idx) => (
              <li
                key={idx}
                className="text-xs text-slate-500 dark:text-slate-400"
              >
                {sub}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

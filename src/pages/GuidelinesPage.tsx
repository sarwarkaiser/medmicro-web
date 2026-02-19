import { useState, useMemo } from 'react';
import { BookOpen, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import type { Guideline } from '../types';
import { SearchBar, FilterChip } from '../components/SearchBar';
import { cn } from '../utils/classNames';

interface GuidelinesPageProps {
  guidelines: Guideline[];
  loading: boolean;
}

const organizations = [
  { id: 'APA', name: 'APA', color: 'blue' as const },
  { id: 'CANMAT', name: 'CANMAT', color: 'green' as const },
  { id: 'NICE', name: 'NICE', color: 'purple' as const },
  { id: 'WHO', name: 'WHO', color: 'cyan' as const },
];

export function GuidelinesPage({ guidelines, loading }: GuidelinesPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrg, setSelectedOrg] = useState<string | null>(null);
  const [expandedGuideline, setExpandedGuideline] = useState<string | null>(null);

  const filteredGuidelines = useMemo(() => {
    let filtered = guidelines;

    if (selectedOrg) {
      filtered = filtered.filter((g) => g.organization === selectedOrg);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (g) =>
          g.title.toLowerCase().includes(query) ||
          g.conditions.some((c) => c.toLowerCase().includes(query)) ||
          g.content.some((s) => s.heading.toLowerCase().includes(query))
      );
    }

    return filtered;
  }, [guidelines, searchQuery, selectedOrg]);

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
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-sky-500" />
          Clinical Guidelines
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          {guidelines.length} guidelines from major psychiatric organizations
        </p>
      </div>

      {/* Search */}
      <SearchBar
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder="Search guidelines by title, condition, or topic..."
      />

      {/* Organization Filters */}
      <div className="flex flex-wrap gap-2">
        <FilterChip
          label="All"
          active={!selectedOrg}
          onClick={() => setSelectedOrg(null)}
          count={guidelines.length}
        />
        {organizations.map((org) => (
          <FilterChip
            key={org.id}
            label={org.name}
            active={selectedOrg === org.id}
            onClick={() => setSelectedOrg(org.id === selectedOrg ? null : org.id)}
            count={guidelines.filter((g) => g.organization === org.id).length}
            color={org.color}
          />
        ))}
      </div>

      {/* Results count */}
      <p className="text-sm text-slate-500 dark:text-slate-400">
        Showing {filteredGuidelines.length} of {guidelines.length} guidelines
      </p>

      {/* Guidelines List */}
      {filteredGuidelines.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
            No guidelines found
          </h3>
          <p className="text-slate-500 dark:text-slate-400">
            Try adjusting your search or filters
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredGuidelines.map((guideline) => (
            <GuidelineCard
              key={guideline.id}
              guideline={guideline}
              isExpanded={expandedGuideline === guideline.id}
              onToggle={() =>
                setExpandedGuideline(
                  expandedGuideline === guideline.id ? null : guideline.id
                )
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface GuidelineCardProps {
  guideline: Guideline;
  isExpanded: boolean;
  onToggle: () => void;
}

function GuidelineCard({ guideline, isExpanded, onToggle }: GuidelineCardProps) {
  const orgColors: Record<string, string> = {
    APA: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    CANMAT: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
    NICE: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
    WHO: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300',
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
                  orgColors[guideline.organization] ||
                    'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                )}
              >
                {guideline.organization}
              </span>
              <span className="text-sm text-slate-500 dark:text-slate-400">
                {guideline.year}
              </span>
              {guideline.version && (
                <span className="text-xs text-slate-400 dark:text-slate-500">
                  v{guideline.version}
                </span>
              )}
            </div>
            <h3 className="font-semibold text-lg text-slate-900 dark:text-white">
              {guideline.title}
            </h3>
            <div className="flex flex-wrap gap-1 mt-2">
              {guideline.conditions.slice(0, 4).map((condition) => (
                <span
                  key={condition}
                  className="text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded"
                >
                  {condition}
                </span>
              ))}
              {guideline.conditions.length > 4 && (
                <span className="text-xs text-slate-400">
                  +{guideline.conditions.length - 4}
                </span>
              )}
            </div>
          </div>
          <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
            {isExpanded ? (
              <ChevronUp className="w-5 h-5" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="border-t border-slate-200 dark:border-slate-700/50 p-5 animate-slide-up">
          <div className="space-y-4">
            {guideline.content.slice(0, 3).map((section, idx) => (
              <div key={idx}>
                <h4 className="font-medium text-slate-900 dark:text-white mb-1">
                  {section.heading}
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-3">
                  {section.content}
                </p>
              </div>
            ))}

            {guideline.url && (
              <a
                href={guideline.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sky-600 dark:text-sky-400 hover:underline text-sm font-medium mt-2"
                onClick={(e) => e.stopPropagation()}
              >
                View full guideline
                <ExternalLink className="w-4 h-4" />
              </a>
            )}

            {guideline.citation && (
              <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700/50">
                <p className="text-xs text-slate-500 dark:text-slate-400 italic">
                  {guideline.citation}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

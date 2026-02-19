import { useState, useMemo } from 'react';
import { BookOpen, ExternalLink, ChevronDown, ChevronUp, GitBranch, FileText, Lightbulb } from 'lucide-react';
import type { Guideline } from '../types';
import { SearchBar, FilterChip } from '../components/SearchBar';
import { GuidelinesSkeleton } from '../components/Skeleton';
import { TreatmentAlgorithm, depressionAlgorithm, anxietyAlgorithm } from '../components/TreatmentAlgorithm';
import { cn } from '../utils/classNames';

interface GuidelinesPageProps {
  guidelines: Guideline[];
  loading: boolean;
}

type ViewMode = 'guidelines' | 'algorithms' | 'comparison';

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
  const [viewMode, setViewMode] = useState<ViewMode>('guidelines');

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
    return <GuidelinesSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-sky-500" />
            Clinical Guidelines
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            {guidelines.length} guidelines and treatment algorithms
          </p>
        </div>

        {/* View Mode Tabs */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
          <button
            onClick={() => setViewMode('guidelines')}
            className={cn(
              'flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors',
              viewMode === 'guidelines'
                ? 'bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-400 shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
            )}
          >
            <FileText className="w-4 h-4" />
            Guidelines
          </button>
          <button
            onClick={() => setViewMode('algorithms')}
            className={cn(
              'flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors',
              viewMode === 'algorithms'
                ? 'bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-400 shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
            )}
          >
            <GitBranch className="w-4 h-4" />
            Algorithms
          </button>
          <button
            onClick={() => setViewMode('comparison')}
            className={cn(
              'flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors',
              viewMode === 'comparison'
                ? 'bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-400 shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
            )}
          >
            <Lightbulb className="w-4 h-4" />
            Quick Ref
          </button>
        </div>
      </div>

      {viewMode === 'guidelines' && (
        <>
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
        </>
      )}

      {viewMode === 'algorithms' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TreatmentAlgorithm
            title="Depression Treatment Algorithm"
            condition="Major Depressive Disorder"
            steps={depressionAlgorithm}
            source="CANMAT 2016"
          />
          <TreatmentAlgorithm
            title="Anxiety Treatment Algorithm"
            condition="Generalized Anxiety Disorder"
            steps={anxietyAlgorithm}
            source="CANMAT 2014"
          />
        </div>
      )}

      {viewMode === 'comparison' && (
        <GuidelineComparisonTable guidelines={guidelines} />
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

function GuidelineComparisonTable({ guidelines }: { guidelines: Guideline[] }) {
  // Get common conditions across guidelines
  const commonConditions = ['Depression', 'Bipolar Disorder', 'Anxiety Disorders', 'Schizophrenia'];
  
  const comparisons = [
    {
      condition: 'Major Depressive Disorder (First-line)',
      apa: 'SSRI (sertraline, escitalopram) or SNRI',
      canmat: 'SSRI (sertraline, escitalopram) - Level 1 evidence',
      nice: 'SSRI (fluoxetine, sertraline, citalopram)',
    },
    {
      condition: 'Treatment-Resistant Depression',
      apa: 'Switch to different class or augment with aripiprazole/bupropion',
      canmat: 'Augment with atypical antipsychotic (aripiprazole) - Level 1',
      nice: 'Consider augmenting or switching; add psychotherapy',
    },
    {
      condition: 'Bipolar Mania (Acute)',
      apa: 'Lithium, valproate, or atypical antipsychotic',
      canmat: 'Lithium, valproate, or atypical (Level 1: risperidone, olanzapine)',
      nice: 'Antipsychotic + consider mood stabilizer',
    },
    {
      condition: 'Bipolar Depression',
      apa: 'Quetiapine or lurasidone; consider lamotrigine',
      canmat: 'Quetiapine, lurasidone, or lamotrigine (Level 1)',
      nice: 'Fluoxetine + olanzapine; quetiapine; olanzapine',
    },
    {
      condition: 'Generalized Anxiety Disorder',
      apa: 'SSRI or SNRI first-line; consider pregabalin',
      canmat: 'SSRI, SNRI, pregabalin, or quetiapine XR (Level 1)',
      nice: 'SSRI; consider self-help or CBT',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="card overflow-hidden">
        <div className="p-5 border-b border-slate-200 dark:border-slate-700">
          <h2 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-sky-500" />
            Guideline Comparison: Key Recommendations
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Quick reference comparing recommendations across major guidelines
          </p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50">
                <th className="text-left p-4 text-sm font-semibold text-slate-700 dark:text-slate-300 sticky left-0 bg-slate-50 dark:bg-slate-800/50 min-w-[200px]">
                  Condition / Recommendation
                </th>
                <th className="text-left p-4 text-sm font-semibold text-blue-700 dark:text-blue-400 min-w-[200px]">
                  APA
                </th>
                <th className="text-left p-4 text-sm font-semibold text-green-700 dark:text-green-400 min-w-[200px]">
                  CANMAT
                </th>
                <th className="text-left p-4 text-sm font-semibold text-purple-700 dark:text-purple-400 min-w-[200px]">
                  NICE
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {comparisons.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                  <td className="p-4 text-sm font-medium text-slate-900 dark:text-white sticky left-0 bg-white dark:bg-slate-800">
                    {row.condition}
                  </td>
                  <td className="p-4 text-sm text-slate-600 dark:text-slate-400">
                    {row.apa}
                  </td>
                  <td className="p-4 text-sm text-slate-600 dark:text-slate-400">
                    {row.canmat}
                  </td>
                  <td className="p-4 text-sm text-slate-600 dark:text-slate-400">
                    {row.nice}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Key Differences Card */}
      <div className="card p-5">
        <h3 className="font-semibold text-slate-900 dark:text-white mb-4">
          Key Differences to Note
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h4 className="font-medium text-blue-700 dark:text-blue-300 mb-2">APA</h4>
            <ul className="text-sm text-blue-600 dark:text-blue-400 space-y-1">
              <li>• Emphasizes measurement-based care</li>
              <li>• Strong focus on combination therapy</li>
              <li>• Regular updates with new evidence</li>
            </ul>
          </div>
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <h4 className="font-medium text-green-700 dark:text-green-300 mb-2">CANMAT</h4>
            <ul className="text-sm text-green-600 dark:text-green-400 space-y-1">
              <li>• Evidence levels clearly stated</li>
              <li>• Canadian context (drug availability)</li>
              <li>• Comprehensive bipolar guidelines</li>
            </ul>
          </div>
          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <h4 className="font-medium text-purple-700 dark:text-purple-300 mb-2">NICE</h4>
            <ul className="text-sm text-purple-600 dark:text-purple-400 space-y-1">
              <li>• Cost-effectiveness emphasis</li>
              <li>• Stepped care model</li>
              <li>• UK-specific recommendations</li>
            </ul>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
            <h4 className="font-medium text-slate-700 dark:text-slate-300 mb-2">General Tips</h4>
            <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
              <li>• Start with your local guideline</li>
              <li>• Consider patient preferences</li>
              <li>• Drug availability varies by country</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useMemo } from 'react';
import { Star, Heart, Trash2, ArrowRight } from 'lucide-react';
import type { Medication, Guideline, Dsm5Criteria } from '../types';
import { MedicationCard } from '../components/MedicationCard';
import { useAppStore } from '../stores/appStore';
import { cn } from '../utils/classNames';

interface FavoritesPageProps {
  medications: Medication[];
  guidelines: Guideline[];
  criteria: Dsm5Criteria[];
}

export function FavoritesPage({ medications, guidelines, criteria }: FavoritesPageProps) {
  const { favorites, removeFavorite } = useAppStore();

  const favoriteMeds = useMemo(() => {
    return medications.filter((m) => favorites.includes(m.id));
  }, [medications, favorites]);

  const favoriteGuidelines = useMemo(() => {
    return guidelines.filter((g) => favorites.includes(g.id));
  }, [guidelines, favorites]);

  const favoriteCriteria = useMemo(() => {
    return criteria.filter((c) => favorites.includes(c.id));
  }, [criteria, favorites]);

  const totalFavorites = favoriteMeds.length + favoriteGuidelines.length + favoriteCriteria.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Star className="w-6 h-6 text-amber-500 fill-amber-500" />
          Favorites
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          {totalFavorites} saved items
        </p>
      </div>

      {totalFavorites === 0 ? (
        <div className="card p-12 text-center">
          <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
            No favorites yet
          </h3>
          <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            Click the heart icon on medications, guidelines, or criteria to save them here for quick access.
          </p>
        </div>
      ) : (
        <>
          {/* Medications */}
          {favoriteMeds.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                Medications
                <span className="text-sm font-normal text-slate-500 dark:text-slate-400">
                  ({favoriteMeds.length})
                </span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {favoriteMeds.map((med) => (
                  <MedicationCard key={med.id} medication={med} />
                ))}
              </div>
            </div>
          )}

          {/* Guidelines */}
          {favoriteGuidelines.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                Guidelines
                <span className="text-sm font-normal text-slate-500 dark:text-slate-400">
                  ({favoriteGuidelines.length})
                </span>
              </h2>
              <div className="space-y-3">
                {favoriteGuidelines.map((guide) => (
                  <GuidelineItem
                    key={guide.id}
                    guideline={guide}
                    onRemove={() => removeFavorite(guide.id)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Criteria */}
          {favoriteCriteria.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                DSM-5 Criteria
                <span className="text-sm font-normal text-slate-500 dark:text-slate-400">
                  ({favoriteCriteria.length})
                </span>
              </h2>
              <div className="space-y-3">
                {favoriteCriteria.map((criterion) => (
                  <CriteriaItem
                    key={criterion.id}
                    criteria={criterion}
                    onRemove={() => removeFavorite(criterion.id)}
                  />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

interface GuidelineItemProps {
  guideline: Guideline;
  onRemove: () => void;
}

function GuidelineItem({ guideline, onRemove }: GuidelineItemProps) {
  return (
    <div className="card card-hover p-4 flex items-center gap-4 group">
      <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold shrink-0">
        {guideline.organization.slice(0, 2)}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-slate-900 dark:text-white truncate group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
          {guideline.title}
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {guideline.organization} • {guideline.year}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onRemove}
          className="p-2 text-slate-300 hover:text-red-500 transition-colors"
          title="Remove from favorites"
        >
          <Trash2 className="w-4 h-4" />
        </button>
        <a
          href={`/guidelines#${guideline.id}`}
          className="p-2 text-slate-300 hover:text-sky-500 transition-colors"
        >
          <ArrowRight className="w-5 h-5" />
        </a>
      </div>
    </div>
  );
}

interface CriteriaItemProps {
  criteria: Dsm5Criteria;
  onRemove: () => void;
}

function CriteriaItem({ criteria, onRemove }: CriteriaItemProps) {
  const categoryColors: Record<string, string> = {
    Depressive: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    Bipolar: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
    Anxiety: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
    Psychotic: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
    Trauma: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  };

  return (
    <div className="card card-hover p-4 flex items-center gap-4 group">
      <div
        className={cn(
          'w-12 h-12 rounded-xl flex items-center justify-center font-bold shrink-0',
          categoryColors[criteria.category] || 'bg-slate-100 dark:bg-slate-800'
        )}
      >
        {criteria.code.slice(0, 3)}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-slate-900 dark:text-white truncate group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
          {criteria.disorder}
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {criteria.category} • {criteria.code}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onRemove}
          className="p-2 text-slate-300 hover:text-red-500 transition-colors"
          title="Remove from favorites"
        >
          <Trash2 className="w-4 h-4" />
        </button>
        <a
          href={`/criteria#${criteria.id}`}
          className="p-2 text-slate-300 hover:text-sky-500 transition-colors"
        >
          <ArrowRight className="w-5 h-5" />
        </a>
      </div>
    </div>
  );
}

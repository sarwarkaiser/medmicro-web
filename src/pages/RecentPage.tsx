import { useMemo } from 'react';
import { Clock, Pill, BookOpen, ClipboardList, Trash2, ArrowRight } from 'lucide-react';
import type { Medication, Guideline, Dsm5Criteria, RecentItem } from '../types';
import { MedicationCard } from '../components/MedicationCard';
import { useAppStore } from '../stores/appStore';
import { cn } from '../utils/classNames';

interface RecentPageProps {
  medications: Medication[];
  guidelines: Guideline[];
  criteria: Dsm5Criteria[];
}

export function RecentPage({ medications, guidelines, criteria }: RecentPageProps) {
  const { recentItems, clearRecentItems } = useAppStore();

  // Group recent items by date
  const groupedItems = useMemo(() => {
    const groups: Record<string, RecentItem[]> = {
      Today: [],
      Yesterday: [],
      'Last 7 days': [],
      Earlier: [],
    };

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 7);

    recentItems.forEach((item) => {
      const itemDate = new Date(item.accessedAt);
      const itemDay = new Date(itemDate.getFullYear(), itemDate.getMonth(), itemDate.getDate());

      if (itemDay.getTime() === today.getTime()) {
        groups.Today.push(item);
      } else if (itemDay.getTime() === yesterday.getTime()) {
        groups.Yesterday.push(item);
      } else if (itemDate > lastWeek) {
        groups['Last 7 days'].push(item);
      } else {
        groups.Earlier.push(item);
      }
    });

    return groups;
  }, [recentItems]);

  const getItemData = (item: RecentItem) => {
    switch (item.type) {
      case 'medication':
        return medications.find((m) => m.id === item.id);
      case 'guideline':
        return guidelines.find((g) => g.id === item.id);
      case 'criteria':
        return criteria.find((c) => c.id === item.id);
      default:
        return null;
    }
  };

  const getItemUrl = (item: RecentItem) => {
    switch (item.type) {
      case 'medication':
        return `/medications/${item.id}`;
      case 'guideline':
        return `/guidelines#${item.id}`;
      case 'criteria':
        return `/criteria#${item.id}`;
      default:
        return '/';
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Clock className="w-6 h-6 text-sky-500" />
            Recently Viewed
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            {recentItems.length} items in history
          </p>
        </div>

        {recentItems.length > 0 && (
          <button
            onClick={clearRecentItems}
            className="btn-secondary text-sm self-start"
          >
            <Trash2 className="w-4 h-4" />
            Clear history
          </button>
        )}
      </div>

      {recentItems.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
            No recent items
          </h3>
          <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            Items you view will appear here for quick access.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedItems).map(
            ([groupName, items]) =>
              items.length > 0 && (
                <div key={groupName}>
                  <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
                    {groupName}
                  </h2>
                  <div className="space-y-3">
                    {items.map((item, index) => {
                      const data = getItemData(item);
                      if (!data) return null;

                      return (
                        <RecentItemCard
                          key={`${item.id}-${index}`}
                          item={item}
                          data={data}
                          url={getItemUrl(item)}
                          formatTime={formatTime}
                        />
                      );
                    })}
                  </div>
                </div>
              )
          )}
        </div>
      )}
    </div>
  );
}

interface RecentItemCardProps {
  item: RecentItem;
  data: Medication | Guideline | Dsm5Criteria;
  url: string;
  formatTime: (date: string) => string;
}

function RecentItemCard({ item, data, url, formatTime }: RecentItemCardProps) {
  const typeIcons = {
    medication: <Pill className="w-4 h-4" />,
    guideline: <BookOpen className="w-4 h-4" />,
    criteria: <ClipboardList className="w-4 h-4" />,
    calculator: <div className="w-4 h-4">🧮</div>,
  };

  const typeColors = {
    medication: 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300',
    guideline: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    criteria: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
    calculator: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  };

  const getTitle = () => {
    if ('name' in data) return data.name;
    if ('title' in data) return data.title;
    if ('disorder' in data) return data.disorder;
    return 'Unknown';
  };

  const getSubtitle = () => {
    if ('genericName' in data) return data.genericName;
    if ('organization' in data) return `${data.organization} • ${data.year}`;
    if ('code' in data) return `${data.category} • ${data.code}`;
    return '';
  };

  return (
    <a
      href={url}
      className="card card-hover p-4 flex items-center gap-4 group"
    >
      <div
        className={cn(
          'w-10 h-10 rounded-lg flex items-center justify-center shrink-0',
          typeColors[item.type]
        )}
      >
        {typeIcons[item.type]}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-slate-900 dark:text-white truncate group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
          {getTitle()}
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 truncate">
          {getSubtitle()}
        </p>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-xs text-slate-400 dark:text-slate-500">
          {formatTime(item.accessedAt)}
        </span>
        <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-sky-500 transition-colors" />
      </div>
    </a>
  );
}

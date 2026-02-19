import { useEffect, useState } from 'react';
import {
  ArrowLeft,
  Heart,
  AlertTriangle,
  Info,
  Pill,
  Activity,
  Beaker,
  Scale,
  Stethoscope,
  Sparkles,
  ChevronRight,
  Play,
  Calendar,
  Clock,
  FileText,
  Shield,
  Baby,
  Zap,
} from 'lucide-react';
import type { Medication } from '../types';
import { cn, getClassColor, getFlagColor, getSeverityColor } from '../utils/classNames';
import { useAppStore } from '../stores/appStore';
import { DrugComparison } from '../components/DrugComparison';

interface MedicationDetailPageProps {
  id: string;
  medications: Medication[];
}

type TabId = 'overview' | 'dosing' | 'safety' | 'interactions' | 'monitoring' | 'pearls';

const tabs: { id: TabId; label: string; icon: React.ReactNode }[] = [
  { id: 'overview', label: 'Overview', icon: <Info className="w-4 h-4" /> },
  { id: 'dosing', label: 'Dosing', icon: <Scale className="w-4 h-4" /> },
  { id: 'safety', label: 'Safety', icon: <Shield className="w-4 h-4" /> },
  { id: 'interactions', label: 'Interactions', icon: <Beaker className="w-4 h-4" /> },
  { id: 'monitoring', label: 'Monitoring', icon: <Stethoscope className="w-4 h-4" /> },
  { id: 'pearls', label: 'Pearls', icon: <Sparkles className="w-4 h-4" /> },
];

export function MedicationDetailPage({ id, medications }: MedicationDetailPageProps) {
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [showComparison, setShowComparison] = useState(false);
  const [showQuickStart, setShowQuickStart] = useState(false);
  const { favorites, addFavorite, removeFavorite, addRecentItem, setNote, notes } = useAppStore();
  
  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  const medication = medications.find((m) => m.id === id);
  const isFavorite = favorites.includes(id);

  useEffect(() => {
    if (medication) {
      addRecentItem({
        id: medication.id,
        type: 'medication',
        name: medication.name,
      });
    }
  }, [medication, addRecentItem]);

  if (!medication) {
    return (
      <div className="card p-12 text-center">
        <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
          <Pill className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
          Medication not found
        </h3>
        <button onClick={() => navigate('/medications')} className="btn-primary mt-4">
          <ArrowLeft className="w-4 h-4" />
          Back to medications
        </button>
      </div>
    );
  }

  const toggleFavorite = () => {
    if (isFavorite) {
      removeFavorite(id);
    } else {
      addFavorite(id);
    }
  };

  const relatedMeds = medications.filter(
    (m) => m.class === medication.class && m.id !== medication.id
  );

  return (
    <div className="space-y-6">
      {/* Back button */}
      <button
        onClick={() => navigate('/medications')}
        className="inline-flex items-center gap-1.5 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm">Back to medications</span>
      </button>

      {/* Header Card */}
      <div className="card p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div
              className={cn(
                'w-16 h-16 rounded-xl flex items-center justify-center text-2xl font-bold shrink-0',
                getClassColor(medication.class)
              )}
            >
              {medication.name.slice(0, 2)}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                {medication.name}
              </h1>
              <p className="text-slate-500 dark:text-slate-400">
                {medication.genericName}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span
                  className={cn(
                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                    getClassColor(medication.class)
                  )}
                >
                  {medication.class}
                </span>
                {medication.pregnancyCategory && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                    <Baby className="w-3 h-3 mr-1" />
                    Pregnancy: {medication.pregnancyCategory}
                  </span>
                )}
                {medication.qtRisk && medication.qtRisk !== 'none' && (
                  <span className={cn(
                    'inline-flex items-center px-2 py-0.5 rounded text-xs',
                    medication.qtRisk === 'low' 
                      ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                      : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                  )}>
                    <Zap className="w-3 h-3 mr-1" />
                    QT: {medication.qtRisk}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowComparison(!showComparison)}
              className={cn(
                'p-3 rounded-full transition-all',
                showComparison
                  ? 'text-sky-500 bg-sky-50 dark:bg-sky-900/20'
                  : 'text-slate-300 hover:text-sky-500 hover:bg-sky-50 dark:hover:bg-sky-900/20'
              )}
              title="Compare with similar medications"
            >
              <Scale className="w-5 h-5" />
            </button>
            <button
              onClick={toggleFavorite}
              className={cn(
                'p-3 rounded-full transition-all',
                isFavorite
                  ? 'text-red-500 bg-red-50 dark:bg-red-900/20'
                  : 'text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
              )}
            >
              <Heart className={cn('w-6 h-6', isFavorite && 'fill-current')} />
            </button>
          </div>
        </div>

        {/* Quick Flags */}
        {medication.quickFlags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-slate-200 dark:border-slate-700/50">
            {medication.quickFlags.map((flag) => (
              <span
                key={flag}
                className={cn(
                  'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium',
                  getFlagColor(flag)
                )}
              >
                {flag}
              </span>
            ))}
          </div>
        )}

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-slate-200 dark:border-slate-700/50">
          <button
            onClick={() => setShowQuickStart(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors"
          >
            <Play className="w-4 h-4" />
            Quick Start
          </button>
          <a
            href={`/interactions?med=${medication.id}`}
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-lg font-medium transition-colors"
          >
            <Beaker className="w-4 h-4" />
            Check Interactions
          </a>
          {relatedMeds.length > 0 && (
            <button
              onClick={() => setShowComparison(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-lg font-medium transition-colors"
            >
              <Scale className="w-4 h-4" />
              Compare
            </button>
          )}
        </div>
      </div>

      {/* Quick Start Modal */}
      {showQuickStart && (
        <QuickStartModal
          medication={medication}
          onClose={() => setShowQuickStart(false)}
          onSave={(note) => {
            setNote(medication.id, note);
            setShowQuickStart(false);
          }}
          existingNote={notes[medication.id]}
        />
      )}

      {/* Comparison Section */}
      {showComparison && (
        <DrugComparison
          medications={medications}
          initialDrugs={[medication.id, ...relatedMeds.slice(0, 2).map(m => m.id)]}
          onClose={() => setShowComparison(false)}
        />
      )}

      {/* Tabs */}
      <div className="border-b border-slate-200 dark:border-slate-700 overflow-x-auto">
        <div className="flex gap-1 min-w-max">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors',
                activeTab === tab.id
                  ? 'border-sky-500 text-sky-600 dark:text-sky-400'
                  : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'
              )}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="animate-fade-in">
        {activeTab === 'overview' && <OverviewTab medication={medication} />}
        {activeTab === 'dosing' && <DosingTab medication={medication} />}
        {activeTab === 'safety' && <SafetyTab medication={medication} />}
        {activeTab === 'interactions' && <InteractionsTab medication={medication} />}
        {activeTab === 'monitoring' && <MonitoringTab medication={medication} />}
        {activeTab === 'pearls' && <PearlsTab medication={medication} />}
      </div>

      {/* Personal Notes */}
      <div className="card p-5">
        <h3 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
          <FileText className="w-5 h-5 text-sky-500" />
          Personal Notes
        </h3>
        <textarea
          value={notes[medication.id] || ''}
          onChange={(e) => setNote(medication.id, e.target.value)}
          placeholder="Add your personal notes, patient experiences, or reminders..."
          className="input min-h-[100px] resize-y"
        />
      </div>

      {/* Citations */}
      {medication.citations.length > 0 && (
        <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
          <p className="text-xs text-slate-400 dark:text-slate-500">
            <strong>References:</strong> {medication.citations.join('; ')}
          </p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">
            Last updated: {new Date(medication.updatedAt).toLocaleDateString()}
          </p>
        </div>
      )}
    </div>
  );
}

function QuickStartModal({
  medication,
  onClose,
  onSave,
  existingNote,
}: {
  medication: Medication;
  onClose: () => void;
  onSave: (note: string) => void;
  existingNote?: string;
}) {
  const [plan, setPlan] = useState({
    startDate: new Date().toISOString().split('T')[0],
    startingDose: medication.dosing.adult.start,
    targetDose: medication.dosing.adult.maintenance.split('-')[0] || medication.dosing.adult.maintenance,
    followUp: '2 weeks',
    notes: existingNote || '',
  });

  const generateNote = () => {
    const note = `Started ${medication.name} on ${plan.startDate}
Starting dose: ${plan.startingDose}
Target dose: ${plan.targetDose}
Follow-up: ${plan.followUp}
${plan.notes ? `\nNotes: ${plan.notes}` : ''}`;
    onSave(note);
  };

  return (
    <div className="card p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
          <Play className="w-5 h-5 text-green-500" />
          Quick Start: {medication.name}
        </h3>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
          ✕
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Start Date
          </label>
          <input
            type="date"
            value={plan.startDate}
            onChange={(e) => setPlan({ ...plan, startDate: e.target.value })}
            className="input"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Follow-up
          </label>
          <select
            value={plan.followUp}
            onChange={(e) => setPlan({ ...plan, followUp: e.target.value })}
            className="input"
          >
            <option>1 week</option>
            <option>2 weeks</option>
            <option>4 weeks</option>
            <option>6 weeks</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Starting Dose
          </label>
          <input
            type="text"
            value={plan.startingDose}
            onChange={(e) => setPlan({ ...plan, startingDose: e.target.value })}
            className="input"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Target Dose
          </label>
          <input
            type="text"
            value={plan.targetDose}
            onChange={(e) => setPlan({ ...plan, targetDose: e.target.value })}
            className="input"
          />
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          Additional Notes
        </label>
        <textarea
          value={plan.notes}
          onChange={(e) => setPlan({ ...plan, notes: e.target.value })}
          placeholder="Patient-specific notes, side effects to watch for, etc."
          className="input min-h-[80px] resize-y"
        />
      </div>

      <div className="flex gap-3">
        <button onClick={generateNote} className="btn-primary flex-1">
          <Calendar className="w-4 h-4" />
          Save to Notes
        </button>
        <button onClick={onClose} className="btn-secondary">
          Cancel
        </button>
      </div>
    </div>
  );
}

function OverviewTab({ medication }: { medication: Medication }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="space-y-6">
        {/* Key Info Summary */}
        <div className="card p-5">
          <h2 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Info className="w-5 h-5 text-sky-500" />
            Key Information
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500 dark:text-slate-400">Starting Dose</span>
              <span className="font-medium text-slate-900 dark:text-white">{medication.dosing.adult.start}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500 dark:text-slate-400">Maintenance</span>
              <span className="font-medium text-slate-900 dark:text-white">{medication.dosing.adult.maintenance}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500 dark:text-slate-400">Maximum</span>
              <span className="font-medium text-slate-900 dark:text-white">{medication.dosing.adult.max}</span>
            </div>
            {medication.dosing.notes && (
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                <Info className="w-4 h-4 inline mr-1" />
                {medication.dosing.notes}
              </p>
            )}
          </div>
        </div>

        {/* Indications */}
        <div className="card p-5">
          <h2 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-sky-500" />
            Indications
          </h2>
          <div className="flex flex-wrap gap-2">
            {medication.indications.map((indication) => (
              <span
                key={indication}
                className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
              >
                {indication}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Top Side Effects */}
        <div className="card p-5">
          <h2 className="font-semibold text-slate-900 dark:text-white mb-4">
            Common Side Effects
          </h2>
          <div className="space-y-2">
            {medication.sideEffects.slice(0, 5).map((effect, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800 last:border-0"
              >
                <span className="text-slate-700 dark:text-slate-300">{effect.effect}</span>
                <span
                  className={cn(
                    'text-xs px-2 py-0.5 rounded-full',
                    effect.frequency === 'very-common' &&
                      'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
                    effect.frequency === 'common' &&
                      'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
                    effect.frequency === 'uncommon' &&
                      'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                  )}
                >
                  {effect.frequency}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Titration Schedule if available */}
        {medication.titrationSchedule && medication.titrationSchedule.length > 0 && (
          <div className="card p-5">
            <h2 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-sky-500" />
              Titration Schedule
            </h2>
            <div className="space-y-2">
              {medication.titrationSchedule.map((step, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 p-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg"
                >
                  <span className="text-xs font-medium text-slate-500 w-12">Week {step.week}</span>
                  <span className="font-medium text-slate-900 dark:text-white">{step.dose}</span>
                  {step.notes && (
                    <span className="text-xs text-slate-500 ml-auto">{step.notes}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function DosingTab({ medication }: { medication: Medication }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Adult Dosing */}
      <div className="card p-5">
        <h2 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <Scale className="w-5 h-5 text-sky-500" />
          Adult Dosing
        </h2>
        <div className="space-y-4">
          <DosingRow label="Starting" value={medication.dosing.adult.start} />
          <DosingRow label="Titration" value={medication.dosing.adult.titration} />
          <DosingRow label="Maintenance" value={medication.dosing.adult.maintenance} />
          <DosingRow label="Maximum" value={medication.dosing.adult.max} />
        </div>
        {medication.dosing.notes && (
          <div className="mt-4 p-3 bg-sky-50 dark:bg-sky-900/20 rounded-lg">
            <p className="text-sm text-sky-700 dark:text-sky-300">
              <Info className="w-4 h-4 inline mr-1" />
              {medication.dosing.notes}
            </p>
          </div>
        )}
      </div>

      {/* Special Populations */}
      <div className="space-y-6">
        {medication.dosing.geriatric && (
          <div className="card p-5">
            <h2 className="font-semibold text-slate-900 dark:text-white mb-4">
              Geriatric Dosing
            </h2>
            <div className="space-y-3">
              <DosingRow label="Starting" value={medication.dosing.geriatric.start} />
              <DosingRow label="Maintenance" value={medication.dosing.geriatric.maintenance} />
              {medication.dosing.geriatric.notes && (
                <p className="text-sm text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg">
                  <AlertTriangle className="w-4 h-4 inline mr-1" />
                  {medication.dosing.geriatric.notes}
                </p>
              )}
            </div>
          </div>
        )}

        {(medication.dosing.renal || medication.dosing.hepatic) && (
          <div className="card p-5">
            <h2 className="font-semibold text-slate-900 dark:text-white mb-4">
              Organ Impairment
            </h2>
            <div className="space-y-3">
              {medication.dosing.renal && (
                <DosingRow label="Renal" value={medication.dosing.renal} />
              )}
              {medication.dosing.hepatic && (
                <DosingRow label="Hepatic" value={medication.dosing.hepatic} />
              )}
            </div>
          </div>
        )}
      </div>

      {/* Titration Schedule */}
      {medication.titrationSchedule && medication.titrationSchedule.length > 0 && (
        <div className="card p-5 lg:col-span-2">
          <h2 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-sky-500" />
            Titration Schedule
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {medication.titrationSchedule.map((step, idx) => (
              <div
                key={idx}
                className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg"
              >
                <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Week {step.week}</div>
                <div className="font-semibold text-slate-900 dark:text-white">{step.dose}</div>
                {step.notes && (
                  <div className="text-xs text-slate-500 mt-1">{step.notes}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Dose Equivalents */}
      {medication.equivalents && medication.equivalents.length > 0 && (
        <div className="card p-5">
          <h2 className="font-semibold text-slate-900 dark:text-white mb-4">
            Dose Equivalents
          </h2>
          <div className="space-y-2">
            {medication.equivalents.map((eq, idx) => (
              <div key={idx} className="flex items-center justify-between py-2 text-sm">
                <span className="text-slate-600 dark:text-slate-400">{eq.fromDrug}</span>
                <span className="text-slate-400">≈</span>
                <span className="font-medium text-slate-900 dark:text-white">{eq.toDose}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function SafetyTab({ medication }: { medication: Medication }) {
  return (
    <div className="space-y-6">
      {/* Warnings */}
      {medication.warnings.length > 0 && (
        <div className="card p-5 border-l-4 border-l-red-500">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <h2 className="font-semibold text-slate-900 dark:text-white">
              Warnings & Precautions
            </h2>
          </div>
          <ul className="space-y-3">
            {medication.warnings.map((warning, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300"
              >
                <span className="text-red-500 mt-1">•</span>
                {warning}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Side Effects */}
        <div className="card p-5">
          <h2 className="font-semibold text-slate-900 dark:text-white mb-4">
            Side Effects
          </h2>
          <div className="space-y-2">
            {medication.sideEffects.map((effect, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800 last:border-0"
              >
                <div>
                  <span className="text-slate-700 dark:text-slate-300">{effect.effect}</span>
                  {effect.management && (
                    <p className="text-xs text-slate-500">{effect.management}</p>
                  )}
                </div>
                <span
                  className={cn(
                    'text-xs px-2 py-0.5 rounded-full',
                    effect.frequency === 'very-common' &&
                      'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
                    effect.frequency === 'common' &&
                      'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
                    effect.frequency === 'uncommon' &&
                      'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
                    effect.frequency === 'rare' &&
                      'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                  )}
                >
                  {effect.frequency}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Cautions */}
        {medication.cautions && (
          <div className="card p-5">
            <h2 className="font-semibold text-slate-900 dark:text-white mb-4">
              Special Cautions
            </h2>
            <div className="space-y-3">
              {medication.cautions.renal && (
                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Renal:</span>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{medication.cautions.renal}</p>
                </div>
              )}
              {medication.cautions.hepatic && (
                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Hepatic:</span>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{medication.cautions.hepatic}</p>
                </div>
              )}
              {medication.cautions.cardiac && (
                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Cardiac:</span>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{medication.cautions.cardiac}</p>
                </div>
              )}
              {medication.cautions.bipolar && (
                <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                  <span className="text-sm font-medium text-amber-700 dark:text-amber-300">Bipolar:</span>
                  <p className="text-sm text-amber-600 dark:text-amber-400">{medication.cautions.bipolar}</p>
                </div>
              )}
              {medication.cautions.seizure && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <span className="text-sm font-medium text-red-700 dark:text-red-300">Seizure:</span>
                  <p className="text-sm text-red-600 dark:text-red-400">{medication.cautions.seizure}</p>
                </div>
              )}
              {medication.cautions.other?.map((caution, idx) => (
                <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg text-sm text-slate-600 dark:text-slate-400">
                  • {caution}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function InteractionsTab({ medication }: { medication: Medication }) {
  if (medication.interactions.length === 0) {
    return (
      <div className="card p-12 text-center">
        <Beaker className="w-12 h-12 text-slate-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
          No known significant interactions
        </h3>
        <p className="text-slate-500 dark:text-slate-400">
          Always check for drug interactions in complex cases
        </p>
      </div>
    );
  }

  const grouped = {
    contraindicated: medication.interactions.filter((i) => i.severity === 'contraindicated'),
    major: medication.interactions.filter((i) => i.severity === 'major'),
    moderate: medication.interactions.filter((i) => i.severity === 'moderate'),
    minor: medication.interactions.filter((i) => i.severity === 'minor'),
  };

  return (
    <div className="space-y-6">
      {grouped.contraindicated.length > 0 && (
        <div className="card p-5 border-l-4 border-l-red-500">
          <h2 className="font-semibold text-red-600 dark:text-red-400 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Contraindicated
          </h2>
          <div className="space-y-4">
            {grouped.contraindicated.map((interaction, idx) => (
              <InteractionCard key={idx} interaction={interaction} />
            ))}
          </div>
        </div>
      )}

      {grouped.major.length > 0 && (
        <div className="card p-5 border-l-4 border-l-orange-500">
          <h2 className="font-semibold text-orange-600 dark:text-orange-400 mb-4">
            Major Interactions
          </h2>
          <div className="space-y-4">
            {grouped.major.map((interaction, idx) => (
              <InteractionCard key={idx} interaction={interaction} />
            ))}
          </div>
        </div>
      )}

      {grouped.moderate.length > 0 && (
        <div className="card p-5">
          <h2 className="font-semibold text-amber-600 dark:text-amber-400 mb-4">
            Moderate Interactions
          </h2>
          <div className="space-y-4">
            {grouped.moderate.map((interaction, idx) => (
              <InteractionCard key={idx} interaction={interaction} />
            ))}
          </div>
        </div>
      )}

      {grouped.minor.length > 0 && (
        <div className="card p-5">
          <h2 className="font-semibold text-slate-600 dark:text-slate-400 mb-4">
            Minor Interactions
          </h2>
          <div className="space-y-4">
            {grouped.minor.map((interaction, idx) => (
              <InteractionCard key={idx} interaction={interaction} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function InteractionCard({ interaction }: { interaction: Medication['interactions'][0] }) {
  return (
    <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
      <div className="flex items-center gap-2 mb-2">
        <span
          className={cn(
            'text-xs px-2 py-0.5 rounded font-medium',
            getSeverityColor(interaction.severity)
          )}
        >
          {interaction.severity}
        </span>
        <span className="font-medium text-slate-900 dark:text-white">{interaction.drug}</span>
      </div>
      <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
        <strong>Mechanism:</strong> {interaction.mechanism}
      </p>
      <p className="text-sm text-slate-600 dark:text-slate-400">
        <strong>Recommendation:</strong> {interaction.recommendation}
      </p>
    </div>
  );
}

function MonitoringTab({ medication }: { medication: Medication }) {
  return (
    <div className="card p-5">
      <h2 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
        <Stethoscope className="w-5 h-5 text-sky-500" />
        Monitoring Parameters
      </h2>
      <div className="space-y-4">
        {medication.monitoring.map((item, idx) => (
          <div key={idx} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
            <div className="flex items-start justify-between mb-2">
              <span className="font-medium text-slate-900 dark:text-white">{item.parameter}</span>
              {item.baseline && (
                <span className="text-xs px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full">
                  Baseline required
                </span>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-slate-500 dark:text-slate-400">Follow-up: </span>
                <span className="text-slate-700 dark:text-slate-300">{item.followUp}</span>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400">Frequency: </span>
                <span className="text-slate-700 dark:text-slate-300">{item.frequency}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PearlsTab({ medication }: { medication: Medication }) {
  return (
    <div className="space-y-6">
      {/* Clinical Pearls */}
      <div className="card p-5">
        <h2 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-sky-500" />
          Clinical Pearls
        </h2>
        <ul className="space-y-3">
          {medication.clinicalPearls.map((pearl, idx) => (
            <li
              key={idx}
              className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg"
            >
              <span className="text-sky-500 mt-0.5">→</span>
              <span className="text-slate-700 dark:text-slate-300">{pearl}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Tags */}
      <div className="card p-5">
        <h2 className="font-semibold text-slate-900 dark:text-white mb-4">Tags</h2>
        <div className="flex flex-wrap gap-2">
          {medication.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function DosingRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-sm text-slate-500 dark:text-slate-400">{label}</span>
      <span className="text-sm font-medium text-slate-900 dark:text-white text-right">
        {value}
      </span>
    </div>
  );
}

import { useEffect } from 'react';
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
} from 'lucide-react';
import type { Medication } from '../types';
import { cn, getClassColor, getFlagColor, getSeverityColor } from '../utils/classNames';
import { useAppStore } from '../stores/appStore';

interface MedicationDetailPageProps {
  id: string;
  medications: Medication[];
}

export function MedicationDetailPage({ id, medications }: MedicationDetailPageProps) {
  const { favorites, addFavorite, removeFavorite, addRecentItem } = useAppStore();
  
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
                    Pregnancy: {medication.pregnancyCategory}
                  </span>
                )}
              </div>
            </div>
          </div>
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
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Dosing Information */}
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-4">
              <Scale className="w-5 h-5 text-sky-500" />
              <h2 className="font-semibold text-slate-900 dark:text-white">
                Dosing Information
              </h2>
            </div>
            <div className="space-y-4">
              <DosingRow label="Starting" value={medication.dosing.adult.start} />
              <DosingRow label="Titration" value={medication.dosing.adult.titration} />
              <DosingRow label="Maintenance" value={medication.dosing.adult.maintenance} />
              <DosingRow label="Maximum" value={medication.dosing.adult.max} />
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
            <div className="flex items-center gap-2 mb-4">
              <Activity className="w-5 h-5 text-sky-500" />
              <h2 className="font-semibold text-slate-900 dark:text-white">
                Indications
              </h2>
            </div>
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

          {/* Side Effects */}
          {medication.sideEffects.length > 0 && (
            <div className="card p-5">
              <h2 className="font-semibold text-slate-900 dark:text-white mb-4">
                Common Side Effects
              </h2>
              <div className="space-y-2">
                {medication.sideEffects.map((effect, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800 last:border-0"
                  >
                    <span className="text-slate-700 dark:text-slate-300">
                      {effect.effect}
                    </span>
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
          )}
        </div>

        {/* Right Column */}
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
              <ul className="space-y-2">
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

          {/* Drug Interactions */}
          {medication.interactions.length > 0 && (
            <div className="card p-5">
              <div className="flex items-center gap-2 mb-4">
                <Beaker className="w-5 h-5 text-sky-500" />
                <h2 className="font-semibold text-slate-900 dark:text-white">
                  Drug Interactions
                </h2>
              </div>
              <div className="space-y-3">
                {medication.interactions.slice(0, 5).map((interaction, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={cn(
                          'text-xs px-2 py-0.5 rounded font-medium',
                          getSeverityColor(interaction.severity)
                        )}
                      >
                        {interaction.severity}
                      </span>
                      <span className="font-medium text-slate-900 dark:text-white">
                        {interaction.drug}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {interaction.mechanism}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                      <strong>Recommendation:</strong> {interaction.recommendation}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Monitoring */}
          {medication.monitoring.length > 0 && (
            <div className="card p-5">
              <div className="flex items-center gap-2 mb-4">
                <Stethoscope className="w-5 h-5 text-sky-500" />
                <h2 className="font-semibold text-slate-900 dark:text-white">
                  Monitoring
                </h2>
              </div>
              <div className="space-y-3">
                {medication.monitoring.map((item, idx) => (
                  <div key={idx} className="text-sm">
                    <div className="font-medium text-slate-900 dark:text-white">
                      {item.parameter}
                    </div>
                    <div className="text-slate-500 dark:text-slate-400">
                      Baseline: {item.baseline ? 'Yes' : 'No'} • Follow-up:{' '}
                      {item.followUp} • {item.frequency}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Clinical Pearls */}
          {medication.clinicalPearls.length > 0 && (
            <div className="card p-5">
              <h2 className="font-semibold text-slate-900 dark:text-white mb-4">
                Clinical Pearls
              </h2>
              <ul className="space-y-2">
                {medication.clinicalPearls.map((pearl, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400"
                  >
                    <span className="text-sky-500 mt-0.5">→</span>
                    {pearl}
                  </li>
                ))}
              </ul>
            </div>
          )}

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

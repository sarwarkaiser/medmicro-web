import { useState } from 'react';
import { X, Plus, Scale, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import type { Medication } from '../types';
import { cn, getClassColor } from '../utils/classNames';

interface DrugComparisonProps {
  medications: Medication[];
  initialDrugs?: string[];
  onClose?: () => void;
}

export function DrugComparison({ medications, initialDrugs = [], onClose }: DrugComparisonProps) {
  const [selectedDrugs, setSelectedDrugs] = useState<string[]>(initialDrugs.slice(0, 3));
  const [showAddDrug, setShowAddDrug] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const comparedMeds = medications.filter((m) => selectedDrugs.includes(m.id));

  const addDrug = (drugId: string) => {
    if (selectedDrugs.length < 3 && !selectedDrugs.includes(drugId)) {
      setSelectedDrugs([...selectedDrugs, drugId]);
      setShowAddDrug(false);
      setSearchQuery('');
    }
  };

  const removeDrug = (drugId: string) => {
    setSelectedDrugs(selectedDrugs.filter((id) => id !== drugId));
  };

  const availableDrugs = medications.filter(
    (m) =>
      !selectedDrugs.includes(m.id) &&
      (m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.genericName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (comparedMeds.length === 0) {
    return (
      <div className="card p-8 text-center">
        <Scale className="w-12 h-12 text-slate-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
          Compare Medications
        </h3>
        <p className="text-slate-500 dark:text-slate-400 mb-4">
          Select medications to compare side-by-side
        </p>
        <button onClick={() => setShowAddDrug(true)} className="btn-primary">
          <Plus className="w-4 h-4" />
          Add Medication
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Scale className="w-5 h-5 text-sky-500" />
          <h3 className="font-semibold text-slate-900 dark:text-white">
            Drug Comparison
          </h3>
          <span className="text-sm text-slate-500 dark:text-slate-400">
            ({comparedMeds.length}/3)
          </span>
        </div>
        <div className="flex items-center gap-2">
          {selectedDrugs.length < 3 && (
            <button
              onClick={() => setShowAddDrug(true)}
              className="btn-secondary text-sm"
            >
              <Plus className="w-4 h-4" />
              Add
            </button>
          )}
          {onClose && (
            <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
              <X className="w-5 h-5 text-slate-500" />
            </button>
          )}
        </div>
      </div>

      {/* Add Drug Modal */}
      {showAddDrug && (
        <div className="card p-4 animate-fade-in">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search medications..."
            className="input mb-3"
            autoFocus
          />
          <div className="max-h-48 overflow-y-auto space-y-1">
            {availableDrugs.slice(0, 10).map((med) => (
              <button
                key={med.id}
                onClick={() => addDrug(med.id)}
                className="w-full text-left p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg flex items-center gap-3"
              >
                <div
                  className={cn(
                    'w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold',
                    getClassColor(med.class)
                  )}
                >
                  {med.name.slice(0, 2)}
                </div>
                <div>
                  <div className="font-medium text-slate-900 dark:text-white text-sm">
                    {med.name}
                  </div>
                  <div className="text-xs text-slate-500">{med.genericName}</div>
                </div>
              </button>
            ))}
            {availableDrugs.length === 0 && (
              <p className="text-sm text-slate-500 text-center py-4">
                No medications found
              </p>
            )}
          </div>
        </div>
      )}

      {/* Comparison Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left p-3 bg-slate-50 dark:bg-slate-800/50 rounded-tl-lg text-sm font-medium text-slate-700 dark:text-slate-300 sticky left-0 min-w-[120px]">
                Feature
              </th>
              {comparedMeds.map((med) => (
                <th
                  key={med.id}
                  className="p-3 bg-slate-50 dark:bg-slate-800/50 min-w-[180px]"
                >
                  <div className="flex items-start justify-between">
                    <div className="text-left">
                      <div
                        className={cn(
                          'w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold mb-2',
                          getClassColor(med.class)
                        )}
                      >
                        {med.name.slice(0, 2)}
                      </div>
                      <div className="font-semibold text-slate-900 dark:text-white">
                        {med.name}
                      </div>
                      <div className="text-xs text-slate-500">{med.genericName}</div>
                    </div>
                    <button
                      onClick={() => removeDrug(med.id)}
                      className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded"
                    >
                      <X className="w-4 h-4 text-slate-400" />
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
            {/* Class */}
            <tr>
              <td className="p-3 text-sm font-medium text-slate-600 dark:text-slate-400 sticky left-0 bg-white dark:bg-slate-800">
                Class
              </td>
              {comparedMeds.map((med) => (
                <td key={med.id} className="p-3">
                  <span
                    className={cn(
                      'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium',
                      getClassColor(med.class)
                    )}
                  >
                    {med.class}
                  </span>
                </td>
              ))}
            </tr>

            {/* Indications */}
            <tr>
              <td className="p-3 text-sm font-medium text-slate-600 dark:text-slate-400 sticky left-0 bg-white dark:bg-slate-800 align-top">
                Indications
              </td>
              {comparedMeds.map((med) => (
                <td key={med.id} className="p-3">
                  <div className="flex flex-wrap gap-1">
                    {med.indications.slice(0, 3).map((ind) => (
                      <span
                        key={ind}
                        className="text-xs text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded"
                      >
                        {ind}
                      </span>
                    ))}
                  </div>
                </td>
              ))}
            </tr>

            {/* Starting Dose */}
            <tr>
              <td className="p-3 text-sm font-medium text-slate-600 dark:text-slate-400 sticky left-0 bg-white dark:bg-slate-800">
                Starting Dose
              </td>
              {comparedMeds.map((med) => (
                <td key={med.id} className="p-3 text-sm text-slate-700 dark:text-slate-300">
                  {med.dosing.adult.start}
                </td>
              ))}
            </tr>

            {/* Maintenance */}
            <tr>
              <td className="p-3 text-sm font-medium text-slate-600 dark:text-slate-400 sticky left-0 bg-white dark:bg-slate-800">
                Maintenance
              </td>
              {comparedMeds.map((med) => (
                <td key={med.id} className="p-3 text-sm text-slate-700 dark:text-slate-300">
                  {med.dosing.adult.maintenance}
                </td>
              ))}
            </tr>

            {/* Common Side Effects */}
            <tr>
              <td className="p-3 text-sm font-medium text-slate-600 dark:text-slate-400 sticky left-0 bg-white dark:bg-slate-800 align-top">
                Common Side Effects
              </td>
              {comparedMeds.map((med) => (
                <td key={med.id} className="p-3">
                  <div className="space-y-1">
                    {med.sideEffects.slice(0, 4).map((se) => (
                      <div
                        key={se.effect}
                        className="text-xs text-slate-600 dark:text-slate-400"
                      >
                        • {se.effect}
                      </div>
                    ))}
                  </div>
                </td>
              ))}
            </tr>

            {/* Weight Effect */}
            <tr>
              <td className="p-3 text-sm font-medium text-slate-600 dark:text-slate-400 sticky left-0 bg-white dark:bg-slate-800">
                Weight Effect
              </td>
              {comparedMeds.map((med) => {
                const hasWeightGain = med.quickFlags.includes('Weight-gain');
                const hasWeightLoss = med.quickFlags.includes('Weight-loss');
                const weightNeutral = med.quickFlags.includes('Weight-neutral');
                return (
                  <td key={med.id} className="p-3">
                    {hasWeightGain ? (
                      <span className="inline-flex items-center gap-1 text-xs text-red-600 dark:text-red-400">
                        <XCircle className="w-3 h-3" />
                        Weight gain
                      </span>
                    ) : hasWeightLoss ? (
                      <span className="inline-flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                        <CheckCircle className="w-3 h-3" />
                        Weight loss
                      </span>
                    ) : weightNeutral ? (
                      <span className="inline-flex items-center gap-1 text-xs text-slate-600 dark:text-slate-400">
                        Weight neutral
                      </span>
                    ) : (
                      <span className="text-xs text-slate-400">-</span>
                    )}
                  </td>
                );
              })}
            </tr>

            {/* Sedation */}
            <tr>
              <td className="p-3 text-sm font-medium text-slate-600 dark:text-slate-400 sticky left-0 bg-white dark:bg-slate-800">
                Sedation
              </td>
              {comparedMeds.map((med) => {
                const isSedating = med.quickFlags.includes('Sedating');
                const isActivating = med.quickFlags.includes('Activating');
                return (
                  <td key={med.id} className="p-3">
                    {isSedating ? (
                      <span className="text-xs text-amber-600 dark:text-amber-400">
                        Sedating (bedtime)
                      </span>
                    ) : isActivating ? (
                      <span className="text-xs text-sky-600 dark:text-sky-400">
                        Activating (morning)
                      </span>
                    ) : (
                      <span className="text-xs text-slate-400">Neutral</span>
                    )}
                  </td>
                );
              })}
            </tr>

            {/* QT Risk */}
            <tr>
              <td className="p-3 text-sm font-medium text-slate-600 dark:text-slate-400 sticky left-0 bg-white dark:bg-slate-800">
                QT Risk
              </td>
              {comparedMeds.map((med) => (
                <td key={med.id} className="p-3">
                  {med.qtRisk === 'none' || !med.qtRisk ? (
                    <span className="inline-flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                      <CheckCircle className="w-3 h-3" />
                      QT Safe
                    </span>
                  ) : med.qtRisk === 'low' ? (
                    <span className="text-xs text-amber-600 dark:text-amber-400">
                      Low risk
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs text-red-600 dark:text-red-400">
                      <AlertCircle className="w-3 h-3" />
                      Caution
                    </span>
                  )}
                </td>
              ))}
            </tr>

            {/* Pregnancy */}
            <tr>
              <td className="p-3 text-sm font-medium text-slate-600 dark:text-slate-400 sticky left-0 bg-white dark:bg-slate-800">
                Pregnancy
              </td>
              {comparedMeds.map((med) => (
                <td key={med.id} className="p-3">
                  {med.quickFlags.includes('Pregnancy-safe') ? (
                    <span className="inline-flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                      <CheckCircle className="w-3 h-3" />
                      Generally safe
                    </span>
                  ) : med.pregnancyCategory ? (
                    <span className="text-xs text-slate-600 dark:text-slate-400">
                      Category {med.pregnancyCategory}
                    </span>
                  ) : (
                    <span className="text-xs text-slate-400">-</span>
                  )}
                </td>
              ))}
            </tr>

            {/* Key Pearls */}
            <tr>
              <td className="p-3 text-sm font-medium text-slate-600 dark:text-slate-400 sticky left-0 bg-white dark:bg-slate-800 align-top">
                Key Pearls
              </td>
              {comparedMeds.map((med) => (
                <td key={med.id} className="p-3">
                  <div className="space-y-1">
                    {med.clinicalPearls.slice(0, 2).map((pearl, idx) => (
                      <div
                        key={idx}
                        className="text-xs text-slate-600 dark:text-slate-400"
                      >
                        • {pearl}
                      </div>
                    ))}
                  </div>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

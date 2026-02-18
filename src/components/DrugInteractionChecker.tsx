import { useState } from 'react';
import { AlertTriangle, Plus, X, Search, ShieldAlert } from 'lucide-react';
import { cn, getSeverityColor } from '../utils/classNames';
import type { Medication, InteractionResult } from '../types';

interface DrugInteractionCheckerProps {
  medications: Medication[];
  onCheck: (drugNames: string[]) => Promise<InteractionResult[]>;
}

export function DrugInteractionChecker({ medications, onCheck }: DrugInteractionCheckerProps) {
  const [selectedDrugs, setSelectedDrugs] = useState<Medication[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [interactions, setInteractions] = useState<InteractionResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const filteredMeds = medications.filter(
    (m) =>
      !selectedDrugs.find((sd) => sd.id === m.id) &&
      (m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.genericName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const addDrug = (med: Medication) => {
    setSelectedDrugs([...selectedDrugs, med]);
    setSearchQuery('');
    setShowResults(false);
  };

  const removeDrug = (id: string) => {
    setSelectedDrugs(selectedDrugs.filter((d) => d.id !== id));
    setShowResults(false);
  };

  const checkInteractions = async () => {
    if (selectedDrugs.length < 2) return;
    setLoading(true);
    const results = await onCheck(selectedDrugs.map((d) => d.name));
    setInteractions(results);
    setShowResults(true);
    setLoading(false);
  };

  const severityOrder = ['contraindicated', 'major', 'moderate', 'minor'];
  const groupedInteractions = severityOrder.map((severity) => ({
    severity,
    items: interactions.filter((i) => i.severity === severity),
  }));

  return (
    <div className="space-y-6">
      {/* Selected Drugs */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
          Selected Medications
        </h3>

        {selectedDrugs.length === 0 ? (
          <div className="text-center py-8 text-slate-500 dark:text-slate-400">
            <p>Add medications to check for interactions</p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2 mb-4">
            {selectedDrugs.map((drug) => (
              <div
                key={drug.id}
                className="flex items-center gap-2 px-3 py-2 bg-sky-50 dark:bg-sky-900/20 text-sky-700 dark:text-sky-300 rounded-lg border border-sky-200 dark:border-sky-800"
              >
                <span className="font-medium">{drug.name}</span>
                <button
                  onClick={() => removeDrug(drug.id)}
                  className="p-0.5 hover:bg-sky-100 dark:hover:bg-sky-800 rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Add Drug Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search to add medication..."
            className="input pl-10"
          />
          {searchQuery && (
            <div className="absolute z-10 left-0 right-0 mt-1 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 max-h-60 overflow-auto">
              {filteredMeds.length === 0 ? (
                <div className="p-3 text-slate-500 text-sm">No medications found</div>
              ) : (
                filteredMeds.slice(0, 10).map((med) => (
                  <button
                    key={med.id}
                    onClick={() => addDrug(med)}
                    className="w-full px-4 py-2 text-left hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center justify-between"
                  >
                    <div>
                      <span className="font-medium text-slate-900 dark:text-white">
                        {med.name}
                      </span>
                      <span className="text-sm text-slate-500 dark:text-slate-400 ml-2">
                        {med.genericName}
                      </span>
                    </div>
                    <Plus className="w-4 h-4 text-slate-400" />
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        {/* Check Button */}
        <button
          onClick={checkInteractions}
          disabled={selectedDrugs.length < 2 || loading}
          className={cn(
            'btn-primary w-full mt-4',
            (selectedDrugs.length < 2 || loading) && 'opacity-50 cursor-not-allowed'
          )}
        >
          {loading ? (
            <span>Checking...</span>
          ) : (
            <>
              <ShieldAlert className="w-5 h-5" />
              <span>
                Check Interactions
                {selectedDrugs.length >= 2 && ` (${selectedDrugs.length} drugs)`}
              </span>
            </>
          )}
        </button>
      </div>

      {/* Results */}
      {showResults && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              Interaction Results
            </h3>
            <span
              className={cn(
                'px-3 py-1 rounded-full text-sm font-medium',
                interactions.length === 0
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                  : interactions.some((i) => i.severity === 'contraindicated')
                  ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                  : interactions.some((i) => i.severity === 'major')
                  ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300'
                  : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300'
              )}
            >
              {interactions.length === 0
                ? 'No interactions found'
                : `${interactions.length} interaction(s) found`}
            </span>
          </div>

          {interactions.length === 0 ? (
            <div className="card p-8 text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShieldAlert className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                No Known Interactions
              </h4>
              <p className="text-slate-500 dark:text-slate-400">
                No significant drug-drug interactions were found between the selected medications.
              </p>
              <p className="text-sm text-slate-400 dark:text-slate-500 mt-2">
                Always verify with a pharmacist and consider patient-specific factors.
              </p>
            </div>
          ) : (
            groupedInteractions.map(
              ({ severity, items }) =>
                items.length > 0 && (
                  <div key={severity} className="space-y-3">
                    <h4
                      className={cn(
                        'font-semibold flex items-center gap-2',
                        severity === 'contraindicated' && 'text-red-600 dark:text-red-400',
                        severity === 'major' && 'text-orange-600 dark:text-orange-400',
                        severity === 'moderate' && 'text-yellow-600 dark:text-yellow-400',
                        severity === 'minor' && 'text-blue-600 dark:text-blue-400'
                      )}
                    >
                      <AlertTriangle className="w-5 h-5" />
                      {severity.charAt(0).toUpperCase() + severity.slice(1)} ({items.length})
                    </h4>
                    {items.map((interaction, idx) => (
                      <div
                        key={idx}
                        className={cn(
                          'card p-4 border-l-4',
                          getSeverityColor(severity)
                        )}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h5 className="font-semibold text-slate-900 dark:text-white">
                            {interaction.drug1} + {interaction.drug2}
                          </h5>
                          <span
                            className={cn(
                              'px-2 py-0.5 rounded text-xs font-medium uppercase',
                              getSeverityColor(severity)
                            )}
                          >
                            {severity}
                          </span>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="font-medium text-slate-700 dark:text-slate-300">
                              Mechanism:
                            </span>{' '}
                            <span className="text-slate-600 dark:text-slate-400">
                              {interaction.mechanism}
                            </span>
                          </div>
                          <div>
                            <span className="font-medium text-slate-700 dark:text-slate-300">
                              Recommendation:
                            </span>{' '}
                            <span className="text-slate-600 dark:text-slate-400">
                              {interaction.recommendation}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )
            )
          )}
        </div>
      )}
    </div>
  );
}

import { AlertTriangle } from 'lucide-react';
import type { Medication } from '../types';
import { DrugInteractionChecker } from '../components/DrugInteractionChecker';
import { useMedications } from '../hooks/useMedications';

interface InteractionsPageProps {
  medications: Medication[];
}

export function InteractionsPage({ medications }: InteractionsPageProps) {
  const { checkInteractions } = useMedications();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <AlertTriangle className="w-6 h-6 text-amber-500" />
          Drug Interaction Checker
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Check for interactions between multiple medications
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <DrugInteractionChecker
            medications={medications}
            onCheck={checkInteractions}
          />
        </div>

        <div className="space-y-4">
          <div className="card p-4">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-3">
              Interaction Severity Levels
            </h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Contraindicated
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 pl-5">
                Never use together - serious risk
              </p>

              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-orange-500" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Major
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 pl-5">
                May be life-threatening - combination usually avoided
              </p>

              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-yellow-500" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Moderate
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 pl-5">
                May cause significant problems - monitoring needed
              </p>

              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-blue-500" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Minor
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 pl-5">
                Minimal interaction - usually manageable
              </p>
            </div>
          </div>

          <div className="card p-4 bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800">
            <h3 className="font-semibold text-amber-800 dark:text-amber-400 mb-2">
              Important Disclaimer
            </h3>
            <p className="text-sm text-amber-700 dark:text-amber-300">
              This tool provides general information about drug interactions. Always
              verify with a pharmacist and consider patient-specific factors including
              comorbidities, age, renal/hepatic function, and other medications not
              included in this database.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

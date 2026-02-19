import { useState } from 'react';
import { ChevronDown, ChevronRight, CheckCircle, XCircle, AlertCircle, ArrowRight } from 'lucide-react';
import { cn } from '../utils/classNames';

interface AlgorithmStep {
  id: string;
  title: string;
  description?: string;
  type: 'decision' | 'action' | 'outcome';
  options?: {
    label: string;
    nextId: string;
    variant?: 'primary' | 'secondary' | 'warning';
  }[];
  nextStepId?: string;
  medications?: string[];
  notes?: string[];
}

interface TreatmentAlgorithmProps {
  title: string;
  condition: string;
  steps: AlgorithmStep[];
  source?: string;
}

export function TreatmentAlgorithm({ title, condition, steps, source }: TreatmentAlgorithmProps) {
  const [currentStepId, setCurrentStepId] = useState<string>(steps[0]?.id || '');
  const [history, setHistory] = useState<string[]>([]);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());

  const currentStep = steps.find((s) => s.id === currentStepId);

  const handleOptionClick = (nextId: string) => {
    if (currentStep) {
      setHistory((prev) => [...prev, currentStepId]);
      setCompletedSteps((prev) => new Set(prev).add(currentStepId));
    }
    setCurrentStepId(nextId);
  };

  const handleBack = () => {
    if (history.length > 0) {
      const newHistory = [...history];
      const prevId = newHistory.pop()!;
      setHistory(newHistory);
      setCurrentStepId(prevId);
      setCompletedSteps((prev) => {
        const newSet = new Set(prev);
        newSet.delete(prevId);
        return newSet;
      });
    }
  };

  const handleReset = () => {
    setCurrentStepId(steps[0]?.id || '');
    setHistory([]);
    setCompletedSteps(new Set());
  };

  if (!currentStep) {
    return <div className="text-slate-500">Algorithm not found</div>;
  }

  return (
    <div className="card overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-sky-500 to-teal-500 text-white p-4">
        <h3 className="font-semibold text-lg">{title}</h3>
        <p className="text-sky-100 text-sm">{condition}</p>
      </div>

      {/* Progress */}
      <div className="bg-slate-50 dark:bg-slate-800/50 px-4 py-2 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-slate-500 dark:text-slate-400">Progress:</span>
          <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-sky-500 transition-all duration-300"
              style={{
                width: `${(completedSteps.size / steps.length) * 100}%`,
              }}
            />
          </div>
          <span className="text-slate-600 dark:text-slate-400 text-xs">
            {completedSteps.size}/{steps.length}
          </span>
        </div>
      </div>

      {/* Step Content */}
      <div className="p-6">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            {currentStep.type === 'decision' && (
              <AlertCircle className="w-5 h-5 text-amber-500" />
            )}
            {currentStep.type === 'action' && (
              <CheckCircle className="w-5 h-5 text-sky-500" />
            )}
            {currentStep.type === 'outcome' && (
              <CheckCircle className="w-5 h-5 text-green-500" />
            )}
            <span className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {currentStep.type === 'decision'
                ? 'Decision Point'
                : currentStep.type === 'action'
                ? 'Action Required'
                : 'Outcome'}
            </span>
          </div>
          <h4 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
            {currentStep.title}
          </h4>
          {currentStep.description && (
            <p className="text-slate-600 dark:text-slate-300">
              {currentStep.description}
            </p>
          )}
        </div>

        {/* Medications */}
        {currentStep.medications && currentStep.medications.length > 0 && (
          <div className="mb-6 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
            <h5 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Recommended Medications
            </h5>
            <div className="flex flex-wrap gap-2">
              {currentStep.medications.map((med) => (
                <a
                  key={med}
                  href={`/medications/${med.toLowerCase().replace(/\s+/g, '-')}`}
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm font-medium text-sky-600 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-900/20 transition-colors"
                >
                  {med}
                  <ArrowRight className="w-3 h-3" />
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Notes */}
        {currentStep.notes && currentStep.notes.length > 0 && (
          <div className="mb-6 space-y-2">
            {currentStep.notes.map((note, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400"
              >
                <span className="text-sky-500 mt-0.5">•</span>
                <span>{note}</span>
              </div>
            ))}
          </div>
        )}

        {/* Options */}
        {currentStep.options && currentStep.options.length > 0 && (
          <div className="space-y-3">
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Select an option:
            </p>
            {currentStep.options.map((option) => (
              <button
                key={option.label}
                onClick={() => handleOptionClick(option.nextId)}
                className={cn(
                  'w-full text-left p-4 rounded-lg border-2 transition-all duration-200 flex items-center justify-between group',
                  option.variant === 'primary' || !option.variant
                    ? 'border-sky-200 dark:border-sky-800 hover:border-sky-500 dark:hover:border-sky-500 bg-sky-50/50 dark:bg-sky-900/10'
                    : option.variant === 'warning'
                    ? 'border-amber-200 dark:border-amber-800 hover:border-amber-500 dark:hover:border-amber-500 bg-amber-50/50 dark:bg-amber-900/10'
                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500'
                )}
              >
                <span
                  className={cn(
                    'font-medium',
                    option.variant === 'primary' || !option.variant
                      ? 'text-sky-700 dark:text-sky-300'
                      : option.variant === 'warning'
                      ? 'text-amber-700 dark:text-amber-300'
                      : 'text-slate-700 dark:text-slate-300'
                  )}
                >
                  {option.label}
                </span>
                <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors" />
              </button>
            ))}
          </div>
        )}

        {/* Single Next Step */}
        {currentStep.nextStepId && (
          <button
            onClick={() => handleOptionClick(currentStep.nextStepId!)}
            className="w-full btn-primary"
          >
            Continue
            <ArrowRight className="w-4 h-4" />
          </button>
        )}

        {/* Outcome Complete */}
        {currentStep.type === 'outcome' && (
          <div className="text-center py-4">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              Treatment algorithm complete
            </p>
            <button onClick={handleReset} className="btn-secondary">
              Start Over
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
        <button
          onClick={handleBack}
          disabled={history.length === 0}
          className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          ← Back
        </button>
        <button
          onClick={handleReset}
          className="text-sm text-slate-500 hover:text-slate-700 dark:text-slate-500 dark:hover:text-slate-300 transition-colors"
        >
          Reset
        </button>
        {source && (
          <span className="text-xs text-slate-400 dark:text-slate-500">
            Source: {source}
          </span>
        )}
      </div>
    </div>
  );
}

// Pre-built algorithms
export const depressionAlgorithm: AlgorithmStep[] = [
  {
    id: 'start',
    title: 'Initial Assessment',
    description: 'Patient presents with symptoms of depression. Confirm diagnosis with PHQ-9.',
    type: 'decision',
    options: [
      { label: 'First Episode, Mild (PHQ-9 5-9)', nextId: 'mild', variant: 'primary' },
      { label: 'Moderate (PHQ-9 10-14)', nextId: 'moderate', variant: 'primary' },
      { label: 'Severe (PHQ-9 ≥15)', nextId: 'severe', variant: 'warning' },
    ],
  },
  {
    id: 'mild',
    title: 'Mild Depression - First Line',
    description: 'Consider psychotherapy as first-line treatment.',
    type: 'action',
    medications: ['Watchful waiting', 'Psychotherapy (CBT/IPT)'],
    notes: [
      'Monitor symptoms for 2-4 weeks',
      'If no improvement, consider antidepressant',
      'Follow up in 2 weeks',
    ],
    nextStepId: 'followup',
  },
  {
    id: 'moderate',
    title: 'Moderate Depression - Medication',
    description: 'Start antidepressant medication plus psychotherapy.',
    type: 'action',
    medications: ['Sertraline', 'Escitalopram', 'Fluoxetine', 'Bupropion'],
    notes: [
      'Start SSRI (sertraline or escitalopram)',
      'Consider patient preferences and previous response',
      'Monitor for side effects',
    ],
    nextStepId: 'followup',
  },
  {
    id: 'severe',
    title: 'Severe Depression - Urgent Treatment',
    description: 'Consider hospitalization if suicidal ideation present. Start medication immediately.',
    type: 'action',
    medications: ['Sertraline', 'Escitalopram', 'Venlafaxine XR'],
    notes: [
      'Assess suicide risk immediately',
      'Consider hospitalization if high risk',
      'Start antidepressant + psychotherapy',
      'Consider ECT if psychotic features or catatonia',
    ],
    nextStepId: 'followup',
  },
  {
    id: 'followup',
    title: '2-4 Week Follow-up',
    description: 'Assess response to treatment.',
    type: 'decision',
    options: [
      { label: '≥50% improvement (Response)', nextId: 'response', variant: 'primary' },
      { label: '<50% improvement (Partial/No response)', nextId: 'augment', variant: 'warning' },
    ],
  },
  {
    id: 'response',
    title: 'Continue Current Treatment',
    description: 'Patient is responding to treatment. Continue current regimen.',
    type: 'outcome',
    notes: [
      'Continue medication at current dose for 4-9 months',
      'Continue psychotherapy',
      'Monitor for relapse',
    ],
  },
  {
    id: 'augment',
    title: 'Treatment Augmentation/Switch',
    description: 'Inadequate response to initial treatment.',
    type: 'decision',
    options: [
      { label: 'Optimize dose (if not at maximum)', nextId: 'optimize', variant: 'primary' },
      { label: 'Switch to another SSRI', nextId: 'switch', variant: 'secondary' },
      { label: 'Augment with second agent', nextId: 'augment2', variant: 'secondary' },
    ],
  },
  {
    id: 'optimize',
    title: 'Optimize Dose',
    description: 'Increase to maximum tolerated dose.',
    type: 'action',
    nextStepId: 'followup2',
  },
  {
    id: 'switch',
    title: 'Switch Antidepressant',
    description: 'Switch to different class or within class.',
    type: 'action',
    medications: ['Escitalopram', 'Venlafaxine XR', 'Bupropion', 'Mirtazapine'],
    notes: [
      'Cross-taper when switching',
      'Wait 1-2 weeks between washout (except fluoxetine)',
    ],
    nextStepId: 'followup2',
  },
  {
    id: 'augment2',
    title: 'Augmentation Strategy',
    description: 'Add second agent to current antidepressant.',
    type: 'action',
    medications: ['Aripiprazole', 'Bupropion', 'Lithium', 'Mirtazapine'],
    notes: [
      'Aripiprazole 2-5mg: First-line augmentation',
      'Bupropion: Good for fatigue, sexual side effects',
      'Lithium: Strong evidence, requires monitoring',
    ],
    nextStepId: 'followup2',
  },
  {
    id: 'followup2',
    title: 'Re-evaluate at 4-6 Weeks',
    description: 'Assess response to modified treatment.',
    type: 'decision',
    options: [
      { label: 'Good response', nextId: 'response', variant: 'primary' },
      { label: 'Still inadequate', nextId: 'specialist', variant: 'warning' },
    ],
  },
  {
    id: 'specialist',
    title: 'Refer to Specialist',
    description: 'Treatment-resistant depression. Consider referral to psychiatry.',
    type: 'outcome',
    notes: [
      'Consider ECT, TMS, or ketamine',
      'Comprehensive medication review',
      'Assess for bipolar disorder',
    ],
  },
];

export const anxietyAlgorithm: AlgorithmStep[] = [
  {
    id: 'start',
    title: 'Anxiety Assessment',
    description: 'Confirm anxiety disorder diagnosis. Screen for GAD with GAD-7.',
    type: 'decision',
    options: [
      { label: 'GAD-7 < 10 (Mild)', nextId: 'mild-anxiety', variant: 'primary' },
      { label: 'GAD-7 10-14 (Moderate)', nextId: 'mod-anxiety', variant: 'primary' },
      { label: 'GAD-7 ≥ 15 (Severe)', nextId: 'severe-anxiety', variant: 'warning' },
    ],
  },
  {
    id: 'mild-anxiety',
    title: 'Mild Anxiety',
    description: 'Psychotherapy first-line. Consider SSRI if preferred.',
    type: 'action',
    medications: ['CBT', 'Sertraline', 'Escitalopram'],
    nextStepId: 'anxiety-followup',
  },
  {
    id: 'mod-anxiety',
    title: 'Moderate Anxiety',
    description: 'SSRI + CBT combination preferred.',
    type: 'action',
    medications: ['Sertraline', 'Escitalopram', 'Venlafaxine XR'],
    notes: [
      'Start low to minimize activation',
      'Consider sertraline 25mg or escitalopram 5mg',
      'Titrate up as tolerated',
    ],
    nextStepId: 'anxiety-followup',
  },
  {
    id: 'severe-anxiety',
    title: 'Severe Anxiety',
    description: 'SSRI at therapeutic dose + CBT. Consider short-term benzo.',
    type: 'action',
    medications: ['Sertraline', 'Escitalopram'],
    notes: [
      'Avoid benzodiazepines as monotherapy',
      'Short-term (2-4 weeks) only if necessary',
      'Frequent follow-up',
    ],
    nextStepId: 'anxiety-followup',
  },
  {
    id: 'anxiety-followup',
    title: '4-6 Week Follow-up',
    description: 'Assess response with GAD-7.',
    type: 'decision',
    options: [
      { label: '≥50% improvement', nextId: 'anxiety-response', variant: 'primary' },
      { label: 'Partial response', nextId: 'anxiety-augment', variant: 'secondary' },
      { label: 'No response', nextId: 'anxiety-switch', variant: 'warning' },
    ],
  },
  {
    id: 'anxiety-response',
    title: 'Continue Treatment',
    type: 'outcome',
    notes: [
      'Continue treatment 6-12 months',
      'Gradual taper when discontinuing',
      'Relapse prevention skills',
    ],
  },
  {
    id: 'anxiety-augment',
    title: 'Augment or Optimize',
    type: 'action',
    medications: ['Optimize SSRI dose', 'Add buspirone', 'Add pregabalin'],
    nextStepId: 'anxiety-followup',
  },
  {
    id: 'anxiety-switch',
    title: 'Switch Medication',
    type: 'action',
    medications: ['SNRI (venlafaxine)', 'Switch to different SSRI'],
    nextStepId: 'anxiety-followup',
  },
];

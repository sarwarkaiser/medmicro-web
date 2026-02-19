import { useState } from 'react';
import { Calculator, RotateCcw, Info } from 'lucide-react';
import { cn } from '../utils/classNames';

interface CalculatorDef {
  id: string;
  name: string;
  description: string;
  component: React.FC;
}

const calculators: CalculatorDef[] = [
  {
    id: 'phq9',
    name: 'PHQ-9',
    description: 'Depression severity screening',
    component: PHQ9Calculator,
  },
  {
    id: 'gad7',
    name: 'GAD-7',
    description: 'Anxiety severity screening',
    component: GAD7Calculator,
  },
  {
    id: 'bmi',
    name: 'BMI Calculator',
    description: 'Body mass index',
    component: BMICalculator,
  },
];

export function CalculatorsPage() {
  const [activeCalculator, setActiveCalculator] = useState<string>('phq9');

  const ActiveComponent = calculators.find((c) => c.id === activeCalculator)?.component || PHQ9Calculator;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Calculator className="w-6 h-6 text-sky-500" />
          Clinical Calculators
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Evidence-based screening and assessment tools
        </p>
      </div>

      {/* Calculator Selection */}
      <div className="flex flex-wrap gap-2">
        {calculators.map((calc) => (
          <button
            key={calc.id}
            onClick={() => setActiveCalculator(calc.id)}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium transition-all',
              activeCalculator === calc.id
                ? 'bg-sky-500 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            )}
          >
            {calc.name}
          </button>
        ))}
      </div>

      {/* Active Calculator */}
      <div className="card p-6">
        <ActiveComponent />
      </div>
    </div>
  );
}

// PHQ-9 Calculator
function PHQ9Calculator() {
  const [scores, setScores] = useState<number[]>(new Array(9).fill(0));

  const questions = [
    'Little interest or pleasure in doing things',
    'Feeling down, depressed, or hopeless',
    'Trouble falling or staying asleep, or sleeping too much',
    'Feeling tired or having little energy',
    'Poor appetite or overeating',
    'Feeling bad about yourself or that you are a failure',
    'Trouble concentrating on things',
    'Moving or speaking slowly, or being fidgety/restless',
    'Thoughts that you would be better off dead or hurting yourself',
  ];

  const totalScore = scores.reduce((a, b) => a + b, 0);

  const getInterpretation = () => {
    if (totalScore <= 4) return { level: 'Minimal', color: 'text-green-600 dark:text-green-400', action: 'Continue monitoring' };
    if (totalScore <= 9) return { level: 'Mild', color: 'text-blue-600 dark:text-blue-400', action: 'Consider counseling' };
    if (totalScore <= 14) return { level: 'Moderate', color: 'text-amber-600 dark:text-amber-400', action: 'Treatment recommended' };
    if (totalScore <= 19) return { level: 'Moderately Severe', color: 'text-orange-600 dark:text-orange-400', action: 'Active treatment' };
    return { level: 'Severe', color: 'text-red-600 dark:text-red-400', action: 'Immediate treatment' };
  };

  const interpretation = getInterpretation();
  const hasSuicidalIdeation = scores[8] > 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
          PHQ-9 Depression Screening
        </h2>
        <p className="text-slate-500 dark:text-slate-400">
          Over the last 2 weeks, how often have you been bothered by the following problems?
        </p>
      </div>

      <div className="space-y-4">
        {questions.map((question, idx) => (
          <div key={idx} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
            <p className="text-sm text-slate-700 dark:text-slate-300 mb-3">
              {idx + 1}. {question}
            </p>
            <div className="flex flex-wrap gap-2">
              {[0, 1, 2, 3].map((value) => (
                <button
                  key={value}
                  onClick={() => {
                    const newScores = [...scores];
                    newScores[idx] = value;
                    setScores(newScores);
                  }}
                  className={cn(
                    'px-3 py-1.5 rounded text-sm font-medium transition-colors',
                    scores[idx] === value
                      ? 'bg-sky-500 text-white'
                      : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-600'
                  )}
                >
                  {value === 0 && 'Not at all'}
                  {value === 1 && 'Several days'}
                  {value === 2 && 'More than half'}
                  {value === 3 && 'Nearly every day'}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {hasSuicidalIdeation && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-red-800 dark:text-red-300">
                Suicidal Ideation Detected
              </p>
              <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                Question 9 is positive. Assess suicide risk and consider safety planning.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Total Score</p>
            <p className={cn('text-3xl font-bold', interpretation.color)}>
              {totalScore} / 27
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-slate-500 dark:text-slate-400">Severity</p>
            <p className={cn('text-xl font-semibold', interpretation.color)}>
              {interpretation.level}
            </p>
          </div>
        </div>
        <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg">
          <p className="text-sm text-slate-700 dark:text-slate-300">
            <strong>Recommendation:</strong> {interpretation.action}
          </p>
        </div>
        <button
          onClick={() => setScores(new Array(9).fill(0))}
          className="btn-secondary mt-4 w-full"
        >
          <RotateCcw className="w-4 h-4" />
          Reset
        </button>
      </div>
    </div>
  );
}

// GAD-7 Calculator
function GAD7Calculator() {
  const [scores, setScores] = useState<number[]>(new Array(7).fill(0));

  const questions = [
    'Feeling nervous, anxious, or on edge',
    'Not being able to stop or control worrying',
    'Worrying too much about different things',
    'Trouble relaxing',
    'Being so restless that it is hard to sit still',
    'Becoming easily annoyed or irritable',
    'Feeling afraid, as if something awful might happen',
  ];

  const totalScore = scores.reduce((a, b) => a + b, 0);

  const getInterpretation = () => {
    if (totalScore <= 4) return { level: 'Minimal', color: 'text-green-600 dark:text-green-400', action: 'Continue monitoring' };
    if (totalScore <= 9) return { level: 'Mild', color: 'text-blue-600 dark:text-blue-400', action: 'Counseling may help' };
    if (totalScore <= 14) return { level: 'Moderate', color: 'text-amber-600 dark:text-amber-400', action: 'Treatment recommended' };
    return { level: 'Severe', color: 'text-red-600 dark:text-red-400', action: 'Active treatment' };
  };

  const interpretation = getInterpretation();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
          GAD-7 Anxiety Screening
        </h2>
        <p className="text-slate-500 dark:text-slate-400">
          Over the last 2 weeks, how often have you been bothered by the following problems?
        </p>
      </div>

      <div className="space-y-4">
        {questions.map((question, idx) => (
          <div key={idx} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
            <p className="text-sm text-slate-700 dark:text-slate-300 mb-3">
              {idx + 1}. {question}
            </p>
            <div className="flex flex-wrap gap-2">
              {[0, 1, 2, 3].map((value) => (
                <button
                  key={value}
                  onClick={() => {
                    const newScores = [...scores];
                    newScores[idx] = value;
                    setScores(newScores);
                  }}
                  className={cn(
                    'px-3 py-1.5 rounded text-sm font-medium transition-colors',
                    scores[idx] === value
                      ? 'bg-sky-500 text-white'
                      : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-600'
                  )}
                >
                  {value === 0 && 'Not at all'}
                  {value === 1 && 'Several days'}
                  {value === 2 && 'More than half'}
                  {value === 3 && 'Nearly every day'}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Total Score</p>
            <p className={cn('text-3xl font-bold', interpretation.color)}>
              {totalScore} / 21
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-slate-500 dark:text-slate-400">Severity</p>
            <p className={cn('text-xl font-semibold', interpretation.color)}>
              {interpretation.level}
            </p>
          </div>
        </div>
        <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg">
          <p className="text-sm text-slate-700 dark:text-slate-300">
            <strong>Recommendation:</strong> {interpretation.action}
          </p>
        </div>
        <button
          onClick={() => setScores(new Array(7).fill(0))}
          className="btn-secondary mt-4 w-full"
        >
          <RotateCcw className="w-4 h-4" />
          Reset
        </button>
      </div>
    </div>
  );
}

// BMI Calculator
function BMICalculator() {
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');

  const calculateBMI = () => {
    const h = parseFloat(height);
    const w = parseFloat(weight);

    if (!h || !w) return null;

    if (unit === 'metric') {
      // height in cm, weight in kg
      return w / Math.pow(h / 100, 2);
    } else {
      // height in inches, weight in lbs
      return (w / Math.pow(h, 2)) * 703;
    }
  };

  const bmi = calculateBMI();

  const getInterpretation = (bmi: number) => {
    if (bmi < 18.5) return { category: 'Underweight', color: 'text-blue-600 dark:text-blue-400' };
    if (bmi < 25) return { category: 'Normal weight', color: 'text-green-600 dark:text-green-400' };
    if (bmi < 30) return { category: 'Overweight', color: 'text-amber-600 dark:text-amber-400' };
    return { category: 'Obese', color: 'text-red-600 dark:text-red-400' };
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
          BMI Calculator
        </h2>
        <p className="text-slate-500 dark:text-slate-400">
          Calculate body mass index from height and weight
        </p>
      </div>

      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setUnit('metric')}
          className={cn(
            'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
            unit === 'metric'
              ? 'bg-sky-500 text-white'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
          )}
        >
          Metric (kg, cm)
        </button>
        <button
          onClick={() => setUnit('imperial')}
          className={cn(
            'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
            unit === 'imperial'
              ? 'bg-sky-500 text-white'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
          )}
        >
          Imperial (lbs, in)
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Height ({unit === 'metric' ? 'cm' : 'inches'})
          </label>
          <input
            type="number"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            className="input"
            placeholder={unit === 'metric' ? '175' : '69'}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Weight ({unit === 'metric' ? 'kg' : 'lbs'})
          </label>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="input"
            placeholder={unit === 'metric' ? '70' : '154'}
          />
        </div>
      </div>

      {bmi && (
        <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
          <div className="text-center mb-4">
            <p className="text-sm text-slate-500 dark:text-slate-400">Your BMI</p>
            <p className={cn('text-4xl font-bold', getInterpretation(bmi).color)}>
              {bmi.toFixed(1)}
            </p>
            <p className={cn('text-lg font-medium', getInterpretation(bmi).color)}>
              {getInterpretation(bmi).category}
            </p>
          </div>

          <div className="grid grid-cols-4 gap-2 text-center text-xs">
            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
              <p className="font-medium text-blue-700 dark:text-blue-300">&lt;18.5</p>
              <p className="text-blue-600 dark:text-blue-400">Under</p>
            </div>
            <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded">
              <p className="font-medium text-green-700 dark:text-green-300">18.5-24.9</p>
              <p className="text-green-600 dark:text-green-400">Normal</p>
            </div>
            <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded">
              <p className="font-medium text-amber-700 dark:text-amber-300">25-29.9</p>
              <p className="text-amber-600 dark:text-amber-400">Over</p>
            </div>
            <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded">
              <p className="font-medium text-red-700 dark:text-red-300">≥30</p>
              <p className="text-red-600 dark:text-red-400">Obese</p>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => { setHeight(''); setWeight(''); }}
        className="btn-secondary w-full"
      >
        <RotateCcw className="w-4 h-4" />
        Reset
      </button>
    </div>
  );
}

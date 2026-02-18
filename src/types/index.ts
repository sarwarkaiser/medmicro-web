// Medication Types
export interface Medication {
  id: string;
  name: string;
  genericName: string;
  tags: string[];
  class: MedicationClass;
  indications: string[];
  quickFlags: QuickFlag[];
  dosing: DosingInfo;
  warnings: string[];
  sideEffects: SideEffect[];
  cautions: Cautions;
  interactions: DrugInteraction[];
  clinicalPearls: string[];
  monitoring: MonitoringItem[];
  titrationSchedule?: TitrationStep[];
  equivalents?: EquivalentDose[];
  pregnancyCategory?: PregnancyCategory;
  qtRisk?: QTRisk;
  citations: string[];
  updatedAt: string;
}

export type MedicationClass = 
  | 'SSRI' | 'SNRI' | 'TCA' | 'MAOI' | 'Atypical Antidepressant'
  | 'Typical Antipsychotic' | 'Atypical Antipsychotic'
  | 'Mood Stabilizer' | 'Benzodiazepine' | 'Anxiolytic'
  | 'Stimulant' | 'Cognitive Enhancer' | 'Sleep Aid' | 'Other';

export type QuickFlag = 
  | 'First-line' | 'Second-line' | 'Third-line'
  | 'Pregnancy-safe' | 'Pregnancy-caution' | 'Pregnancy-avoid'
  | 'QT-safe' | 'QT-caution' | 'QT-risk'
  | 'Weight-neutral' | 'Weight-loss' | 'Weight-gain'
  | 'Activating' | 'Sedating' | 'Sexual-side-effects';

export interface DosingInfo {
  adult: {
    start: string;
    titration: string;
    maintenance: string;
    max: string;
  };
  pediatric?: {
    start: string;
    maintenance: string;
    max: string;
  };
  geriatric?: {
    start: string;
    maintenance: string;
    notes: string;
  };
  renal?: string;
  hepatic?: string;
  notes?: string;
}

export interface SideEffect {
  effect: string;
  frequency: 'very-common' | 'common' | 'uncommon' | 'rare';
  management?: string;
}

export interface Cautions {
  renal?: string;
  hepatic?: string;
  cardiac?: string;
  seizure?: string;
  bipolar?: string;
  other?: string[];
}

export interface DrugInteraction {
  drug: string;
  severity: 'contraindicated' | 'major' | 'moderate' | 'minor';
  mechanism: string;
  recommendation: string;
}

export interface MonitoringItem {
  parameter: string;
  baseline: boolean;
  followUp: string;
  frequency: string;
}

export interface TitrationStep {
  week: number;
  dose: string;
  notes?: string;
}

export interface EquivalentDose {
  fromDrug: string;
  fromDose: string;
  toDose: string;
}

export type PregnancyCategory = 'A' | 'B' | 'C' | 'D' | 'X' | 'L1' | 'L2' | 'L3' | 'L4' | 'L5';

export type QTRisk = 'none' | 'low' | 'moderate' | 'high';

// Guideline Types
export interface Guideline {
  id: string;
  title: string;
  organization: string;
  year: number;
  version?: string;
  conditions: string[];
  content: GuidelineSection[];
  algorithms?: TreatmentAlgorithm[];
  citation?: string;
  url?: string;
  updatedAt: string;
}

export interface GuidelineSection {
  heading: string;
  content: string;
  recommendations?: Recommendation[];
}

export interface Recommendation {
  grade: 'A' | 'B' | 'C' | 'D' | 'I';
  text: string;
  evidence?: string;
}

export interface TreatmentAlgorithm {
  id: string;
  name: string;
  steps: AlgorithmStep[];
}

export interface AlgorithmStep {
  id: string;
  text: string;
  yesStep?: string;
  noStep?: string;
  action?: string;
  medications?: string[];
}

// DSM-5 Criteria Types
export interface Dsm5Criteria {
  id: string;
  disorder: string;
  code: string;
  category: string;
  criteria: Criterion[];
  specifiers?: Specifier[];
  differentialDx?: string[];
  screeningQuestions?: ScreeningQuestion[];
  notes?: string;
}

export interface Criterion {
  letter: string;
  text: string;
  subcriteria?: string[];
  required?: boolean;
}

export interface Specifier {
  name: string;
  description: string;
}

export interface ScreeningQuestion {
  question: string;
  positiveIndicator: string;
}

// Calculator Types
export interface Calculator {
  id: string;
  name: string;
  description: string;
  category: string;
  type: 'scoring' | 'converter' | 'assessment' | 'risk';
  inputs: CalculatorInput[];
  calculate: (values: Record<string, number>) => CalculatorResult;
  interpretation?: (score: number) => string;
}

export interface CalculatorInput {
  id: string;
  label: string;
  type: 'number' | 'select' | 'checkbox';
  options?: { value: number; label: string }[];
  min?: number;
  max?: number;
  step?: number;
  required: boolean;
}

export interface CalculatorResult {
  score: number;
  interpretation?: string;
  severity?: string;
  actions?: string[];
}

// App State Types
export interface AppState {
  theme: 'light' | 'dark' | 'system';
  favorites: string[];
  recentItems: RecentItem[];
  notes: Record<string, string>;
  settings: UserSettings;
}

export interface RecentItem {
  id: string;
  type: 'medication' | 'guideline' | 'criteria' | 'calculator';
  name: string;
  accessedAt: string;
}

export interface UserSettings {
  defaultView: 'grid' | 'list';
  showQuickFlags: boolean;
  compactMode: boolean;
  fontSize: 'small' | 'medium' | 'large';
}

// Search Types
export interface SearchFilters {
  class?: MedicationClass[];
  indications?: string[];
  flags?: QuickFlag[];
  pregnancy?: PregnancyCategory[];
  qtRisk?: QTRisk[];
}

export type ViewMode = 'grid' | 'list' | 'compact';

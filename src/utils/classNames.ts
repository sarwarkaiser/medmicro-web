import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getSeverityColor(severity: string): string {
  switch (severity) {
    case 'contraindicated':
      return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border-red-200 dark:border-red-800';
    case 'major':
      return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300 border-orange-200 dark:border-orange-800';
    case 'moderate':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800';
    case 'minor':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700';
  }
}

export function getFlagColor(flag: string): string {
  if (flag.includes('First-line')) return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';
  if (flag.includes('Second-line')) return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300';
  if (flag.includes('Pregnancy')) return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
  if (flag.includes('QT')) return flag.includes('safe') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700';
  if (flag.includes('Weight')) {
    if (flag.includes('loss')) return 'bg-blue-100 text-blue-700';
    if (flag.includes('gain')) return 'bg-red-100 text-red-700';
    return 'bg-green-100 text-green-700';
  }
  if (flag.includes('Activating')) return 'bg-orange-100 text-orange-700';
  if (flag.includes('Sedating')) return 'bg-purple-100 text-purple-700';
  return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
}

export function getClassColor(medClass: string): string {
  switch (medClass) {
    case 'SSRI':
      return 'bg-depression-100 text-depression-800 dark:bg-depression-900/30 dark:text-depression-300';
    case 'SNRI':
      return 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300';
    case 'Atypical Antidepressant':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
    case 'Atypical Antipsychotic':
      return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300';
    case 'Mood Stabilizer':
      return 'bg-anxiety-100 text-anxiety-800 dark:bg-anxiety-900/30 dark:text-anxiety-300';
    case 'Benzodiazepine':
      return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300';
    case 'Stimulant':
      return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
  }
}

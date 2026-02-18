import Dexie, { type Table } from 'dexie';
import type { 
  Medication, 
  Guideline, 
  Dsm5Criteria, 
  AppState,
  RecentItem 
} from '../types';

export class MedMicroDB extends Dexie {
  medications!: Table<Medication>;
  guidelines!: Table<Guideline>;
  criteria!: Table<Dsm5Criteria>;
  appState!: Table<AppState>;
  recentItems!: Table<RecentItem>;

  constructor() {
    super('MedMicroDB');
    
    this.version(1).stores({
      medications: '++id, name, genericName, class, *tags, *indications, *quickFlags',
      guidelines: '++id, title, organization, year, *conditions',
      criteria: '++id, disorder, code, category',
      appState: '++id',
      recentItems: '++id, type, accessedAt',
    });
  }

  // Initialize with default data
  async initializeData() {
    const medCount = await this.medications.count();
    if (medCount === 0) {
      await this.medications.bulkAdd(defaultMedications);
    }

    const guideCount = await this.guidelines.count();
    if (guideCount === 0) {
      await this.guidelines.bulkAdd(defaultGuidelines);
    }

    const criteriaCount = await this.criteria.count();
    if (criteriaCount === 0) {
      await this.criteria.bulkAdd(defaultCriteria);
    }
  }

  // Recent items management
  async addRecentItem(item: Omit<RecentItem, 'accessedAt'>) {
    const accessedAt = new Date().toISOString();
    
    // Remove duplicates
    await this.recentItems.where('id').equals(item.id).delete();
    
    // Add new item
    await this.recentItems.add({ ...item, accessedAt });
    
    // Keep only last 50 items
    const allItems = await this.recentItems.orderBy('accessedAt').reverse().toArray();
    if (allItems.length > 50) {
      const itemsToDelete = allItems.slice(50);
      for (const item of itemsToDelete) {
        if (item.id) await this.recentItems.delete(item.id);
      }
    }
  }

  async getRecentItems(limit = 10): Promise<RecentItem[]> {
    return this.recentItems
      .orderBy('accessedAt')
      .reverse()
      .limit(limit)
      .toArray();
  }

  // Search medications with filters
  async searchMedications(
    query: string,
    filters?: {
      class?: string[];
      indications?: string[];
      flags?: string[];
    }
  ): Promise<Medication[]> {
    let collection = this.medications.toCollection();

    if (filters?.class?.length) {
      collection = this.medications.where('class').anyOf(filters.class);
    }

    const meds = await collection.toArray();

    // Apply text search and additional filters
    return meds.filter(med => {
      // Text search
      if (query) {
        const searchFields = [
          med.name,
          med.genericName,
          ...med.tags,
          ...med.indications,
        ].map(f => f.toLowerCase());
        const queryLower = query.toLowerCase();
        if (!searchFields.some(f => f.includes(queryLower))) {
          return false;
        }
      }

      // Indication filter
      if (filters?.indications?.length) {
        if (!filters.indications.some(ind => med.indications.includes(ind))) {
          return false;
        }
      }

      // Flags filter
      if (filters?.flags?.length) {
        if (!filters.flags.some(flag => med.quickFlags.includes(flag as any))) {
          return false;
        }
      }

      return true;
    });
  }

  // Get medications by condition
  async getMedicationsByCondition(condition: string): Promise<Medication[]> {
    return this.medications
      .filter(med => med.indications.some(ind => 
        ind.toLowerCase().includes(condition.toLowerCase())
      ))
      .toArray();
  }

  // Check drug interactions
  async checkInteractions(drugNames: string[]): Promise<InteractionResult[]> {
    const meds = await this.medications
      .where('name')
      .anyOf(drugNames)
      .toArray();

    const interactions: InteractionResult[] = [];

    for (const med of meds) {
      for (const interaction of med.interactions) {
        if (drugNames.some(name => 
          interaction.drug.toLowerCase().includes(name.toLowerCase()) ||
          name.toLowerCase().includes(interaction.drug.toLowerCase())
        )) {
          interactions.push({
            drug1: med.name,
            drug2: interaction.drug,
            severity: interaction.severity,
            mechanism: interaction.mechanism,
            recommendation: interaction.recommendation,
          });
        }
      }
    }

    return interactions;
  }
}

export interface InteractionResult {
  drug1: string;
  drug2: string;
  severity: 'contraindicated' | 'major' | 'moderate' | 'minor';
  mechanism: string;
  recommendation: string;
}

// Import default data
import { defaultMedications } from '../data/medications';
import { defaultGuidelines } from '../data/guidelines';
import { defaultCriteria } from '../data/criteria';

export const db = new MedMicroDB();

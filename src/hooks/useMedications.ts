import { useEffect, useState, useCallback } from 'react';
import { db } from '../db/database';
import type { Medication, InteractionResult } from '../types';

export function useMedications() {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadMedications = async () => {
      try {
        await db.initializeData();
        const meds = await db.medications.toArray();
        setMedications(meds);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load medications'));
      } finally {
        setLoading(false);
      }
    };

    loadMedications();
  }, []);

  const getMedicationById = useCallback(
    async (id: string): Promise<Medication | undefined> => {
      return db.medications.get(id);
    },
    []
  );

  const getMedicationsByCondition = useCallback(
    async (condition: string): Promise<Medication[]> => {
      return db.getMedicationsByCondition(condition);
    },
    []
  );

  const checkInteractions = useCallback(
    async (drugNames: string[]): Promise<InteractionResult[]> => {
      return db.checkInteractions(drugNames);
    },
    []
  );

  return {
    medications,
    loading,
    error,
    getMedicationById,
    getMedicationsByCondition,
    checkInteractions,
  };
}

export function useMedication(id: string | null) {
  const [medication, setMedication] = useState<Medication | null>(null);
  const [loading, setLoading] = useState(!!id);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!id) {
      setMedication(null);
      setLoading(false);
      return;
    }

    const loadMedication = async () => {
      try {
        setLoading(true);
        await db.initializeData();
        const med = await db.medications.get(id);
        setMedication(med || null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load medication'));
      } finally {
        setLoading(false);
      }
    };

    loadMedication();
  }, [id]);

  return { medication, loading, error };
}

export function useGuidelines() {
  const [guidelines, setGuidelines] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadGuidelines = async () => {
      try {
        await db.initializeData();
        const guides = await db.guidelines.toArray();
        setGuidelines(guides);
      } finally {
        setLoading(false);
      }
    };

    loadGuidelines();
  }, []);

  return { guidelines, loading };
}

export function useCriteria() {
  const [criteria, setCriteria] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCriteria = async () => {
      try {
        await db.initializeData();
        const crit = await db.criteria.toArray();
        setCriteria(crit);
      } finally {
        setLoading(false);
      }
    };

    loadCriteria();
  }, []);

  return { criteria, loading };
}

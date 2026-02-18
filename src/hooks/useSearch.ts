import { useMemo, useState, useCallback } from 'react';
import Fuse from 'fuse.js';
import type { Medication, Guideline, Dsm5Criteria, SearchFilters } from '../types';

interface SearchResult {
  medications: Medication[];
  guidelines: Guideline[];
  criteria: Dsm5Criteria[];
}

export function useMedicationSearch(
  medications: Medication[],
  query: string,
  filters?: SearchFilters
) {
  const fuse = useMemo(() => {
    return new Fuse(medications, {
      keys: [
        { name: 'name', weight: 2 },
        { name: 'genericName', weight: 1.5 },
        { name: 'tags', weight: 1 },
        { name: 'indications', weight: 1 },
        { name: 'class', weight: 1 },
      ],
      threshold: 0.4,
      includeScore: true,
      includeMatches: true,
    });
  }, [medications]);

  const results = useMemo(() => {
    let filteredMeds = medications;

    // Apply filters first
    if (filters) {
      if (filters.class?.length) {
        filteredMeds = filteredMeds.filter((m) => filters.class!.includes(m.class));
      }
      if (filters.indications?.length) {
        filteredMeds = filteredMeds.filter((m) =>
          filters.indications!.some((ind) =>
            m.indications.some((mi) => mi.toLowerCase().includes(ind.toLowerCase()))
          )
        );
      }
      if (filters.flags?.length) {
        filteredMeds = filteredMeds.filter((m) =>
          filters.flags!.some((flag) => m.quickFlags.includes(flag))
        );
      }
    }

    // Apply search query
    if (!query.trim()) {
      return filteredMeds;
    }

    const searchResults = fuse.search(query);
    return searchResults
      .filter((result) => filteredMeds.includes(result.item))
      .map((result) => result.item);
  }, [medications, query, filters, fuse]);

  return results;
}

export function useGuidelineSearch(guidelines: Guideline[], query: string) {
  const fuse = useMemo(() => {
    return new Fuse(guidelines, {
      keys: [
        { name: 'title', weight: 2 },
        { name: 'organization', weight: 1 },
        { name: 'conditions', weight: 1.5 },
        { name: 'content.heading', weight: 1 },
        { name: 'content.content', weight: 0.5 },
      ],
      threshold: 0.4,
    });
  }, [guidelines]);

  const results = useMemo(() => {
    if (!query.trim()) return guidelines;
    return fuse.search(query).map((r) => r.item);
  }, [guidelines, query, fuse]);

  return results;
}

export function useCriteriaSearch(criteria: Dsm5Criteria[], query: string) {
  const fuse = useMemo(() => {
    return new Fuse(criteria, {
      keys: [
        { name: 'disorder', weight: 2 },
        { name: 'code', weight: 1 },
        { name: 'category', weight: 1 },
      ],
      threshold: 0.3,
    });
  }, [criteria]);

  const results = useMemo(() => {
    if (!query.trim()) return criteria;
    return fuse.search(query).map((r) => r.item);
  }, [criteria, query, fuse]);

  return results;
}

export function useGlobalSearch(
  medications: Medication[],
  guidelines: Guideline[],
  criteria: Dsm5Criteria[],
  query: string
): SearchResult {
  const medResults = useMedicationSearch(medications, query);
  const guideResults = useGuidelineSearch(guidelines, query);
  const criteriaResults = useCriteriaSearch(criteria, query);

  return {
    medications: medResults,
    guidelines: guideResults,
    criteria: criteriaResults,
  };
}

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useMemo(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// PUBLIC_INTERFACE
export type SavedContextValue = {
  savedIds: Set<string>;
  toggleSaved: (id: string) => void;
  isSaved: (id: string) => boolean;
  clearAll: () => void;
};

/** Provides saved recipes state using AsyncStorage for persistence. */
const SavedRecipesContext = createContext<SavedContextValue | undefined>(undefined);

const STORAGE_KEY = 'saved_recipe_ids_v1';

export const SavedRecipesProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const arr: string[] = JSON.parse(raw);
          setSavedIds(new Set(arr));
        }
      } catch {
        // swallow errors; non-critical
      } finally {
        setHydrated(true);
      }
    })();
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    // Persist whenever savedIds change
    (async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(savedIds)));
      } catch {
        // ignore
      }
    })();
  }, [savedIds, hydrated]);

  const toggleSaved = useCallback((id: string) => {
    setSavedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const isSaved = useCallback((id: string) => savedIds.has(id), [savedIds]);

  const clearAll = useCallback(() => setSavedIds(new Set()), []);

  const value = useMemo<SavedContextValue>(() => ({ savedIds, toggleSaved, isSaved, clearAll }), [savedIds, toggleSaved, isSaved, clearAll]);

  // Render children immediately; consumers can check isSaved and toggleSaved safely.
  return <SavedRecipesContext.Provider value={value}>{children}</SavedRecipesContext.Provider>;
};

// PUBLIC_INTERFACE
export const useSavedRecipes = (): SavedContextValue => {
  const ctx = useContext(SavedRecipesContext);
  if (!ctx) throw new Error('useSavedRecipes must be used within SavedRecipesProvider');
  return ctx;
};

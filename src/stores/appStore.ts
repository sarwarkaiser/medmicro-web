import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AppState, UserSettings, RecentItem } from '../types';

interface AppStore extends AppState {
  // Actions
  setTheme: (theme: AppState['theme']) => void;
  toggleTheme: () => void;
  addFavorite: (id: string) => void;
  removeFavorite: (id: string) => void;
  addRecentItem: (item: Omit<RecentItem, 'accessedAt'>) => void;
  clearRecentItems: () => void;
  setNote: (id: string, note: string) => void;
  deleteNote: (id: string) => void;
  updateSettings: (settings: Partial<UserSettings>) => void;
  resetSettings: () => void;
}

const defaultSettings: UserSettings = {
  defaultView: 'grid',
  showQuickFlags: true,
  compactMode: false,
  fontSize: 'medium',
};

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      theme: 'system',
      favorites: [],
      recentItems: [],
      notes: {},
      settings: defaultSettings,

      setTheme: (theme) => set({ theme }),

      toggleTheme: () => {
        const current = get().theme;
        const themes: AppState['theme'][] = ['light', 'dark', 'system'];
        const nextIndex = (themes.indexOf(current) + 1) % themes.length;
        set({ theme: themes[nextIndex] });
      },

      addFavorite: (id) => {
        const favorites = get().favorites;
        if (!favorites.includes(id)) {
          set({ favorites: [...favorites, id] });
        }
      },

      removeFavorite: (id) => {
        set({ favorites: get().favorites.filter((f) => f !== id) });
      },

      addRecentItem: (item) => {
        const accessedAt = new Date().toISOString();
        const recentItems = get().recentItems.filter((r) => r.id !== item.id);
        recentItems.unshift({ ...item, accessedAt });
        // Keep only last 50
        set({ recentItems: recentItems.slice(0, 50) });
      },

      clearRecentItems: () => set({ recentItems: [] }),

      setNote: (id, note) => {
        set({ notes: { ...get().notes, [id]: note } });
      },

      deleteNote: (id) => {
        const notes = { ...get().notes };
        delete notes[id];
        set({ notes });
      },

      updateSettings: (settings) => {
        set({ settings: { ...get().settings, ...settings } });
      },

      resetSettings: () => set({ settings: defaultSettings }),
    }),
    {
      name: 'medmicro-storage',
      partialize: (state) => ({
        theme: state.theme,
        favorites: state.favorites,
        notes: state.notes,
        settings: state.settings,
      }),
    }
  )
);

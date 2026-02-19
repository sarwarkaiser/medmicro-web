import { useEffect, useCallback } from 'react';

interface ShortcutConfig {
  key: string;
  modifier?: 'ctrl' | 'meta' | 'alt' | 'shift';
  handler: () => void;
  preventDefault?: boolean;
}

export function useKeyboardShortcuts(shortcuts: ShortcutConfig[]) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in input fields
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) {
        // Allow Escape even in inputs
        if (e.key !== 'Escape') {
          return;
        }
      }

      for (const shortcut of shortcuts) {
        const keyMatch = e.key.toLowerCase() === shortcut.key.toLowerCase();
        
        let modifierMatch = true;
        if (shortcut.modifier) {
          switch (shortcut.modifier) {
            case 'ctrl':
              modifierMatch = e.ctrlKey;
              break;
            case 'meta':
              modifierMatch = e.metaKey;
              break;
            case 'alt':
              modifierMatch = e.altKey;
              break;
            case 'shift':
              modifierMatch = e.shiftKey;
              break;
          }
        } else {
          // If no modifier specified, ensure no modifiers are pressed
          modifierMatch = !e.ctrlKey && !e.metaKey && !e.altKey && !e.shiftKey;
        }

        if (keyMatch && modifierMatch) {
          if (shortcut.preventDefault !== false) {
            e.preventDefault();
          }
          shortcut.handler();
          break;
        }
      }
    },
    [shortcuts]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}

// Navigation shortcuts for the app
export function useNavigationShortcuts() {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Skip if in input field
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      const key = e.key;
      
      // Number keys 1-5 for main navigation
      if (key >= '1' && key <= '5') {
        e.preventDefault();
        const routes = [
          '/medications',
          '/guidelines',
          '/criteria',
          '/calculators',
          '/favorites',
        ];
        const index = parseInt(key) - 1;
        if (routes[index]) {
          window.history.pushState({}, '', routes[index]);
          window.dispatchEvent(new PopStateEvent('popstate'));
        }
      }

      // 'g' then 'm' for medications (vim-style)
      // 'g' then 'g' for guidelines
      // 'r' for recent
      // 'f' for favorites
      // 's' for settings
      // '/' for search (handled in SearchBar component)
      // '?' for help
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
}

// Hook to add recent item on medication view
export function useRecentItemTracker() {
  // This is handled in the store, but we could add additional tracking here
  return null;
}

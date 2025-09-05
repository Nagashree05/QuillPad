import { useEffect } from 'react';

interface ShortcutHandlers {
  onNewNote?: () => void;
  onSearch?: () => void;
  onToggleTheme?: () => void;
}

export const useKeyboardShortcuts = (handlers: ShortcutHandlers) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const { ctrlKey, metaKey, key } = event;
      const isModifierPressed = ctrlKey || metaKey;

      if (!isModifierPressed) return;

      switch (key.toLowerCase()) {
        case 'n':
          if (handlers.onNewNote) {
            event.preventDefault();
            handlers.onNewNote();
          }
          break;
        case 'k':
          if (handlers.onSearch) {
            event.preventDefault();
            handlers.onSearch();
          }
          break;
        case 'd':
          if (handlers.onToggleTheme) {
            event.preventDefault();
            handlers.onToggleTheme();
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handlers]);
};
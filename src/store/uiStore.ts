import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UIPreferences } from '../types';

interface UIStore extends UIPreferences {
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setSidebarWidth: (width: number) => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
}

export const useUIStore = create<UIStore>()(
  persist(
    (set) => ({
      // Default values
      sidebarCollapsed: false,
      sidebarWidth: 280,
      theme: 'system',

      // Actions
      toggleSidebar: () =>
        set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),

      setSidebarWidth: (width) => set({ sidebarWidth: width }),

      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'ui-preferences',
    }
  )
);

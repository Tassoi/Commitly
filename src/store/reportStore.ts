// Zustand store for report state

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Report } from '../types';

interface ReportStore {
  // Runtime state (not persisted)
  currentReport: Report | null;
  isGenerating: boolean;

  // Persisted state
  reportHistory: Report[];
  currentReportId: string | null;

  // Basic actions
  setReport: (report: Report | null) => void;
  setGenerating: (generating: boolean) => void;

  // History management
  addReportToHistory: (report: Report) => void;
  removeReportFromHistory: (reportId: string) => void;
  switchToReport: (reportId: string) => void;
  getReportById: (reportId: string) => Report | undefined;
  updateReportContent: (reportId: string, content: string) => void;
  updateReportName: (reportId: string, name: string) => void;
}

export const useReportStore = create<ReportStore>()(
  persist(
    (set, get) => ({
      // Runtime state
      currentReport: null,
      isGenerating: false,

      // Persisted state
      reportHistory: [],
      currentReportId: null,

      // Basic actions
      setReport: (report) => {
        if (report) {
          // Automatically add to history when setting a report
          get().addReportToHistory(report);
        }
        set({ currentReport: report, currentReportId: report?.id || null });
      },

      setGenerating: (generating) => set({ isGenerating: generating }),

      // History management
      addReportToHistory: (report: Report) => {
        const state = get();

        // Check if report already exists in history
        const existingIndex = state.reportHistory.findIndex((r) => r.id === report.id);

        let newHistory: Report[];
        if (existingIndex >= 0) {
          // Update existing report
          newHistory = [...state.reportHistory];
          newHistory[existingIndex] = report;
        } else {
          // Add new report to beginning
          newHistory = [report, ...state.reportHistory];
        }

        // Sort by lastModified (most recent first) and limit to 50
        newHistory = newHistory.sort((a, b) => b.lastModified - a.lastModified).slice(0, 50);

        set({ reportHistory: newHistory, currentReportId: report.id });
      },

      removeReportFromHistory: (reportId: string) => {
        const state = get();
        const newHistory = state.reportHistory.filter((r) => r.id !== reportId);

        // 如果删除当前报告，尝试切换到列表首个，否则置空
        if (state.currentReportId === reportId) {
          if (newHistory.length > 0) {
            const next = newHistory[0];
            set({
              reportHistory: newHistory,
              currentReportId: next.id,
              currentReport: next,
            });
          } else {
            set({ reportHistory: newHistory, currentReportId: null, currentReport: null });
          }
        } else {
          set({ reportHistory: newHistory });
        }
      },

      switchToReport: (reportId: string) => {
        const report = get().getReportById(reportId);
        if (report) {
          set({ currentReport: report, currentReportId: reportId });
        }
      },

      getReportById: (reportId: string) => {
        return get().reportHistory.find((r) => r.id === reportId);
      },

      updateReportContent: (reportId: string, content: string) => {
        const state = get();
        const now = Math.floor(Date.now() / 1000);

        const newHistory = state.reportHistory.map((r) =>
          r.id === reportId ? { ...r, content, lastModified: now } : r
        );

        set({ reportHistory: newHistory });

        // Update currentReport if it's the one being edited
        if (state.currentReportId === reportId && state.currentReport) {
          set({ currentReport: { ...state.currentReport, content, lastModified: now } });
        }
      },

      updateReportName: (reportId: string, name: string) => {
        const state = get();
        const now = Math.floor(Date.now() / 1000);

        const newHistory = state.reportHistory.map((r) =>
          r.id === reportId ? { ...r, name, lastModified: now } : r
        );

        set({ reportHistory: newHistory });

        // Update currentReport if it's the one being edited
        if (state.currentReportId === reportId && state.currentReport) {
          set({ currentReport: { ...state.currentReport, name, lastModified: now } });
        }
      },
    }),
    {
      name: 'report-storage',
      // Only persist history and currentReportId
      partialize: (state) => ({
        reportHistory: state.reportHistory,
        currentReportId: state.currentReportId,
      }),
    }
  )
);

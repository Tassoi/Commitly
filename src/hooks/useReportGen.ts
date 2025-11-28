// Custom hook for report generation

import { invoke } from '@tauri-apps/api/core';
import type { Commit, Report } from '../types';

export const useReportGen = () => {
  const generateWeeklyReport = async (
    commits: Commit[],
    templateId?: string | null
  ): Promise<Report> => {
    return await invoke<Report>('generate_weekly_report', {
      commits,
      templateId: templateId ?? null,
    });
  };

  const generateMonthlyReport = async (
    commits: Commit[],
    templateId?: string | null
  ): Promise<Report> => {
    return await invoke<Report>('generate_monthly_report', {
      commits,
      templateId: templateId ?? null,
    });
  };

  const exportReport = async (report: Report, format: string): Promise<string> => {
    return await invoke<string>('export_report', { report, format });
  };

  return {
    generateWeeklyReport,
    generateMonthlyReport,
    exportReport,
  };
};

// Core domain types for GitLog AI Reporter

export interface Commit {
  hash: string;
  author: string;
  email: string;
  timestamp: number;
  message: string;
  diff?: string;
}

export interface RepoInfo {
  path: string;
  name: string;
  branch: string;
  totalCommits: number;
}

export interface Report {
  id: string;
  name: string; // User-editable report name
  type: 'weekly' | 'monthly' | 'custom';
  generatedAt: number;
  lastModified: number; // Timestamp when report was last edited
  content: string;
  commits: Commit[];
  repoIds: string[]; // References to repositories involved in this report
  metadata?: {
    commitRange?: { from: number; to: number };
    generationParams?: Record<string, unknown>;
  };
}

export interface LLMConfig {
  provider: 'openai' | 'deepseek' | 'local';
  apiKey?: string;
  baseUrl?: string;
  modelPath?: string;
}

export interface AppConfig {
  llm: LLMConfig;
  exportFormat: 'markdown' | 'html' | 'pdf';
  timezone: string;
}

export interface RepoStats {
  totalCommits: number;
  authors: number;
  filesChanged: number;
  insertions: number;
  deletions: number;
}

// Repository history item for sidebar display
export interface RepoHistoryItem {
  id: string; // Unique identifier
  path: string;
  name: string;
  branch: string;
  totalCommits: number;
  lastAccessed: number; // Unix timestamp for sorting
  addedAt: number; // When first added to history
}

// UI preferences for sidebar state and theme
export interface UIPreferences {
  sidebarCollapsed: boolean;
  sidebarWidth: number; // For future resizable implementation
  theme: 'light' | 'dark' | 'system';
  lastOpenRepoId?: string; // Remember last opened repo
  lastOpenReportId?: string;
}

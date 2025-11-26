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
  type: 'weekly' | 'monthly' | 'custom';
  generatedAt: number;
  content: string;
  commits: Commit[];
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

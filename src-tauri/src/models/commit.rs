// Git-related data models

use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Commit {
    pub hash: String,
    pub author: String,
    pub email: String,
    pub timestamp: i64,
    pub message: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub diff: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RepoInfo {
    pub path: String,
    pub name: String,
    pub branch: String,
    pub total_commits: usize,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RepoStats {
    pub total_commits: usize,
    pub authors: usize,
    pub files_changed: usize,
    pub insertions: usize,
    pub deletions: usize,
}

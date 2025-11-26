// Git-related Tauri commands

use crate::models::{Commit, RepoInfo};
use crate::services::GitService;

#[tauri::command]
pub async fn open_repository(path: String) -> Result<RepoInfo, String> {
    let _git_service = GitService::open_repo(&path)?;
    // TODO: Return actual repo info
    Ok(RepoInfo {
        path: path.clone(),
        name: "Repository Name".to_string(),
        branch: "main".to_string(),
        total_commits: 0,
    })
}

#[tauri::command]
pub async fn get_commits(path: String, from: i64, to: i64) -> Result<Vec<Commit>, String> {
    let git_service = GitService::open_repo(&path)?;
    git_service.get_commits(from, to)
}

#[tauri::command]
pub async fn get_commit_diff(path: String, hash: String) -> Result<String, String> {
    let git_service = GitService::open_repo(&path)?;
    git_service.get_commit_diff(&hash)
}

// 报告相关数据模型

use super::commit::Commit;
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum ReportType {
    Weekly,
    Monthly,
    Custom,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RepoGroup {
    #[serde(rename = "repo_id")]
    pub repo_id: String,
    #[serde(rename = "repo_name")]
    pub repo_name: String,
    #[serde(rename = "repo_path")]
    pub repo_path: String,
    pub commits: Vec<Commit>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Report {
    pub id: String,
    #[serde(rename = "type")]
    pub report_type: ReportType,
    #[serde(rename = "generatedAt")]
    pub generated_at: i64,
    pub content: String,
    pub commits: Vec<Commit>,
}

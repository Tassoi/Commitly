// Report-related Tauri commands

use crate::models::{Commit, Report};

#[tauri::command]
pub async fn generate_weekly_report(commits: Vec<Commit>) -> Result<Report, String> {
    // TODO: Use ReportService to generate report
    Err("Not implemented".to_string())
}

#[tauri::command]
pub async fn generate_monthly_report(commits: Vec<Commit>) -> Result<Report, String> {
    // TODO: Use ReportService to generate report
    Err("Not implemented".to_string())
}

#[tauri::command]
pub async fn export_report(report: Report, format: String) -> Result<String, String> {
    // TODO: Implement export functionality
    Err("Not implemented".to_string())
}

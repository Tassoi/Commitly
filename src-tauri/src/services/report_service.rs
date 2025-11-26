// Report service - orchestrates report generation

use crate::models::{Commit, Report, ReportType};
use crate::services::llm_service::LLMService;
use std::sync::Arc;

pub struct ReportService {
    llm_service: Arc<LLMService>,
}

impl ReportService {
    pub fn new(llm_service: Arc<LLMService>) -> Self {
        Self { llm_service }
    }

    /// Generates a weekly report
    pub async fn generate_weekly(&self, commits: Vec<Commit>) -> Result<Report, String> {
        self.generate_report(commits, ReportType::Weekly, "weekly_template").await
    }

    /// Generates a monthly report
    pub async fn generate_monthly(&self, commits: Vec<Commit>) -> Result<Report, String> {
        self.generate_report(commits, ReportType::Monthly, "monthly_template").await
    }

    /// Generates a custom report
    pub async fn generate_custom(&self, commits: Vec<Commit>, template: &str) -> Result<Report, String> {
        self.generate_report(commits, ReportType::Custom, template).await
    }

    async fn generate_report(&self, commits: Vec<Commit>, report_type: ReportType, template: &str) -> Result<Report, String> {
        let content = self.llm_service.generate_report(&commits, template).await?;

        Ok(Report {
            id: uuid::Uuid::new_v4().to_string(),
            report_type,
            generated_at: chrono::Utc::now().timestamp(),
            content,
            commits,
        })
    }
}

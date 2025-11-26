// LLM service - handles AI model interactions

use crate::models::{Commit, LLMProvider};

pub struct LLMService {
    provider: LLMProvider,
    // TODO: Add reqwest::Client when needed
}

impl LLMService {
    pub fn new(provider: LLMProvider) -> Self {
        Self { provider }
    }

    /// Generates a report from commits using LLM
    pub async fn generate_report(&self, commits: &[Commit], template: &str) -> Result<String, String> {
        // TODO: Implement LLM API call
        Ok(String::from("Generated report placeholder"))
    }

    /// Optimizes a commit message using LLM
    pub async fn optimize_commit_msg(&self, original: &str) -> Result<String, String> {
        // TODO: Implement commit message optimization
        Ok(original.to_string())
    }
}

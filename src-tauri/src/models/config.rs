// Configuration data models

use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "provider", rename_all = "lowercase")]
pub enum LLMProvider {
    OpenAI {
        api_key: String,
        base_url: String,
    },
    DeepSeek {
        api_key: String,
    },
    Local {
        model_path: String,
    },
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct LLMConfig {
    pub provider: LLMProvider,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum ExportFormat {
    Markdown,
    Html,
    Pdf,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AppConfig {
    pub llm: LLMConfig,
    pub export_format: ExportFormat,
    pub timezone: String,
}

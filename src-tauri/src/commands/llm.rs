// LLM-related Tauri commands

use crate::models::LLMProvider;
use crate::services::LLMService;

#[tauri::command]
pub async fn configure_llm(provider: LLMProvider) -> Result<(), String> {
    // TODO: Store LLM configuration
    let _llm_service = LLMService::new(provider);
    Ok(())
}

#[tauri::command]
pub async fn test_llm_connection(provider: LLMProvider) -> Result<bool, String> {
    // TODO: Test LLM connection
    Ok(true)
}

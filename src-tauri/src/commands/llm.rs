// LLM-related Tauri commands

use crate::models::LLMProvider;
use crate::services::{llm_service::LLMService, storage_service::StorageService};
use tauri::AppHandle;

#[tauri::command]
pub async fn configure_llm(provider: LLMProvider, app: AppHandle) -> Result<(), String> {
    // Validate provider configuration
    provider.validate()?;

    // Load proxy config from stored configuration (M5)
    let config = StorageService::load_config(&app)?;

    // Note: Actual storage is handled by save_config command in config.rs
    // This command just validates the provider can be instantiated
    let _llm_service = LLMService::new(provider, Some(config.proxy_config));
    Ok(())
}

#[tauri::command]
pub async fn test_llm_connection(provider: LLMProvider, app: AppHandle) -> Result<bool, String> {
    // Validate provider configuration
    provider.validate()?;

    // Load proxy config from stored configuration (M5)
    let config = StorageService::load_config(&app)?;

    // Create LLM service and test connection
    let llm_service = LLMService::new(provider, Some(config.proxy_config));
    llm_service.test_connection().await?;

    Ok(true)
}

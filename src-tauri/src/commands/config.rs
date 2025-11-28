// Configuration-related Tauri commands

use crate::models::AppConfig;
use crate::services::StorageService;
use tauri::AppHandle;

#[tauri::command]
pub async fn save_config(config: AppConfig, app: AppHandle) -> Result<(), String> {
    // Validate config before saving
    StorageService::validate_config(&config)?;

    // Save to persistent storage (API Keys are encrypted automatically)
    StorageService::save_config(&app, &config)?;

    Ok(())
}

#[tauri::command]
pub async fn load_config(app: AppHandle) -> Result<AppConfig, String> {
    // Load from persistent storage (API Keys are decrypted automatically)
    StorageService::load_config(&app)
}

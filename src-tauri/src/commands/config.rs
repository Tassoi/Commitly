// Configuration-related Tauri commands

use crate::models::AppConfig;
use crate::services::StorageService;

#[tauri::command]
pub async fn save_config(config: AppConfig) -> Result<(), String> {
    let storage = StorageService::new();
    storage.save_config(&config)
}

#[tauri::command]
pub async fn load_config() -> Result<AppConfig, String> {
    let storage = StorageService::new();
    storage.load_config()
}

#[tauri::command]
pub async fn save_api_key(key: String) -> Result<(), String> {
    let storage = StorageService::new();
    storage.save_api_key(&key)
}

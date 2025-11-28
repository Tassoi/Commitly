// Storage service - handles configuration persistence using tauri-plugin-store

use crate::models::AppConfig;
use crate::services::EncryptionService;
use tauri::AppHandle;
use tauri_plugin_store::StoreExt;

pub struct StorageService;

impl StorageService {
    /// Saves application configuration to persistent storage
    /// API Keys are encrypted using AES-256-GCM before storing
    pub fn save_config(app: &AppHandle, config: &AppConfig) -> Result<(), String> {
        let store = app
            .store("config.json")
            .map_err(|e| format!("Failed to access store: {}", e))?;

        // Clone config and encrypt API key if present
        let mut config_to_save = config.clone();

        if let Some(api_key) = config_to_save.llm_provider.take_api_key() {
            if !api_key.is_empty() {
                // Encrypt the API key
                let encrypted_key = EncryptionService::encrypt(&api_key)?;
                config_to_save.llm_provider.set_api_key(encrypted_key);
            }
        }

        // Save encrypted config to file
        store.set("llm_config", serde_json::to_value(&config_to_save).unwrap());
        store
            .save()
            .map_err(|e| format!("Failed to save config: {}", e))?;

        Ok(())
    }

    /// Loads application configuration from persistent storage
    /// Encrypted API Keys are decrypted before returning
    pub fn load_config(app: &AppHandle) -> Result<AppConfig, String> {
        let store = app
            .store("config.json")
            .map_err(|e| format!("Failed to access store: {}", e))?;

        let mut config = if let Some(value) = store.get("llm_config") {
            serde_json::from_value(value.clone())
                .map_err(|e| format!("Failed to deserialize config: {}", e))?
        } else {
            // Return default config if not found
            AppConfig::default()
        };

        // Decrypt API key if present
        if let Some(encrypted_key) = config.llm_provider.take_api_key() {
            if !encrypted_key.is_empty() {
                // Try to decrypt - if it fails, it might be plaintext (migration case)
                match EncryptionService::decrypt(&encrypted_key) {
                    Ok(decrypted_key) => {
                        config.llm_provider.set_api_key(decrypted_key);
                    }
                    Err(_) => {
                        // If decryption fails, assume it's plaintext (old format)
                        // Keep the original value and it will be re-encrypted on next save
                        config.llm_provider.set_api_key(encrypted_key);
                    }
                }
            }
        }

        Ok(config)
    }

    /// Validates configuration before saving
    pub fn validate_config(config: &AppConfig) -> Result<(), String> {
        config.llm_provider.validate()
    }
}

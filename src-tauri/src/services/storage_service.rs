// Storage service - handles configuration and data persistence

use crate::models::AppConfig;

pub struct StorageService {
    // TODO: Add tauri-plugin-store when available
}

impl StorageService {
    pub fn new() -> Self {
        Self {}
    }

    /// Saves application configuration
    pub fn save_config(&self, config: &AppConfig) -> Result<(), String> {
        // TODO: Implement with tauri-plugin-store + encryption
        Ok(())
    }

    /// Loads application configuration
    pub fn load_config(&self) -> Result<AppConfig, String> {
        // TODO: Implement with tauri-plugin-store + decryption
        Err("Not implemented".to_string())
    }

    /// Saves API key to system keyring
    pub fn save_api_key(&self, key: &str) -> Result<(), String> {
        // TODO: Implement with keyring-rs
        Ok(())
    }

    /// Loads API key from system keyring
    pub fn load_api_key(&self) -> Result<String, String> {
        // TODO: Implement with keyring-rs
        Err("Not implemented".to_string())
    }
}

// Local encryption service for API keys using AES-256-GCM
// Encryption key is derived from machine ID + app identifier

use aes_gcm::{
    aead::{Aead, KeyInit},
    Aes256Gcm, Nonce,
};
use base64::{engine::general_purpose, Engine as _};
use rand::Rng;
use sha2::{Digest, Sha256};

const APP_IDENTIFIER: &str = "com.hkdev.gitlog-ai-reporter";
const NONCE_SIZE: usize = 12; // 96 bits for GCM

pub struct EncryptionService;

impl EncryptionService {
    /// Encrypts a string and returns base64-encoded result (nonce + ciphertext)
    pub fn encrypt(plaintext: &str) -> Result<String, String> {
        let key = Self::get_encryption_key()?;
        let cipher = Aes256Gcm::new(&key);

        // Generate random nonce
        let mut rng = rand::thread_rng();
        let nonce_bytes: [u8; NONCE_SIZE] = rng.gen();
        let nonce = Nonce::from_slice(&nonce_bytes);

        // Encrypt
        let ciphertext = cipher
            .encrypt(nonce, plaintext.as_bytes())
            .map_err(|e| format!("Encryption failed: {}", e))?;

        // Combine nonce + ciphertext and encode as base64
        let mut combined = nonce_bytes.to_vec();
        combined.extend_from_slice(&ciphertext);
        Ok(general_purpose::STANDARD.encode(&combined))
    }

    /// Decrypts a base64-encoded string (nonce + ciphertext)
    pub fn decrypt(encrypted: &str) -> Result<String, String> {
        let key = Self::get_encryption_key()?;
        let cipher = Aes256Gcm::new(&key);

        // Decode base64
        let combined = general_purpose::STANDARD
            .decode(encrypted)
            .map_err(|e| format!("Base64 decode failed: {}", e))?;

        if combined.len() < NONCE_SIZE {
            return Err("Invalid encrypted data".to_string());
        }

        // Split nonce and ciphertext
        let (nonce_bytes, ciphertext) = combined.split_at(NONCE_SIZE);
        let nonce = Nonce::from_slice(nonce_bytes);

        // Decrypt
        let plaintext = cipher
            .decrypt(nonce, ciphertext)
            .map_err(|e| format!("Decryption failed: {}", e))?;

        String::from_utf8(plaintext).map_err(|e| format!("UTF-8 decode failed: {}", e))
    }

    /// Derives a 256-bit encryption key from machine UUID + app identifier
    fn get_encryption_key() -> Result<aes_gcm::Key<Aes256Gcm>, String> {
        let machine_id = Self::get_machine_id()?;

        // Derive key using SHA-256(machine_id + app_identifier)
        let mut hasher = Sha256::new();
        hasher.update(machine_id.as_bytes());
        hasher.update(APP_IDENTIFIER.as_bytes());
        let key_bytes = hasher.finalize();

        Ok(aes_gcm::Key::<Aes256Gcm>::from_slice(&key_bytes).clone())
    }

    /// Gets a unique machine identifier
    fn get_machine_id() -> Result<String, String> {
        // Use machine-uid crate for cross-platform machine ID
        machine_uid::get().map_err(|e| format!("Failed to get machine ID: {}", e))
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_encrypt_decrypt() {
        let plaintext = "sk-1234567890abcdef";
        let encrypted = EncryptionService::encrypt(plaintext).unwrap();
        let decrypted = EncryptionService::decrypt(&encrypted).unwrap();
        assert_eq!(plaintext, decrypted);
    }

    #[test]
    fn test_different_nonces() {
        let plaintext = "test-key";
        let encrypted1 = EncryptionService::encrypt(plaintext).unwrap();
        let encrypted2 = EncryptionService::encrypt(plaintext).unwrap();
        // Different nonces should produce different ciphertexts
        assert_ne!(encrypted1, encrypted2);
        // But both should decrypt to the same plaintext
        assert_eq!(
            EncryptionService::decrypt(&encrypted1).unwrap(),
            EncryptionService::decrypt(&encrypted2).unwrap()
        );
    }
}

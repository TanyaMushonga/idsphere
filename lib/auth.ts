import * as LocalAuthentication from "expo-local-authentication";
import * as SecureStore from "expo-secure-store";
import CryptoJS from "crypto-js";

export const BiometricAuth = {
  // Check device capabilities
  isAvailable: async () => {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      return hasHardware && isEnrolled;
    } catch (error) {
      console.error("Error checking biometric availability:", error);
      return false;
    }
  },

  // Get available authentication types
  getAvailableTypes: async () => {
    try {
      return await LocalAuthentication.supportedAuthenticationTypesAsync();
    } catch (error) {
      console.error("Error getting auth types:", error);
      return [];
    }
  },

  // Authenticate user with enhanced options
  authenticate: async (reason = "Access your identity wallet") => {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: reason,
        disableDeviceFallback: false, // Allow system fallback
        cancelLabel: "Cancel",
        fallbackLabel: "Use PIN",
        requireConfirmation: true,
      });

      if (!result.success) {
        console.warn("Auth failed");
      }

      return result.success;
    } catch (error) {
      console.error("Auth error:", error);
      return false;
    }
  },

  // Store encrypted PIN with salt
  setPIN: async (pin: string) => {
    try {
      const salt = CryptoJS.lib.WordArray.random(128 / 8).toString();
      const hashedPIN = CryptoJS.PBKDF2(pin, salt, {
        keySize: 256 / 32,
        iterations: 10000,
      }).toString();

      await SecureStore.setItemAsync("user_pin", hashedPIN, {
        keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
      });

      await SecureStore.setItemAsync("pin_salt", salt, {
        keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
      });

      return true;
    } catch (error) {
      console.error("Error setting PIN:", error);
      throw new Error("Failed to save PIN");
    }
  },

  // Verify PIN with proper hashing
  verifyPIN: async (pin: string) => {
    try {
      const storedHash = await SecureStore.getItemAsync("user_pin");
      const salt = await SecureStore.getItemAsync("pin_salt");

      if (!storedHash || !salt) {
        return false;
      }

      const hashedInput = CryptoJS.PBKDF2(pin, salt, {
        keySize: 256 / 32,
        iterations: 10000,
      }).toString();

      return hashedInput === storedHash;
    } catch (error) {
      console.error("Error verifying PIN:", error);
      return false;
    }
  },

  // Check if PIN exists
  hasPIN: async () => {
    try {
      const storedPIN = await SecureStore.getItemAsync("user_pin");
      return storedPIN !== null;
    } catch (error) {
      console.error("Error checking PIN:", error);
      return false;
    }
  },

  // Clear stored credentials
  clearCredentials: async () => {
    try {
      await SecureStore.deleteItemAsync("user_pin");
      await SecureStore.deleteItemAsync("pin_salt");
      return true;
    } catch (error) {
      console.error("Error clearing credentials:", error);
      return false;
    }
  },
};

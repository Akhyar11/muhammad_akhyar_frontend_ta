/**
 * Browser LocalStorage Usage Guide
 *
 * This file demonstrates how to use the browser's built-in localStorage API
 * for common operations without any wrapper classes.
 */

// Basic operations with localStorage

/**
 * Store a value in localStorage
 * @param key The key to store the value under
 * @param value The value to store (will be JSON stringified)
 */
export function saveToLocalStorage<T>(key: string, value: T): void {
  try {
    const serializedValue = JSON.stringify(value);
    localStorage.setItem(key, serializedValue);
  } catch (error) {
    console.error(`Error saving to localStorage: ${error}`);
  }
}

/**
 * Retrieve a value from localStorage
 * @param key The key to retrieve
 * @returns The parsed value or null if not found
 */
export function getFromLocalStorage<T>(key: string): T | null {
  try {
    const item = localStorage.getItem(key);
    if (item === null) {
      return null;
    }
    return JSON.parse(item) as T;
  } catch (error) {
    console.error(`Error reading from localStorage: ${error}`);
    return null;
  }
}

/**
 * Remove an item from localStorage
 * @param key The key to remove
 */
export function removeFromLocalStorage(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing from localStorage: ${error}`);
  }
}

/**
 * Clear all items from localStorage
 */
export function clearLocalStorage(): void {
  try {
    localStorage.clear();
  } catch (error) {
    console.error(`Error clearing localStorage: ${error}`);
  }
}

/**
 * Get all keys stored in localStorage
 * @returns Array of keys
 */
export function getLocalStorageKeys(): string[] {
  try {
    return Object.keys(localStorage);
  } catch (error) {
    console.error(`Error getting localStorage keys: ${error}`);
    return [];
  }
}

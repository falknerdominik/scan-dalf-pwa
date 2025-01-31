export class LocalStorageService {
    /**
     * Save an item to localStorage.
     * @param {string} key - The key under which the value is stored.
     * @param {any} value - The value to store (primitive, list, or object).
     */
    static save(key, value) {
      try {
        localStorage.setItem(key, JSON.stringify(value)); // Save item
        console.log(`Saved: [${key}]`, value);
      } catch (error) {
        console.error(`Failed to save [${key}] to localStorage:`, error);
      }
    }

    /**
     * Get an item from localStorage.
     * @param {string} key - The key of the item to get.
     * @returns {any} The retrieved value (parsed from JSON) or null if not found.
     */
    static get(key) {
      try {
        const item = localStorage.getItem(key); // Get item
        return item ? JSON.parse(item) : null;
      } catch (error) {
        console.error(`Failed to get [${key}] from localStorage:`, error);
        return null;
      }
    }

    /**
     * Update an item in localStorage.
     * If the item does not exist, it will be created.
     * @param {string} key - The key of the item to update.
     * @param {Function} updateFn - A function that takes the current value and returns the updated value.
     */
    static update(key, updateFn) {
      try {
        const currentValue = LocalStorageService.get(key);
        const updatedValue = updateFn(currentValue);
        localStorage.setItem(key, JSON.stringify(updatedValue)); // Save updated item
        console.log(`Updated: [${key}]`, updatedValue);
      } catch (error) {
        console.error(`Failed to update [${key}] in localStorage:`, error);
      }
    }

    /**
     * Delete an item from localStorage.
     * @param {string} key - The key of the item to delete.
     */
    static delete(key) {
      try {
        localStorage.removeItem(key); // Remove item
        console.log(`Deleted: [${key}]`);
      } catch (error) {
        console.error(`Failed to delete [${key}] from localStorage:`, error);
      }
    }

    /**
     * Clear all items in localStorage.
     */
    static clear() {
      try {
        localStorage.clear(); // Clear all items
        console.log('Cleared all localStorage items.');
      } catch (error) {
        console.error('Failed to clear localStorage:', error);
      }
    }

    /**
     * Get all keys and values from localStorage.
     * @returns {Object} An object with all key-value pairs from localStorage.
     */
    static getAll() {
      try {
        const allItems = {};
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key) {
            allItems[key] = LocalStorageService.get(key);
          }
        }
        return allItems;
      } catch (error) {
        console.error('Failed to get all items from localStorage:', error);
        return {};
      }
    }
  }

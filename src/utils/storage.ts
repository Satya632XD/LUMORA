/**
 * Safe LocalStorage persistence engine with fallback memory store.
 */

const STORAGE_PREFIX = 'lumora_';

class StorageManager {
  private memoryFallback: Record<string, string> = {};

  public getItem<T>(key: string, defaultValue: T): T {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const item = window.localStorage.getItem(STORAGE_PREFIX + key);
        if (item !== null) {
          return JSON.parse(item) as T;
        }
      }
    } catch (e) {
      console.warn(`LocalStorage read error for ${key}:`, e);
      if (this.memoryFallback[key] !== undefined) {
        return JSON.parse(this.memoryFallback[key]) as T;
      }
    }
    return defaultValue;
  }

  public setItem<T>(key: string, value: T): void {
    try {
      const serialized = JSON.stringify(value);
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(STORAGE_PREFIX + key, serialized);
      }
      this.memoryFallback[key] = serialized;
    } catch (e) {
      console.warn(`LocalStorage write error for ${key}:`, e);
      this.memoryFallback[key] = JSON.stringify(value);
    }
  }

  public removeItem(key: string): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(STORAGE_PREFIX + key);
      }
      delete this.memoryFallback[key];
    } catch (e) {
      console.warn(`LocalStorage remove error for ${key}:`, e);
    }
  }

  public clearAll(): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        Object.keys(window.localStorage).forEach(k => {
          if (k.startsWith(STORAGE_PREFIX)) {
            window.localStorage.removeItem(k);
          }
        });
      }
      this.memoryFallback = {};
    } catch (e) {
      console.warn('LocalStorage clear error:', e);
    }
  }
}

export const storage = new StorageManager();

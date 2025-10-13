export interface CacheConfig {
  ttl?: number;
  storage?: 'memory' | 'localStorage' | 'sessionStorage';
  maxSize?: number;
}

interface CacheItem<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

class CacheService {
  private memoryCache = new Map<string, CacheItem<unknown>>();
  private defaultTTL = 5 * 60 * 1000;
  private maxMemorySize = 100;

  constructor() {
    setInterval(() => {
      this.cleanupExpiredItems();
    }, 60 * 1000);
  }

  /**
   * Set data in cache
   */
  set<T>(key: string, data: T, config: CacheConfig = {}): void {
    const { ttl = this.defaultTTL, storage = 'memory', maxSize = this.maxMemorySize } = config;

    const cacheItem: CacheItem<T> = {
      data,
      timestamp: Date.now(),
      ttl,
    };

    switch (storage) {
      case 'memory':
        // Enforce memory cache size limit
        if (this.memoryCache.size >= maxSize) {
          this.evictOldestMemoryItem();
        }
        this.memoryCache.set(key, cacheItem);
        break;

      case 'localStorage':
        try {
          localStorage.setItem(`cache_${key}`, JSON.stringify(cacheItem));
        } catch (error) {
          console.warn('Failed to save to localStorage:', error);
          // Fallback to memory cache
          this.memoryCache.set(key, cacheItem);
        }
        break;

      case 'sessionStorage':
        try {
          sessionStorage.setItem(`cache_${key}`, JSON.stringify(cacheItem));
        } catch (error) {
          console.warn('Failed to save to sessionStorage:', error);
          // Fallback to memory cache
          this.memoryCache.set(key, cacheItem);
        }
        break;
    }
  }

  get<T>(key: string, storage: 'memory' | 'localStorage' | 'sessionStorage' = 'memory'): T | null {
    let cacheItem: CacheItem<T> | null = null;

    switch (storage) {
      case 'memory':
        cacheItem = (this.memoryCache.get(key) as CacheItem<T>) || null;
        break;

      case 'localStorage':
        try {
          const item = localStorage.getItem(`cache_${key}`);
          if (item) {
            cacheItem = JSON.parse(item);
          }
        } catch (error) {
          console.warn('Failed to read from localStorage:', error);
        }
        break;

      case 'sessionStorage':
        try {
          const item = sessionStorage.getItem(`cache_${key}`);
          if (item) {
            cacheItem = JSON.parse(item);
          }
        } catch (error) {
          console.warn('Failed to read from sessionStorage:', error);
        }
        break;
    }

    if (!cacheItem) {
      return null;
    }

    // Check if cache item has expired
    const now = Date.now();
    if (now - cacheItem.timestamp > cacheItem.ttl) {
      this.delete(key, storage);
      return null;
    }

    return cacheItem.data;
  }

  delete(key: string, storage: 'memory' | 'localStorage' | 'sessionStorage' = 'memory'): void {
    switch (storage) {
      case 'memory':
        this.memoryCache.delete(key);
        break;

      case 'localStorage':
        localStorage.removeItem(`cache_${key}`);
        break;

      case 'sessionStorage':
        sessionStorage.removeItem(`cache_${key}`);
        break;
    }
  }

  /**
   * Check if key exists in cache and is not expired
   */
  has(key: string, storage: 'memory' | 'localStorage' | 'sessionStorage' = 'memory'): boolean {
    return this.get(key, storage) !== null;
  }

  clear(storage?: 'memory' | 'localStorage' | 'sessionStorage'): void {
    if (!storage) {
      this.memoryCache.clear();
      this.clearStorageByPrefix('localStorage');
      this.clearStorageByPrefix('sessionStorage');
      return;
    }

    switch (storage) {
      case 'memory':
        this.memoryCache.clear();
        break;

      case 'localStorage':
        this.clearStorageByPrefix('localStorage');
        break;

      case 'sessionStorage':
        this.clearStorageByPrefix('sessionStorage');
        break;
    }
  }

  getStats() {
    const memorySize = this.memoryCache.size;
    let localStorageSize = 0;
    let sessionStorageSize = 0;

    // Count localStorage cache items
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('cache_')) {
        localStorageSize++;
      }
    }

    // Count sessionStorage cache items
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key?.startsWith('cache_')) {
        sessionStorageSize++;
      }
    }

    return {
      memory: {
        size: memorySize,
        maxSize: this.maxMemorySize,
      },
      localStorage: {
        size: localStorageSize,
      },
      sessionStorage: {
        size: sessionStorageSize,
      },
    };
  }
  createKey(...parts: (string | number | boolean | undefined | null)[]): string {
    return parts
      .filter(part => part !== undefined && part !== null)
      .map(part => String(part))
      .join('_');
  }

  async getOrFetch<T>(
    key: string,
    fetchFunction: () => Promise<T>,
    config: CacheConfig = {},
  ): Promise<T> {
    const { storage = 'memory' } = config;

    // Try to get from cache first
    const cachedData = this.get<T>(key, storage);
    if (cachedData !== null) {
      return cachedData;
    }

    // Fetch new data
    const data = await fetchFunction();

    // Cache the result
    this.set(key, data, config);

    return data;
  }

  /**
   * Private methods
   */
  private cleanupExpiredItems(): void {
    const now = Date.now();

    // Clean memory cache
    for (const [key, item] of this.memoryCache.entries()) {
      if (now - item.timestamp > item.ttl) {
        this.memoryCache.delete(key);
      }
    }

    this.cleanupExpiredStorageItems('localStorage');

    this.cleanupExpiredStorageItems('sessionStorage');
  }

  private cleanupExpiredStorageItems(storageType: 'localStorage' | 'sessionStorage'): void {
    const storage = storageType === 'localStorage' ? localStorage : sessionStorage;
    const now = Date.now();
    const keysToRemove: string[] = [];

    for (let i = 0; i < storage.length; i++) {
      const key = storage.key(i);
      if (key?.startsWith('cache_')) {
        try {
          const item = JSON.parse(storage.getItem(key) || '');
          if (now - item.timestamp > item.ttl) {
            keysToRemove.push(key);
          }
        } catch {
          // Invalid cache item, remove it
          keysToRemove.push(key);
        }
      }
    }

    keysToRemove.forEach(key => storage.removeItem(key));
  }

  private evictOldestMemoryItem(): void {
    let oldestKey: string | null = null;
    let oldestTimestamp = Date.now();

    for (const [key, item] of this.memoryCache.entries()) {
      if (item.timestamp < oldestTimestamp) {
        oldestTimestamp = item.timestamp;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      this.memoryCache.delete(oldestKey);
    }
  }

  private clearStorageByPrefix(storageType: 'localStorage' | 'sessionStorage'): void {
    const storage = storageType === 'localStorage' ? localStorage : sessionStorage;
    const keysToRemove: string[] = [];

    for (let i = 0; i < storage.length; i++) {
      const key = storage.key(i);
      if (key?.startsWith('cache_')) {
        keysToRemove.push(key);
      }
    }

    keysToRemove.forEach(key => storage.removeItem(key));
  }
}

export const cacheService = new CacheService();

export const contactsCache = {
  set: (key: string, data: unknown) =>
    cacheService.set(key, data, { ttl: 5 * 60 * 1000, storage: 'localStorage' }),
  get: (key: string) => cacheService.get(key, 'localStorage'),
  delete: (key: string) => cacheService.delete(key, 'localStorage'),
  clear: () => cacheService.clear('localStorage'),
};

export const weatherCache = {
  set: (key: string, data: unknown) =>
    cacheService.set(key, data, { ttl: 10 * 60 * 1000, storage: 'sessionStorage' }),
  get: (key: string) => cacheService.get(key, 'sessionStorage'),
  delete: (key: string) => cacheService.delete(key, 'sessionStorage'),
  clear: () => cacheService.clear('sessionStorage'),
};

export const apiCache = {
  set: (key: string, data: unknown, ttl?: number) =>
    cacheService.set(key, data, { ttl: ttl || 2 * 60 * 1000 }),
  get: (key: string) => cacheService.get(key, 'memory'),
  delete: (key: string) => cacheService.delete(key, 'memory'),
  clear: () => cacheService.clear('memory'),
};

export default cacheService;

/**
 * API Response Cache
 * Simple in-memory cache with TTL for reducing database queries
 */

class ApiCache {
  constructor() {
    this.cache = new Map();
  }

  set(key, value, ttlSeconds = 300) { // 5 minutes default
    this.cache.set(key, {
      value,
      expiresAt: Date.now() + ttlSeconds * 1000,
    });
  }

  get(key) {
    const item = this.cache.get(key);
    
    if (!item) {
      return null;
    }

    if (Date.now() > item.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return item.value;
  }

  has(key) {
    const item = this.cache.get(key);
    return item && Date.now() <= item.expiresAt;
  }

  clear() {
    this.cache.clear();
  }

  delete(key) {
    this.cache.delete(key);
  }
}

export default new ApiCache();

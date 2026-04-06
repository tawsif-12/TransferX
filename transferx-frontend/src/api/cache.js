/**
 * Simple in-memory cache for API responses
 * Reduces unnecessary API calls for frequently accessed data
 */
class ResponseCache {
  constructor(ttl = 5 * 60 * 1000) { // 5 minutes default TTL
    this.cache = new Map();
    this.timers = new Map();
    this.ttl = ttl;
  }

  set(key, value, customTtl = null) {
    // Clear existing timer if any
    if (this.timers.has(key)) {
      clearTimeout(this.timers.get(key));
    }

    // Store the value
    this.cache.set(key, {
      data: value,
      timestamp: Date.now()
    });

    // Set expiry timer
    const expiryTime = customTtl || this.ttl;
    const timer = setTimeout(() => {
      this.cache.delete(key);
      this.timers.delete(key);
    }, expiryTime);

    this.timers.set(key, timer);
  }

  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;
    
    // Check if expired (optional double-check)
    if (Date.now() - item.timestamp > this.ttl) {
      this.cache.delete(key);
      this.timers.delete(key);
      return null;
    }

    return item.data;
  }

  has(key) {
    return this.cache.has(key);
  }

  clear() {
    this.timers.forEach(timer => clearTimeout(timer));
    this.cache.clear();
    this.timers.clear();
  }

  delete(key) {
    if (this.timers.has(key)) {
      clearTimeout(this.timers.get(key));
      this.timers.delete(key);
    }
    this.cache.delete(key);
  }
}

export default new ResponseCache();

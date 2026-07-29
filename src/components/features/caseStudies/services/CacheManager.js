const DEFAULT_OPTIONS = Object.freeze({
  ttl: 5 * 60 * 1000,
  maxEntries: 100,
});

class CacheManager {
  constructor(options = {}) {
    this.options = { ...DEFAULT_OPTIONS, ...options };
    this.store = new Map();
  }
  set(key, value, ttl = this.options.ttl) {
    if (!key) throw new TypeError("Cache key is required.");
    if (this.store.size >= this.options.maxEntries) {
      this.store.delete(this.store.keys().next().value);
    }
    this.store.set(key, {
      value,
      expiresAt: ttl > 0 ? Date.now() + ttl : Infinity,
    });
    return value;
  }
  get(key) {
    const entry = this.store.get(key);
    if (!entry) return null;
    if (entry.expiresAt <= Date.now()) {
      this.store.delete(key);
      return null;
    }

    return entry.value;
  }
  has(key) {
    return this.get(key) !== null;
  }
  delete(key) {
    return this.store.delete(key);
  }
  clear() {
    this.store.clear();
  }
  get size() {
    return this.store.size;
  }
}

export default new CacheManager();
export { CacheManager };

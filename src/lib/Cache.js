import Redis from 'ioredis';

const CACHE_PREFIX = 'cache:';

class Cache {
  constructor() {
    this.redis = new Redis({
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      keyPrefix: CACHE_PREFIX,
    });
  }

  set(key, value) {
    return this.redis.set(key, JSON.stringify(value), 'EX', 60 * 60 * 24);
  }

  async get(key) {
    const cached = await this.redis.get(key);
    return cached ? JSON.parse(cached) : null;
  }

  invalidate(key) {
    return this.redis.del(key);
  }

  async invalidatePrefix(prefix) {
    const keys = await this.redis.keys(`${CACHE_PREFIX}${prefix}:*`);
    const keysWithoutPrefix = keys.map(key =>
      key.replace(`${CACHE_PREFIX}`, '')
    );
    return this.redis.del(keysWithoutPrefix);
  }
}

export default new Cache();

import { createClient, RedisClientType } from 'redis';
import { env } from './env';
import { logger } from './logger';

/**
 * Cache Service Interface
 * Abstracts caching implementation (Redis or in-memory)
 */
export interface ICacheService {
  get<T>(key: string): Promise<T | null>;
  set(key: string, value: any, ttlSeconds?: number): Promise<void>;
  delete(key: string): Promise<void>;
  deletePattern(pattern: string): Promise<void>;
  clear(): Promise<void>;
}

/**
 * Redis Cache Implementation
 * Uses Redis for distributed caching
 */
class RedisCacheService implements ICacheService {
  private client: RedisClientType | null = null;
  private isConnected: boolean = false;

  /**
   * Connect to Redis server
   */
  public async connect(): Promise<void> {
    if (this.isConnected && this.client) {
      return;
    }

    try {
      this.client = createClient({
        socket: {
          host: env.redis.host,
          port: env.redis.port,
        },
        password: env.redis.password,
      });

      this.client.on('error', (error) => {
        logger.error('Redis client error', { error: error.message });
        this.isConnected = false;
      });

      this.client.on('connect', () => {
        logger.info('Redis client connecting...');
      });

      this.client.on('ready', () => {
        this.isConnected = true;
        logger.info('Redis client ready');
      });

      this.client.on('end', () => {
        this.isConnected = false;
        logger.warn('Redis client connection ended');
      });

      await this.client.connect();
    } catch (error) {
      logger.error('Failed to connect to Redis', { error });
      this.isConnected = false;
      // Don't throw - fallback to in-memory cache
    }
  }

  /**
   * Disconnect from Redis
   */
  public async disconnect(): Promise<void> {
    if (this.client && this.isConnected) {
      await this.client.quit();
      this.isConnected = false;
      logger.info('Redis client disconnected');
    }
  }

  public async get<T>(key: string): Promise<T | null> {
    if (!this.client || !this.isConnected) {
      return null;
    }

    try {
      const value = await this.client.get(key);
      if (!value) {
        return null;
      }
      return JSON.parse(value) as T;
    } catch (error) {
      logger.error('Redis get error', { key, error });
      return null;
    }
  }

  public async set(key: string, value: any, ttlSeconds?: number): Promise<void> {
    if (!this.client || !this.isConnected) {
      return;
    }

    try {
      const serialized = JSON.stringify(value);
      if (ttlSeconds) {
        await this.client.setEx(key, ttlSeconds, serialized);
      } else {
        await this.client.set(key, serialized);
      }
    } catch (error) {
      logger.error('Redis set error', { key, error });
    }
  }

  public async delete(key: string): Promise<void> {
    if (!this.client || !this.isConnected) {
      return;
    }

    try {
      await this.client.del(key);
    } catch (error) {
      logger.error('Redis delete error', { key, error });
    }
  }

  public async deletePattern(pattern: string): Promise<void> {
    if (!this.client || !this.isConnected) {
      return;
    }

    try {
      const keys = await this.client.keys(pattern);
      if (keys.length > 0) {
        await this.client.del(keys);
      }
    } catch (error) {
      logger.error('Redis deletePattern error', { pattern, error });
    }
  }

  public async clear(): Promise<void> {
    if (!this.client || !this.isConnected) {
      return;
    }

    try {
      await this.client.flushDb();
    } catch (error) {
      logger.error('Redis clear error', { error });
    }
  }
}

/**
 * In-Memory Cache Implementation
 * Fallback when Redis is not available
 */
class InMemoryCacheService implements ICacheService {
  private cache: Map<string, { value: any; expiry?: number }> = new Map();

  constructor() {
    // Cleanup expired entries every minute
    setInterval(() => {
      const now = Date.now();
      for (const [key, entry] of this.cache.entries()) {
        if (entry.expiry && entry.expiry < now) {
          this.cache.delete(key);
        }
      }
    }, 60000);
  }

  public async get<T>(key: string): Promise<T | null> {
    const entry = this.cache.get(key);
    if (!entry) {
      return null;
    }

    if (entry.expiry && entry.expiry < Date.now()) {
      this.cache.delete(key);
      return null;
    }

    return entry.value as T;
  }

  public async set(key: string, value: any, ttlSeconds?: number): Promise<void> {
    const entry: { value: any; expiry?: number } = { value };
    if (ttlSeconds) {
      entry.expiry = Date.now() + ttlSeconds * 1000;
    }
    this.cache.set(key, entry);
  }

  public async delete(key: string): Promise<void> {
    this.cache.delete(key);
  }

  public async deletePattern(pattern: string): Promise<void> {
    const regex = new RegExp(pattern.replace(/\*/g, '.*'));
    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.cache.delete(key);
      }
    }
  }

  public async clear(): Promise<void> {
    this.cache.clear();
  }
}

/**
 * Cache Service Factory
 * Returns Redis if enabled and available, otherwise in-memory
 */
class CacheServiceFactory {
  private static instance: ICacheService | null = null;

  public static async getInstance(): Promise<ICacheService> {
    if (CacheServiceFactory.instance) {
      return CacheServiceFactory.instance;
    }

    if (env.redis.enabled) {
      const redisCache = new RedisCacheService();
      await redisCache.connect();
      if ((redisCache as any).isConnected) {
        CacheServiceFactory.instance = redisCache;
        return redisCache;
      }
    }

    // Fallback to in-memory cache
    logger.info('Using in-memory cache (Redis not available)');
    CacheServiceFactory.instance = new InMemoryCacheService();
    return CacheServiceFactory.instance;
  }
}

// Export a function to get cache service instance
export async function getCacheService(): Promise<ICacheService> {
  return await CacheServiceFactory.getInstance();
}

// For convenience, create a singleton instance
let cacheServiceInstance: ICacheService | null = null;

export async function initializeCache(): Promise<ICacheService> {
  if (!cacheServiceInstance) {
    cacheServiceInstance = await CacheServiceFactory.getInstance();
  }
  return cacheServiceInstance;
}

// Export the instance getter
export function getCacheInstance(): ICacheService {
  if (!cacheServiceInstance) {
    throw new Error('Cache service not initialized. Call initializeCache() first.');
  }
  return cacheServiceInstance;
}


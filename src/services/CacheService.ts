import { getCacheService, ICacheService } from '../config/cache';
import { PaginatedMyListResponse } from '../types/myList.types';
import { logger } from '../config/logger';

/**
 * Cache Service
 * Handles caching operations for MyList feature
 * Optimized for <10ms response time requirement
 */
export class CacheService {
  private cache: ICacheService | null = null;
  private readonly CACHE_TTL_SECONDS = 300; // 5 minutes
  private readonly CACHE_PREFIX = 'mylist';

  /**
   * Initialize cache service
   */
  async initialize(): Promise<void> {
    try {
      this.cache = await getCacheService();
    } catch (error) {
      logger.warn('Cache service not available, continuing without cache', { error });
      this.cache = null;
    }
  }

  /**
   * Generate cache key for user's list
   */
  private getListCacheKey(userId: string, page: number, limit: number, contentType?: string): string {
    const baseKey = `${this.CACHE_PREFIX}:${userId}:${page}:${limit}`;
    return contentType ? `${baseKey}:${contentType}` : baseKey;
  }

  /**
   * Generate cache key pattern for user (for invalidation)
   */
  private getUserCachePattern(userId: string): string {
    return `${this.CACHE_PREFIX}:${userId}:*`;
  }

  /**
   * Get cached MyList
   */
  async getCachedList(
    userId: string,
    page: number,
    limit: number,
    contentType?: string
  ): Promise<PaginatedMyListResponse | null> {
    if (!this.cache) {
      return null;
    }

    try {
      const cacheKey = this.getListCacheKey(userId, page, limit, contentType);
      const cached = await this.cache.get<PaginatedMyListResponse>(cacheKey);
      
      if (cached) {
        logger.debug('Cache hit for MyList', { userId, page, limit, contentType });
        return cached;
      }

      logger.debug('Cache miss for MyList', { userId, page, limit, contentType });
      return null;
    } catch (error) {
      logger.error('Error getting cached MyList', { userId, error });
      return null;
    }
  }

  /**
   * Set cached MyList
   */
  async setCachedList(
    userId: string,
    page: number,
    limit: number,
    data: PaginatedMyListResponse,
    contentType?: string
  ): Promise<void> {
    if (!this.cache) {
      return;
    }

    try {
      const cacheKey = this.getListCacheKey(userId, page, limit, contentType);
      await this.cache.set(cacheKey, data, this.CACHE_TTL_SECONDS);
      logger.debug('Cached MyList', { userId, page, limit, contentType });
    } catch (error) {
      logger.error('Error setting cached MyList', { userId, error });
    }
  }

  /**
   * Invalidate all cached lists for a user
   * Called when user adds or removes items
   */
  async invalidateUserList(userId: string): Promise<void> {
    if (!this.cache) {
      return;
    }

    try {
      const pattern = this.getUserCachePattern(userId);
      await this.cache.deletePattern(pattern);
      logger.debug('Invalidated user MyList cache', { userId });
    } catch (error) {
      logger.error('Error invalidating user MyList cache', { userId, error });
    }
  }

  /**
   * Clear all cache (useful for testing)
   */
  async clearAll(): Promise<void> {
    if (!this.cache) {
      return;
    }

    try {
      await this.cache.clear();
      logger.info('Cleared all cache');
    } catch (error) {
      logger.error('Error clearing cache', { error });
    }
  }
}

// Singleton instance
let cacheServiceInstance: CacheService | null = null;

/**
 * Get cache service instance
 */
export async function getCacheServiceInstance(): Promise<CacheService> {
  if (!cacheServiceInstance) {
    cacheServiceInstance = new CacheService();
    await cacheServiceInstance.initialize();
  }
  return cacheServiceInstance;
}


/**
 * Service Layer Exports
 * Central export point for all services
 */

import { MyListService } from './MyListService';
import { CacheService, getCacheServiceInstance } from './CacheService';
import { IMyListService } from './interfaces/IMyListService';
import { MyListRepository } from '../repositories/implementations/MyListRepository';
import { ContentRepository } from '../repositories/implementations/ContentRepository';
import { UserRepository } from '../repositories/implementations/UserRepository';

/**
 * Service Factory
 * Creates and initializes service instances with dependencies
 * Follows Dependency Injection pattern
 */
export class ServiceFactory {
  private static myListService: IMyListService | null = null;
  private static cacheService: CacheService | null = null;

  /**
   * Get or create MyListService instance
   */
  static async getMyListService(): Promise<IMyListService> {
    if (ServiceFactory.myListService) {
      return ServiceFactory.myListService;
    }

    // Initialize dependencies
    const myListRepository = new MyListRepository();
    const contentRepository = new ContentRepository();
    const userRepository = new UserRepository();
    const cacheService = await getCacheServiceInstance();

    // Create service with dependencies
    ServiceFactory.myListService = new MyListService(
      myListRepository,
      contentRepository,
      userRepository,
      cacheService
    );

    return ServiceFactory.myListService;
  }

  /**
   * Get or create CacheService instance
   */
  static async getCacheService(): Promise<CacheService> {
    if (ServiceFactory.cacheService) {
      return ServiceFactory.cacheService;
    }

    ServiceFactory.cacheService = await getCacheServiceInstance();
    return ServiceFactory.cacheService;
  }
}

// Export service classes
export { MyListService, CacheService };
export * from './interfaces/IMyListService';
export * from './MyListService'; // Export error classes


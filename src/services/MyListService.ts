import { IMyListService } from './interfaces/IMyListService';
import { IMyListRepository } from '../repositories/interfaces/IMyListRepository';
import { IContentRepository } from '../repositories/interfaces/IContentRepository';
import { IUserRepository } from '../repositories/interfaces/IUserRepository';
import {
  PaginatedMyListResponse,
  AddToMyListRequest,
  RemoveFromMyListRequest,
  ListMyItemsQuery,
  MyListItemWithDetails,
} from '../types/myList.types';
import { ContentType } from '../types/common.types';
import { isMovie } from '../types/entities';
import { CacheService } from './CacheService';
import { logger } from '../config/logger';

/**
 * Custom Error Classes for MyList Service
 */
export class ContentNotFoundError extends Error {
  constructor(contentId: string, contentType: ContentType) {
    super(`Content not found: ${contentId} (${contentType})`);
    this.name = 'ContentNotFoundError';
  }
}

export class DuplicateItemError extends Error {
  constructor(contentId: string) {
    super(`Item already exists in list: ${contentId}`);
    this.name = 'DuplicateItemError';
  }
}

export class ItemNotFoundError extends Error {
  constructor(contentId: string) {
    super(`Item not found in list: ${contentId}`);
    this.name = 'ItemNotFoundError';
  }
}

export class UserNotFoundError extends Error {
  constructor(userId: string) {
    super(`User not found: ${userId}`);
    this.name = 'UserNotFoundError';
  }
}

/**
 * MyList Service Implementation
 * Contains business logic for MyList feature
 * Orchestrates repository calls and handles caching
 */
export class MyListService implements IMyListService {
  constructor(
    private myListRepository: IMyListRepository,
    private contentRepository: IContentRepository,
    private userRepository: IUserRepository,
    private cacheService: CacheService
  ) {}

  /**
   * Add content to user's MyList
   * Business logic:
   * 1. Validate user exists
   * 2. Validate content exists
   * 3. Check for duplicates
   * 4. Add item
   * 5. Invalidate cache
   */
  async addToMyList(userId: string, request: AddToMyListRequest): Promise<void> {
    try {
      // 1. Validate user exists
      const userExists = await this.userRepository.exists(userId);
      if (!userExists) {
        throw new UserNotFoundError(userId);
      }

      // 2. Validate content exists
      const contentExists = await this.contentRepository.contentExists(
        request.contentId,
        request.contentType
      );
      if (!contentExists) {
        throw new ContentNotFoundError(request.contentId, request.contentType);
      }

      // 3. Check for duplicates (business rule: no duplicates allowed)
      const itemExists = await this.myListRepository.itemExists(userId, request.contentId);
      if (itemExists) {
        throw new DuplicateItemError(request.contentId);
      }

      // 4. Add item to list
      const item = {
        contentId: request.contentId,
        contentType: request.contentType,
        addedAt: new Date(),
      };

      await this.myListRepository.addItem(userId, item);

      // 5. Invalidate cache (list has changed)
      await this.cacheService.invalidateUserList(userId);

      logger.info('Item added to MyList', {
        userId,
        contentId: request.contentId,
        contentType: request.contentType,
      });
    } catch (error) {
      // Re-throw known errors
      if (
        error instanceof ContentNotFoundError ||
        error instanceof DuplicateItemError ||
        error instanceof UserNotFoundError
      ) {
        throw error;
      }

      // Log and re-throw unknown errors
      logger.error('Error adding item to MyList', {
        userId,
        request,
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }

  /**
   * Remove content from user's MyList
   * Business logic:
   * 1. Remove item
   * 2. Invalidate cache
   */
  async removeFromMyList(userId: string, request: RemoveFromMyListRequest): Promise<void> {
    try {
      // Remove item from list
      const removed = await this.myListRepository.removeItem(userId, request.contentId);

      if (!removed) {
        throw new ItemNotFoundError(request.contentId);
      }

      // Invalidate cache (list has changed)
      await this.cacheService.invalidateUserList(userId);

      logger.info('Item removed from MyList', {
        userId,
        contentId: request.contentId,
      });
    } catch (error) {
      // Re-throw known errors
      if (error instanceof ItemNotFoundError) {
        throw error;
      }

      // Log and re-throw unknown errors
      logger.error('Error removing item from MyList', {
        userId,
        request,
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }

  /**
   * Get user's MyList with pagination
   * Performance optimized with caching:
   * 1. Check cache first
   * 2. If cache miss, fetch from database
   * 3. Fetch content details in batch
   * 4. Transform to response format
   * 5. Cache result
   */
  async getMyList(userId: string, query: ListMyItemsQuery): Promise<PaginatedMyListResponse> {
    try {
      const page = query.page || 1;
      const limit = query.limit || 10;
      const contentType = query.contentType;

      // 1. Check cache first (performance optimization)
      const cached = await this.cacheService.getCachedList(userId, page, limit, contentType);
      if (cached) {
        return cached;
      }

      // 2. Get paginated items from repository
      const result = await this.myListRepository.getItemsPaginated(userId, page, limit);

      // If no items, return empty response
      if (result.items.length === 0) {
        const emptyResponse: PaginatedMyListResponse = {
          data: [],
          pagination: result.pagination,
        };

        // Cache empty result too (to avoid repeated DB queries)
        await this.cacheService.setCachedList(userId, page, limit, emptyResponse, contentType);
        return emptyResponse;
      }

      // 3. Filter by contentType if specified
      let itemsToProcess = result.items;
      if (contentType) {
        itemsToProcess = result.items.filter((item) => item.contentType === contentType);
      }

      // 4. Fetch content details in batch (performance optimization)
      const contentDetails = await this.contentRepository.findContentsByIds(
        itemsToProcess.map((item) => ({
          contentId: item.contentId,
          contentType: item.contentType,
        }))
      );

      // 5. Transform to response format with content details
      const itemsWithDetails: MyListItemWithDetails[] = itemsToProcess
        .map((item) => {
          const content = contentDetails.find((c) => c.id === item.contentId);
          if (!content) {
            // Content might have been deleted, skip it
            logger.warn('Content not found for MyList item', {
              userId,
              contentId: item.contentId,
            });
            return null;
          }

          const baseDetails: MyListItemWithDetails = {
            contentId: item.contentId,
            contentType: item.contentType,
            title: content.title,
            description: content.description,
            genres: content.genres,
            addedAt: item.addedAt,
          };

          // Add type-specific fields
          if (isMovie(content)) {
            baseDetails.releaseDate = content.releaseDate;
            baseDetails.director = content.director;
            baseDetails.actors = content.actors;
          } else {
            // TVShow
            baseDetails.episodeCount = content.episodes.length;
          }

          return baseDetails;
        })
        .filter((item): item is MyListItemWithDetails => item !== null);

      // 6. Recalculate pagination if filtered
      let pagination = result.pagination;
      if (contentType) {
        // Recalculate total for filtered results
        const totalFiltered = itemsWithDetails.length;
        pagination = {
          ...result.pagination,
          total: totalFiltered,
          totalPages: Math.ceil(totalFiltered / limit),
          hasNextPage: page < Math.ceil(totalFiltered / limit),
          hasPreviousPage: page > 1,
        };
      }

      const response: PaginatedMyListResponse = {
        data: itemsWithDetails,
        pagination,
      };

      // 7. Cache the result
      await this.cacheService.setCachedList(userId, page, limit, response, contentType);

      logger.info('Retrieved MyList', {
        userId,
        page,
        limit,
        itemCount: itemsWithDetails.length,
        fromCache: false,
      });

      return response;
    } catch (error) {
      logger.error('Error getting MyList', {
        userId,
        query,
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }
}


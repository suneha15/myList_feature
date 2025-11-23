import { PaginatedMyListResponse, AddToMyListRequest, RemoveFromMyListRequest, ListMyItemsQuery } from '../../types/myList.types';

/**
 * MyList Service Interface
 * Defines business logic operations for MyList feature
 * Follows Dependency Inversion Principle
 */
export interface IMyListService {
  /**
   * Add content to user's MyList
   * Business rules:
   * - Validates content exists
   * - Prevents duplicates
   * - Invalidates cache
   * 
   * @param userId - User ID
   * @param request - Add to list request (contentId, contentType)
   * @throws Error if content doesn't exist or item already in list
   */
  addToMyList(userId: string, request: AddToMyListRequest): Promise<void>;

  /**
   * Remove content from user's MyList
   * Business rules:
   * - Invalidates cache
   * 
   * @param userId - User ID
   * @param request - Remove from list request (contentId)
   * @throws Error if item not found
   */
  removeFromMyList(userId: string, request: RemoveFromMyListRequest): Promise<void>;

  /**
   * Get user's MyList with pagination
   * Performance optimized:
   * - Uses caching for <10ms response time
   * - Fetches content details in batch
   * 
   * @param userId - User ID
   * @param query - Pagination and filter parameters
   * @returns Paginated list with content details
   */
  getMyList(userId: string, query: ListMyItemsQuery): Promise<PaginatedMyListResponse>;
}


import { MyList, MyListItem } from '../../types/myList.types';
import { PaginationMeta } from '../../types/common.types';

/**
 * Paginated Result for MyList queries
 */
export interface PaginatedMyListResult {
  items: MyListItem[];
  pagination: PaginationMeta;
}

/**
 * MyList Repository Interface
 * Defines operations for MyList entity data access
 * Follows Dependency Inversion Principle
 */
export interface IMyListRepository {
  /**
   * Find user's MyList by user ID
   * @param userId - User ID
   * @returns MyList or null if not found
   */
  findByUserId(userId: string): Promise<MyList | null>;

  /**
   * Create a new MyList for a user
   * @param userId - User ID
   * @returns Created MyList
   */
  create(userId: string): Promise<MyList>;

  /**
   * Add item to user's MyList
   * Uses atomic operation to prevent duplicates
   * @param userId - User ID
   * @param item - Item to add
   * @throws Error if item already exists
   */
  addItem(userId: string, item: MyListItem): Promise<void>;

  /**
   * Remove item from user's MyList
   * @param userId - User ID
   * @param contentId - Content ID to remove
   * @returns true if item was removed, false if not found
   */
  removeItem(userId: string, contentId: string): Promise<boolean>;

  /**
   * Check if item exists in user's MyList
   * @param userId - User ID
   * @param contentId - Content ID
   * @returns true if item exists, false otherwise
   */
  itemExists(userId: string, contentId: string): Promise<boolean>;

  /**
   * Get paginated list of items from user's MyList
   * Optimized for performance with proper indexing
   * @param userId - User ID
   * @param page - Page number (1-indexed)
   * @param limit - Items per page
   * @returns Paginated result with items and metadata
   */
  getItemsPaginated(userId: string, page: number, limit: number): Promise<PaginatedMyListResult>;

  /**
   * Get total count of items in user's MyList
   * @param userId - User ID
   * @returns Total count
   */
  getItemCount(userId: string): Promise<number>;
}


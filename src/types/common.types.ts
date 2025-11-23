/**
 * Common Types and Enums
 * Shared types used across the application
 */

/**
 * Genre type - Union of all possible genres
 * Matches the requirements specification
 */
export type Genre = 'Action' | 'Comedy' | 'Drama' | 'Fantasy' | 'Horror' | 'Romance' | 'SciFi';

/**
 * Content Type - Distinguishes between Movies and TV Shows
 */
export type ContentType = 'Movie' | 'TVShow';

/**
 * Pagination parameters
 */
export interface PaginationParams {
  page: number;
  limit: number;
}

/**
 * Paginated response metadata
 */
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

/**
 * Generic paginated response wrapper
 */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}

/**
 * Sort order for queries
 */
export type SortOrder = 'asc' | 'desc';

/**
 * Common date range filter
 */
export interface DateRange {
  startDate?: Date;
  endDate?: Date;
}


import { ContentType, PaginatedResponse, PaginationMeta } from './common.types';
import { Genre } from './common.types';

/**
 * MyList Types
 * Types specific to the MyList feature
 */

/**
 * MyList Item - Represents a single item in a user's list
 */
export interface MyListItem {
  contentId: string;
  contentType: ContentType;
  addedAt: Date;
}

/**
 * MyList Entity - Represents a user's complete list
 */
export interface MyList {
  userId: string;
  items: MyListItem[];
  updatedAt: Date;
  createdAt: Date;
}

/**
 * MyList Item with Content Details
 * Used when returning list items with full content information
 */
export interface MyListItemWithDetails {
  contentId: string;
  contentType: ContentType;
  title: string;
  description: string;
  genres: Genre[];
  addedAt: Date;
  // Additional fields based on content type
  releaseDate?: Date; // For movies
  director?: string; // For movies
  actors?: string[]; // For movies
  episodeCount?: number; // For TV shows
}

/**
 * Paginated MyList Response
 */
export interface PaginatedMyListResponse extends PaginatedResponse<MyListItemWithDetails> {
  pagination: PaginationMeta;
}

/**
 * MyList Statistics
 */
export interface MyListStats {
  totalItems: number;
  movieCount: number;
  tvShowCount: number;
  lastUpdated: Date;
}

/**
 * Add to MyList Request
 */
export interface AddToMyListRequest {
  contentId: string;
  contentType: ContentType;
}

/**
 * Remove from MyList Request
 */
export interface RemoveFromMyListRequest {
  contentId: string;
}

/**
 * List My Items Query Parameters
 */
export interface ListMyItemsQuery {
  page?: number;
  limit?: number;
  contentType?: ContentType; // Optional filter by content type
}


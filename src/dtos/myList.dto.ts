/**
 * Data Transfer Objects (DTOs) for MyList API
 * Define request and response structures for API endpoints
 */

import { ContentType } from '../types/common.types';
import { PaginatedMyListResponse, MyListItemWithDetails } from '../types/myList.types';

/**
 * Add to MyList Request DTO
 * Request body for POST /api/v1/my-list/items
 */
export interface AddToMyListRequestDto {
  contentId: string;
  contentType: ContentType;
}

/**
 * Remove from MyList Request DTO
 * Path parameter for DELETE /api/v1/my-list/items/:contentId
 */
export interface RemoveFromMyListRequestDto {
  contentId: string;
}

/**
 * List My Items Query DTO
 * Query parameters for GET /api/v1/my-list/items
 */
export interface ListMyItemsQueryDto {
  page?: number;
  limit?: number;
  contentType?: ContentType;
}

/**
 * MyList Item Response DTO
 * Single item in the list response
 */
export interface MyListItemResponseDto {
  contentId: string;
  contentType: ContentType;
  title: string;
  description: string;
  genres: string[];
  addedAt: string; // ISO 8601 date string
  // Movie-specific fields
  releaseDate?: string;
  director?: string;
  actors?: string[];
  // TVShow-specific fields
  episodeCount?: number;
}

/**
 * Pagination Metadata DTO
 */
export interface PaginationMetaDto {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

/**
 * Paginated MyList Response DTO
 * Response for GET /api/v1/my-list/items
 */
export interface PaginatedMyListResponseDto {
  data: MyListItemResponseDto[];
  pagination: PaginationMetaDto;
}

/**
 * Error Response DTO
 * Standard error response format
 */
export interface ErrorResponseDto {
  error: {
    code: string;
    message: string;
    details?: any;
    traceId?: string;
  };
}

/**
 * Success Response DTO (for add/remove operations)
 */
export interface SuccessResponseDto {
  success: boolean;
  message: string;
  data?: any;
}

/**
 * Transform domain model to DTO
 */
export function toMyListItemResponseDto(item: MyListItemWithDetails): MyListItemResponseDto {
  return {
    contentId: item.contentId,
    contentType: item.contentType,
    title: item.title,
    description: item.description,
    genres: item.genres,
    addedAt: item.addedAt.toISOString(),
    releaseDate: item.releaseDate?.toISOString(),
    director: item.director,
    actors: item.actors,
    episodeCount: item.episodeCount,
  };
}

/**
 * Transform paginated response to DTO
 */
export function toPaginatedMyListResponseDto(
  response: PaginatedMyListResponse
): PaginatedMyListResponseDto {
  return {
    data: response.data.map(toMyListItemResponseDto),
    pagination: {
      page: response.pagination.page,
      limit: response.pagination.limit,
      total: response.pagination.total,
      totalPages: response.pagination.totalPages,
      hasNextPage: response.pagination.hasNextPage,
      hasPreviousPage: response.pagination.hasPreviousPage,
    },
  };
}


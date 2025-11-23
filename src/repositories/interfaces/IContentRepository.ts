import { Movie, TVShow, Content } from '../../types/entities';
import { ContentType } from '../../types/common.types';

/**
 * Content Repository Interface
 * Unified interface for Movie and TVShow operations
 * Follows Dependency Inversion Principle
 */
export interface IContentRepository {
  /**
   * Find movie by ID
   * @param movieId - Movie ID
   * @returns Movie or null if not found
   */
  findMovieById(movieId: string): Promise<Movie | null>;

  /**
   * Find TV show by ID
   * @param tvShowId - TV Show ID
   * @returns TVShow or null if not found
   */
  findTVShowById(tvShowId: string): Promise<TVShow | null>;

  /**
   * Find content by ID and type
   * Generic method that works for both Movies and TV Shows
   * @param contentId - Content ID
   * @param contentType - Content type ('Movie' or 'TVShow')
   * @returns Content (Movie or TVShow) or null if not found
   */
  findContentById(contentId: string, contentType: ContentType): Promise<Content | null>;

  /**
   * Check if content exists
   * @param contentId - Content ID
   * @param contentType - Content type
   * @returns true if content exists, false otherwise
   */
  contentExists(contentId: string, contentType: ContentType): Promise<boolean>;

  /**
   * Find multiple content items by IDs
   * Useful for batch fetching content details for MyList items
   * @param contentIds - Array of content IDs with their types
   * @returns Array of Content items
   */
  findContentsByIds(
    contentIds: Array<{ contentId: string; contentType: ContentType }>
  ): Promise<Content[]>;
}


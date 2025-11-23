import { IContentRepository } from '../interfaces/IContentRepository';
import { Content, Movie, TVShow } from '../../types/entities';
import { ContentType } from '../../types/common.types';
import { MovieModel } from '../../models/Movie.model';
import { TVShowModel } from '../../models/TVShow.model';
import { logger } from '../../config/logger';

/**
 * Content Repository Implementation
 * Concrete implementation of IContentRepository
 * Handles all Movie and TVShow database operations
 */
export class ContentRepository implements IContentRepository {
  /**
   * Find movie by ID
   */
  async findMovieById(movieId: string): Promise<Movie | null> {
    try {
      const movieDoc = await MovieModel.findOne({ id: movieId }).lean();
      
      if (!movieDoc) {
        return null;
      }

      return this.movieToDomainModel(movieDoc);
    } catch (error) {
      logger.error('Error finding movie by ID', { movieId, error });
      throw error;
    }
  }

  /**
   * Find TV show by ID
   */
  async findTVShowById(tvShowId: string): Promise<TVShow | null> {
    try {
      const tvShowDoc = await TVShowModel.findOne({ id: tvShowId }).lean();
      
      if (!tvShowDoc) {
        return null;
      }

      return this.tvShowToDomainModel(tvShowDoc);
    } catch (error) {
      logger.error('Error finding TV show by ID', { tvShowId, error });
      throw error;
    }
  }

  /**
   * Find content by ID and type
   * Generic method that works for both Movies and TV Shows
   */
  async findContentById(contentId: string, contentType: ContentType): Promise<Content | null> {
    try {
      if (contentType === 'Movie') {
        return await this.findMovieById(contentId);
      } else {
        return await this.findTVShowById(contentId);
      }
    } catch (error) {
      logger.error('Error finding content by ID', { contentId, contentType, error });
      throw error;
    }
  }

  /**
   * Check if content exists
   */
  async contentExists(contentId: string, contentType: ContentType): Promise<boolean> {
    try {
      if (contentType === 'Movie') {
        const count = await MovieModel.countDocuments({ id: contentId });
        return count > 0;
      } else {
        const count = await TVShowModel.countDocuments({ id: contentId });
        return count > 0;
      }
    } catch (error) {
      logger.error('Error checking content existence', { contentId, contentType, error });
      throw error;
    }
  }

  /**
   * Find multiple content items by IDs
   * Batch operation for better performance
   */
  async findContentsByIds(
    contentIds: Array<{ contentId: string; contentType: ContentType }>
  ): Promise<Content[]> {
    try {
      // Separate movies and TV shows for batch queries
      const movieIds = contentIds
        .filter((item) => item.contentType === 'Movie')
        .map((item) => item.contentId);
      
      const tvShowIds = contentIds
        .filter((item) => item.contentType === 'TVShow')
        .map((item) => item.contentId);

      // Execute queries in parallel
      const [movieDocs, tvShowDocs] = await Promise.all([
        movieIds.length > 0 ? MovieModel.find({ id: { $in: movieIds } }).lean() : [],
        tvShowIds.length > 0 ? TVShowModel.find({ id: { $in: tvShowIds } }).lean() : [],
      ]);

      // Transform to domain models
      const movies = movieDocs.map((doc) => this.movieToDomainModel(doc));
      const tvShows = tvShowDocs.map((doc) => this.tvShowToDomainModel(doc));

      // Combine and maintain order based on input
      const contentMap = new Map<string, Content>();
      movies.forEach((movie) => contentMap.set(movie.id, movie));
      tvShows.forEach((tvShow) => contentMap.set(tvShow.id, tvShow));

      // Return in the order requested
      return contentIds
        .map((item) => contentMap.get(item.contentId))
        .filter((content): content is Content => content !== undefined);
    } catch (error) {
      logger.error('Error finding contents by IDs', { contentIds, error });
      throw error;
    }
  }

  /**
   * Transform MongoDB movie document to domain model
   */
  private movieToDomainModel(doc: any): Movie {
    return {
      id: doc.id,
      title: doc.title,
      description: doc.description,
      genres: doc.genres,
      releaseDate: new Date(doc.releaseDate),
      director: doc.director,
      actors: doc.actors,
    };
  }

  /**
   * Transform MongoDB TV show document to domain model
   */
  private tvShowToDomainModel(doc: any): TVShow {
    return {
      id: doc.id,
      title: doc.title,
      description: doc.description,
      genres: doc.genres,
      episodes: doc.episodes.map((ep: any) => ({
        episodeNumber: ep.episodeNumber,
        seasonNumber: ep.seasonNumber,
        releaseDate: new Date(ep.releaseDate),
        director: ep.director,
        actors: ep.actors,
      })),
    };
  }
}


import { Genre } from './common.types';

/**
 * Core Entity Interfaces
 * These match the requirements specification exactly
 * DO NOT MODIFY - These interfaces are defined as per the problem statement
 */

/**
 * User Entity - EXACTLY as per requirements
 * Represents a user in the OTT platform
 */
export interface User {
  id: string;
  username: string;
  preferences: {
    favoriteGenres: Genre[];
    dislikedGenres: Genre[];
  };
  watchHistory: Array<{
    contentId: string;
    watchedOn: Date;
    rating?: number;
  }>;
}

/**
 * Movie Entity
 * Represents a movie in the OTT platform
 */
export interface Movie {
  id: string;
  title: string;
  description: string;
  genres: Genre[];
  releaseDate: Date;
  director: string;
  actors: string[];
}

/**
 * TV Show Entity - EXACTLY as per requirements
 * Represents a TV show in the OTT platform
 */
export interface TVShow {
  id: string;
  title: string;
  description: string;
  genres: Genre[];
  episodes: Array<{
    episodeNumber: number;
    seasonNumber: number;
    releaseDate: Date;
    director: string;
    actors: string[];
  }>;
}


/**
 * User Preferences - Helper type extracted from User.preferences
 * Useful for type checking when working with preferences separately
 */
export interface UserPreferences {
  favoriteGenres: Genre[];
  dislikedGenres: Genre[];
}

/**
 * Watch History Entry - Helper type extracted from User.watchHistory
 * Useful for type checking when working with watch history entries separately
 */
export interface WatchHistoryEntry {
  contentId: string;
  watchedOn: Date;
  rating?: number;
}

/**
 * TV Show Episode - Helper type extracted from TVShow.episodes
 * Useful for type checking when working with episodes separately
 */
export interface TVShowEpisode {
  episodeNumber: number;
  seasonNumber: number;
  releaseDate: Date;
  director: string;
  actors: string[];
}

/**
 * Union type for all content types
 */
export type Content = Movie | TVShow;

/**
 * Type guard to check if content is a Movie
 */
export function isMovie(content: Content): content is Movie {
  return 'director' in content && !('episodes' in content);
}

/**
 * Type guard to check if content is a TVShow
 */
export function isTVShow(content: Content): content is TVShow {
  return 'episodes' in content;
}


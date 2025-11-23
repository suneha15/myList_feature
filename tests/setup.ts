import { database } from '../src/config/database';
import { UserModel } from '../src/models/User.model';
import { MovieModel } from '../src/models/Movie.model';
import { TVShowModel } from '../src/models/TVShow.model';
import { MyListModel } from '../src/models/MyList.model';
import { Genre, ContentType } from '../src/types/common.types';

/**
 * Test Setup and Teardown
 * Handles database connection and cleanup for tests
 */

/**
 * Setup test database
 * Connects to test database and clears collections
 */
export async function setupTestDatabase(): Promise<void> {
  try {
    // Connect to test database
    await database.connect();

    // Clear all collections
    await UserModel.deleteMany({});
    await MovieModel.deleteMany({});
    await TVShowModel.deleteMany({});
    await MyListModel.deleteMany({});
  } catch (error) {
    console.error('Error setting up test database:', error);
    throw error;
  }
}

/**
 * Teardown test database
 * Cleans up and disconnects
 */
export async function teardownTestDatabase(): Promise<void> {
  try {
    // Clear all collections
    await UserModel.deleteMany({});
    await MovieModel.deleteMany({});
    await TVShowModel.deleteMany({});
    await MyListModel.deleteMany({});

    // Disconnect from database
    await database.disconnect();
  } catch (error) {
    console.error('Error tearing down test database:', error);
    throw error;
  }
}

/**
 * Seed test data
 * Creates users, movies, TV shows, and MyLists for testing
 */
export async function seedTestData(): Promise<void> {
  // Seed Users
  await UserModel.insertMany([
    {
      id: 'test-user-1',
      username: 'test_user_1',
      preferences: {
        favoriteGenres: ['Action', 'SciFi'] as Genre[],
        dislikedGenres: ['Horror'] as Genre[],
      },
      watchHistory: [],
    },
    {
      id: 'test-user-2',
      username: 'test_user_2',
      preferences: {
        favoriteGenres: ['Comedy', 'Romance'] as Genre[],
        dislikedGenres: [] as Genre[],
      },
      watchHistory: [],
    },
  ]);

  // Seed Movies
  await MovieModel.insertMany([
    {
      id: 'test-movie-1',
      title: 'Test Movie 1',
      description: 'Test movie description 1',
      genres: ['Action', 'SciFi'] as Genre[],
      releaseDate: new Date('2020-01-01'),
      director: 'Test Director 1',
      actors: ['Actor 1', 'Actor 2'],
    },
    {
      id: 'test-movie-2',
      title: 'Test Movie 2',
      description: 'Test movie description 2',
      genres: ['Comedy'] as Genre[],
      releaseDate: new Date('2021-01-01'),
      director: 'Test Director 2',
      actors: ['Actor 3', 'Actor 4'],
    },
    {
      id: 'test-movie-3',
      title: 'Test Movie 3',
      description: 'Test movie description 3',
      genres: ['Drama'] as Genre[],
      releaseDate: new Date('2022-01-01'),
      director: 'Test Director 3',
      actors: ['Actor 5'],
    },
  ]);

  // Seed TV Shows
  await TVShowModel.insertMany([
    {
      id: 'test-tvshow-1',
      title: 'Test TV Show 1',
      description: 'Test TV show description 1',
      genres: ['Drama', 'Action'] as Genre[],
      episodes: [
        {
          episodeNumber: 1,
          seasonNumber: 1,
          releaseDate: new Date('2020-01-01'),
          director: 'TV Director 1',
          actors: ['TV Actor 1'],
        },
      ],
    },
    {
      id: 'test-tvshow-2',
      title: 'Test TV Show 2',
      description: 'Test TV show description 2',
      genres: ['Comedy'] as Genre[],
      episodes: [
        {
          episodeNumber: 1,
          seasonNumber: 1,
          releaseDate: new Date('2021-01-01'),
          director: 'TV Director 2',
          actors: ['TV Actor 2'],
        },
      ],
    },
  ]);

  // Seed MyLists
  await MyListModel.insertMany([
    {
      userId: 'test-user-1',
      items: [
        {
          contentId: 'test-movie-1',
          contentType: 'Movie' as ContentType,
          addedAt: new Date('2024-01-01'),
        },
        {
          contentId: 'test-tvshow-1',
          contentType: 'TVShow' as ContentType,
          addedAt: new Date('2024-01-02'),
        },
      ],
    },
    {
      userId: 'test-user-2',
      items: [
        {
          contentId: 'test-movie-2',
          contentType: 'Movie' as ContentType,
          addedAt: new Date('2024-01-03'),
        },
      ],
    },
  ]);
}

/**
 * Clean test data
 * Removes all test data
 */
export async function cleanTestData(): Promise<void> {
  await UserModel.deleteMany({});
  await MovieModel.deleteMany({});
  await TVShowModel.deleteMany({});
  await MyListModel.deleteMany({});
}


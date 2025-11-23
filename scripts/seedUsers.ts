import mongoose from 'mongoose';
import { database } from '../src/config/database';
import { UserModel } from '../src/models/User.model';
import { Genre } from '../src/types/common.types';

/**
 * Seed Users Script
 * Creates initial user data for testing
 */
async function seedUsers() {
  try {
    // Connect to database
    await database.connect();
    console.log('Connected to database');

    // Clear existing users (optional - comment out if you want to keep existing data)
    await UserModel.deleteMany({});
    console.log('Cleared existing users');

    // Sample users data
    const users = [
      {
        id: 'user-1',
        username: 'john_doe',
        preferences: {
          favoriteGenres: ['Action', 'SciFi'] as Genre[],
          dislikedGenres: ['Horror'] as Genre[],
        },
        watchHistory: [
          {
            contentId: 'movie-1',
            watchedOn: new Date('2024-01-15'),
            rating: 8,
          },
          {
            contentId: 'tvshow-1',
            watchedOn: new Date('2024-01-20'),
            rating: 9,
          },
        ],
      },
      {
        id: 'user-2',
        username: 'jane_smith',
        preferences: {
          favoriteGenres: ['Comedy', 'Romance', 'Drama'] as Genre[],
          dislikedGenres: ['Horror', 'SciFi'] as Genre[],
        },
        watchHistory: [
          {
            contentId: 'movie-2',
            watchedOn: new Date('2024-02-01'),
            rating: 7,
          },
        ],
      },
      {
        id: 'user-3',
        username: 'movie_lover',
        preferences: {
          favoriteGenres: ['Action', 'Fantasy', 'Drama'] as Genre[],
          dislikedGenres: [] as Genre[],
        },
        watchHistory: [],
      },
      {
        id: 'user-4',
        username: 'tv_enthusiast',
        preferences: {
          favoriteGenres: ['Drama', 'Comedy'] as Genre[],
          dislikedGenres: ['Horror'] as Genre[],
        },
        watchHistory: [
          {
            contentId: 'tvshow-2',
            watchedOn: new Date('2024-01-10'),
            rating: 10,
          },
        ],
      },
      {
        id: 'user-5',
        username: 'test_user',
        preferences: {
          favoriteGenres: ['Action', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Romance', 'SciFi'] as Genre[],
          dislikedGenres: [] as Genre[],
        },
        watchHistory: [],
      },
    ];

    // Insert users
    const insertedUsers = await UserModel.insertMany(users);
    console.log(`✅ Successfully seeded ${insertedUsers.length} users`);

    // Display created users
    insertedUsers.forEach((user) => {
      console.log(`  - ${user.username} (ID: ${user.id})`);
    });

    // Disconnect
    await database.disconnect();
    console.log('Disconnected from database');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding users:', error);
    await database.disconnect();
    process.exit(1);
  }
}

// Run the seed function
seedUsers();


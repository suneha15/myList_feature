import mongoose from 'mongoose';
import { database } from '../src/config/database';
import { MyListModel } from '../src/models/MyList.model';
import { ContentType } from '../src/types/common.types';

/**
 * Seed My Lists Script
 * Creates initial MyList data for testing
 * Note: This assumes users and content (movies/TV shows) already exist
 */
async function seedMyLists() {
  try {
    // Connect to database
    await database.connect();
    console.log('Connected to database');

    // Clear existing lists (optional - comment out if you want to keep existing data)
    await MyListModel.deleteMany({});
    console.log('Cleared existing MyLists');

    // Sample MyList data
    const myLists = [
      {
        userId: 'user-1',
        items: [
          {
            contentId: 'movie-1',
            contentType: 'Movie' as ContentType,
            addedAt: new Date('2024-01-10'),
          },
          {
            contentId: 'movie-3',
            contentType: 'Movie' as ContentType,
            addedAt: new Date('2024-01-12'),
          },
          {
            contentId: 'tvshow-1',
            contentType: 'TVShow' as ContentType,
            addedAt: new Date('2024-01-15'),
          },
          {
            contentId: 'movie-6',
            contentType: 'Movie' as ContentType,
            addedAt: new Date('2024-01-20'),
          },
        ],
      },
      {
        userId: 'user-2',
        items: [
          {
            contentId: 'movie-4',
            contentType: 'Movie' as ContentType,
            addedAt: new Date('2024-02-01'),
          },
          {
            contentId: 'movie-8',
            contentType: 'Movie' as ContentType,
            addedAt: new Date('2024-02-05'),
          },
          {
            contentId: 'tvshow-4',
            contentType: 'TVShow' as ContentType,
            addedAt: new Date('2024-02-10'),
          },
          {
            contentId: 'tvshow-5',
            contentType: 'TVShow' as ContentType,
            addedAt: new Date('2024-02-12'),
          },
        ],
      },
      {
        userId: 'user-3',
        items: [
          {
            contentId: 'movie-2',
            contentType: 'Movie' as ContentType,
            addedAt: new Date('2024-01-05'),
          },
          {
            contentId: 'movie-7',
            contentType: 'Movie' as ContentType,
            addedAt: new Date('2024-01-08'),
          },
          {
            contentId: 'tvshow-2',
            contentType: 'TVShow' as ContentType,
            addedAt: new Date('2024-01-15'),
          },
          {
            contentId: 'tvshow-7',
            contentType: 'TVShow' as ContentType,
            addedAt: new Date('2024-01-18'),
          },
          {
            contentId: 'tvshow-8',
            contentType: 'TVShow' as ContentType,
            addedAt: new Date('2024-01-22'),
          },
        ],
      },
      {
        userId: 'user-4',
        items: [
          {
            contentId: 'tvshow-2',
            contentType: 'TVShow' as ContentType,
            addedAt: new Date('2024-01-01'),
          },
          {
            contentId: 'tvshow-6',
            contentType: 'TVShow' as ContentType,
            addedAt: new Date('2024-01-05'),
          },
        ],
      },
      {
        userId: 'user-5',
        items: [], // Empty list for testing
      },
    ];

    // Insert MyLists
    const insertedLists = await MyListModel.insertMany(myLists);
    console.log(`✅ Successfully seeded ${insertedLists.length} MyLists`);

    // Display created lists
    insertedLists.forEach((list) => {
      console.log(`  - User ${list.userId}: ${list.items.length} items`);
      list.items.forEach((item) => {
        console.log(`    - ${item.contentType}: ${item.contentId}`);
      });
    });

    // Disconnect
    await database.disconnect();
    console.log('Disconnected from database');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding MyLists:', error);
    await database.disconnect();
    process.exit(1);
  }
}

// Run the seed function
seedMyLists();


"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../src/config/database");
const User_model_1 = require("../src/models/User.model");
/**
 * Seed Users Script
 * Creates initial user data for testing
 */
async function seedUsers() {
    try {
        // Connect to database
        await database_1.database.connect();
        console.log('Connected to database');
        // Clear existing users (optional - comment out if you want to keep existing data)
        await User_model_1.UserModel.deleteMany({});
        console.log('Cleared existing users');
        // Sample users data
        const users = [
            {
                id: 'user-1',
                username: 'john_doe',
                preferences: {
                    favoriteGenres: ['Action', 'SciFi'],
                    dislikedGenres: ['Horror'],
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
                    favoriteGenres: ['Comedy', 'Romance', 'Drama'],
                    dislikedGenres: ['Horror', 'SciFi'],
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
                    favoriteGenres: ['Action', 'Fantasy', 'Drama'],
                    dislikedGenres: [],
                },
                watchHistory: [],
            },
            {
                id: 'user-4',
                username: 'tv_enthusiast',
                preferences: {
                    favoriteGenres: ['Drama', 'Comedy'],
                    dislikedGenres: ['Horror'],
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
                    favoriteGenres: ['Action', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Romance', 'SciFi'],
                    dislikedGenres: [],
                },
                watchHistory: [],
            },
        ];
        // Insert users
        const insertedUsers = await User_model_1.UserModel.insertMany(users);
        console.log(`✅ Successfully seeded ${insertedUsers.length} users`);
        // Display created users
        insertedUsers.forEach((user) => {
            console.log(`  - ${user.username} (ID: ${user.id})`);
        });
        // Disconnect
        await database_1.database.disconnect();
        console.log('Disconnected from database');
        process.exit(0);
    }
    catch (error) {
        console.error('❌ Error seeding users:', error);
        await database_1.database.disconnect();
        process.exit(1);
    }
}
// Run the seed function
seedUsers();
//# sourceMappingURL=seedUsers.js.map
"use strict";
/**
 * Seed All Script
 * Runs all seed scripts in the correct order
 *
 * Usage: npm run seed
 *
 * This script seeds:
 * 1. Users (5 users)
 * 2. Movies (10 movies)
 * 3. TV Shows (8 TV shows)
 * 4. MyLists (5 lists with various items)
 */
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../src/config/database");
const User_model_1 = require("../src/models/User.model");
const Movie_model_1 = require("../src/models/Movie.model");
const TVShow_model_1 = require("../src/models/TVShow.model");
const MyList_model_1 = require("../src/models/MyList.model");
async function seedAll() {
    try {
        console.log('🌱 Starting seed process...\n');
        // Connect to database
        await database_1.database.connect();
        console.log('✅ Connected to database\n');
        // Clear all collections
        console.log('🗑️  Clearing existing data...');
        await User_model_1.UserModel.deleteMany({});
        await Movie_model_1.MovieModel.deleteMany({});
        await TVShow_model_1.TVShowModel.deleteMany({});
        await MyList_model_1.MyListModel.deleteMany({});
        console.log('✅ Cleared all collections\n');
        // ========== SEED USERS ==========
        console.log('📝 Seeding Users...');
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
        const insertedUsers = await User_model_1.UserModel.insertMany(users);
        console.log(`✅ Seeded ${insertedUsers.length} users\n`);
        // ========== SEED MOVIES ==========
        console.log('📝 Seeding Movies...');
        const movies = [
            {
                id: 'movie-1',
                title: 'The Matrix',
                description: 'A computer hacker learns about the true nature of reality and his role in the war against its controllers.',
                genres: ['Action', 'SciFi'],
                releaseDate: new Date('1999-03-31'),
                director: 'Lana Wachowski, Lilly Wachowski',
                actors: ['Keanu Reeves', 'Laurence Fishburne', 'Carrie-Anne Moss'],
            },
            {
                id: 'movie-2',
                title: 'Inception',
                description: 'A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
                genres: ['Action', 'SciFi', 'Drama'],
                releaseDate: new Date('2010-07-16'),
                director: 'Christopher Nolan',
                actors: ['Leonardo DiCaprio', 'Marion Cotillard', 'Tom Hardy'],
            },
            {
                id: 'movie-3',
                title: 'The Dark Knight',
                description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
                genres: ['Action', 'Drama'],
                releaseDate: new Date('2008-07-18'),
                director: 'Christopher Nolan',
                actors: ['Christian Bale', 'Heath Ledger', 'Aaron Eckhart'],
            },
            {
                id: 'movie-4',
                title: 'Pulp Fiction',
                description: 'The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.',
                genres: ['Drama', 'Comedy'],
                releaseDate: new Date('1994-10-14'),
                director: 'Quentin Tarantino',
                actors: ['John Travolta', 'Uma Thurman', 'Samuel L. Jackson'],
            },
            {
                id: 'movie-5',
                title: 'The Shawshank Redemption',
                description: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
                genres: ['Drama'],
                releaseDate: new Date('1994-09-23'),
                director: 'Frank Darabont',
                actors: ['Tim Robbins', 'Morgan Freeman', 'Bob Gunton'],
            },
            {
                id: 'movie-6',
                title: 'Interstellar',
                description: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.',
                genres: ['SciFi', 'Drama'],
                releaseDate: new Date('2014-11-07'),
                director: 'Christopher Nolan',
                actors: ['Matthew McConaughey', 'Anne Hathaway', 'Jessica Chastain'],
            },
            {
                id: 'movie-7',
                title: 'The Lord of the Rings: The Fellowship of the Ring',
                description: 'A meek Hobbit from the Shire and eight companions set out on a journey to destroy the powerful One Ring and save Middle-earth from the Dark Lord Sauron.',
                genres: ['Fantasy', 'Action', 'Drama'],
                releaseDate: new Date('2001-12-19'),
                director: 'Peter Jackson',
                actors: ['Elijah Wood', 'Ian McKellen', 'Orlando Bloom'],
            },
            {
                id: 'movie-8',
                title: 'The Notebook',
                description: 'A poor yet passionate young man falls in love with a rich young woman, giving her a sense of freedom, but they are soon separated because of their social differences.',
                genres: ['Romance', 'Drama'],
                releaseDate: new Date('2004-06-25'),
                director: 'Nick Cassavetes',
                actors: ['Ryan Gosling', 'Rachel McAdams', 'James Garner'],
            },
            {
                id: 'movie-9',
                title: 'Get Out',
                description: 'A young African-American visits his white girlfriend\'s parents for the weekend, where his uneasiness about their reception of him eventually reaches a boiling point.',
                genres: ['Horror', 'Drama'],
                releaseDate: new Date('2017-02-24'),
                director: 'Jordan Peele',
                actors: ['Daniel Kaluuya', 'Allison Williams', 'Bradley Whitford'],
            },
            {
                id: 'movie-10',
                title: 'The Hangover',
                description: 'Three buddies wake up from a bachelor party in Las Vegas, with no memory of the previous night and the bachelor missing. They make their way around the city in order to find their friend before his wedding.',
                genres: ['Comedy'],
                releaseDate: new Date('2009-06-05'),
                director: 'Todd Phillips',
                actors: ['Bradley Cooper', 'Ed Helms', 'Zach Galifianakis'],
            },
        ];
        const insertedMovies = await Movie_model_1.MovieModel.insertMany(movies);
        console.log(`✅ Seeded ${insertedMovies.length} movies\n`);
        // ========== SEED TV SHOWS ==========
        console.log('📝 Seeding TV Shows...');
        const tvShows = [
            {
                id: 'tvshow-1',
                title: 'Breaking Bad',
                description: 'A high school chemistry teacher turned methamphetamine manufacturer partners with a former student to secure his family\'s future.',
                genres: ['Drama', 'Action'],
                episodes: [
                    {
                        episodeNumber: 1,
                        seasonNumber: 1,
                        releaseDate: new Date('2008-01-20'),
                        director: 'Vince Gilligan',
                        actors: ['Bryan Cranston', 'Aaron Paul', 'Anna Gunn'],
                    },
                    {
                        episodeNumber: 2,
                        seasonNumber: 1,
                        releaseDate: new Date('2008-01-27'),
                        director: 'Vince Gilligan',
                        actors: ['Bryan Cranston', 'Aaron Paul', 'Anna Gunn'],
                    },
                    {
                        episodeNumber: 1,
                        seasonNumber: 2,
                        releaseDate: new Date('2009-03-08'),
                        director: 'Vince Gilligan',
                        actors: ['Bryan Cranston', 'Aaron Paul', 'Anna Gunn'],
                    },
                ],
            },
            {
                id: 'tvshow-2',
                title: 'Game of Thrones',
                description: 'Nine noble families fight for control over the lands of Westeros, while an ancient enemy returns after being dormant for millennia.',
                genres: ['Fantasy', 'Drama', 'Action'],
                episodes: [
                    {
                        episodeNumber: 1,
                        seasonNumber: 1,
                        releaseDate: new Date('2011-04-17'),
                        director: 'Tim Van Patten',
                        actors: ['Sean Bean', 'Peter Dinklage', 'Emilia Clarke'],
                    },
                    {
                        episodeNumber: 2,
                        seasonNumber: 1,
                        releaseDate: new Date('2011-04-24'),
                        director: 'Tim Van Patten',
                        actors: ['Sean Bean', 'Peter Dinklage', 'Emilia Clarke'],
                    },
                ],
            },
            {
                id: 'tvshow-3',
                title: 'Stranger Things',
                description: 'When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces and one strange little girl.',
                genres: ['SciFi', 'Horror', 'Drama'],
                episodes: [
                    {
                        episodeNumber: 1,
                        seasonNumber: 1,
                        releaseDate: new Date('2016-07-15'),
                        director: 'The Duffer Brothers',
                        actors: ['Millie Bobby Brown', 'Finn Wolfhard', 'David Harbour'],
                    },
                    {
                        episodeNumber: 2,
                        seasonNumber: 1,
                        releaseDate: new Date('2016-07-15'),
                        director: 'The Duffer Brothers',
                        actors: ['Millie Bobby Brown', 'Finn Wolfhard', 'David Harbour'],
                    },
                ],
            },
            {
                id: 'tvshow-4',
                title: 'The Office',
                description: 'A mockumentary on a group of typical office workers, where the workday consists of ego clashes, inappropriate behavior, and tedium.',
                genres: ['Comedy'],
                episodes: [
                    {
                        episodeNumber: 1,
                        seasonNumber: 1,
                        releaseDate: new Date('2005-03-24'),
                        director: 'Ken Kwapis',
                        actors: ['Steve Carell', 'John Krasinski', 'Jenna Fischer'],
                    },
                    {
                        episodeNumber: 2,
                        seasonNumber: 1,
                        releaseDate: new Date('2005-03-29'),
                        director: 'Ken Kwapis',
                        actors: ['Steve Carell', 'John Krasinski', 'Jenna Fischer'],
                    },
                ],
            },
            {
                id: 'tvshow-5',
                title: 'Friends',
                description: 'Follows the personal and professional lives of six twenty to thirty-something-year-old friends living in Manhattan.',
                genres: ['Comedy', 'Romance'],
                episodes: [
                    {
                        episodeNumber: 1,
                        seasonNumber: 1,
                        releaseDate: new Date('1994-09-22'),
                        director: 'James Burrows',
                        actors: ['Jennifer Aniston', 'Courteney Cox', 'Lisa Kudrow'],
                    },
                    {
                        episodeNumber: 2,
                        seasonNumber: 1,
                        releaseDate: new Date('1994-09-29'),
                        director: 'James Burrows',
                        actors: ['Jennifer Aniston', 'Courteney Cox', 'Lisa Kudrow'],
                    },
                ],
            },
            {
                id: 'tvshow-6',
                title: 'The Crown',
                description: 'Follows the political rivalries and romance of Queen Elizabeth II\'s reign and the events that shaped the second half of the 20th century.',
                genres: ['Drama'],
                episodes: [
                    {
                        episodeNumber: 1,
                        seasonNumber: 1,
                        releaseDate: new Date('2016-11-04'),
                        director: 'Benjamin Caron',
                        actors: ['Claire Foy', 'Matt Smith', 'Vanessa Kirby'],
                    },
                ],
            },
            {
                id: 'tvshow-7',
                title: 'The Mandalorian',
                description: 'The travels of a lone bounty hunter in the outer reaches of the galaxy, far from the authority of the New Republic.',
                genres: ['SciFi', 'Action', 'Fantasy'],
                episodes: [
                    {
                        episodeNumber: 1,
                        seasonNumber: 1,
                        releaseDate: new Date('2019-11-12'),
                        director: 'Dave Filoni',
                        actors: ['Pedro Pascal', 'Gina Carano', 'Carl Weathers'],
                    },
                ],
            },
            {
                id: 'tvshow-8',
                title: 'The Witcher',
                description: 'Geralt of Rivia, a mutated monster-hunter for hire, journeys toward his destiny in a turbulent world where people often prove more wicked than beasts.',
                genres: ['Fantasy', 'Action', 'Drama'],
                episodes: [
                    {
                        episodeNumber: 1,
                        seasonNumber: 1,
                        releaseDate: new Date('2019-12-20'),
                        director: 'Alik Sakharov',
                        actors: ['Henry Cavill', 'Anya Chalotra', 'Freya Allan'],
                    },
                ],
            },
        ];
        const insertedTVShows = await TVShow_model_1.TVShowModel.insertMany(tvShows);
        console.log(`✅ Seeded ${insertedTVShows.length} TV shows\n`);
        // ========== SEED MY LISTS ==========
        console.log('📝 Seeding MyLists...');
        const myLists = [
            {
                userId: 'user-1',
                items: [
                    {
                        contentId: 'movie-1',
                        contentType: 'Movie',
                        addedAt: new Date('2024-01-10'),
                    },
                    {
                        contentId: 'movie-3',
                        contentType: 'Movie',
                        addedAt: new Date('2024-01-12'),
                    },
                    {
                        contentId: 'tvshow-1',
                        contentType: 'TVShow',
                        addedAt: new Date('2024-01-15'),
                    },
                    {
                        contentId: 'movie-6',
                        contentType: 'Movie',
                        addedAt: new Date('2024-01-20'),
                    },
                ],
            },
            {
                userId: 'user-2',
                items: [
                    {
                        contentId: 'movie-4',
                        contentType: 'Movie',
                        addedAt: new Date('2024-02-01'),
                    },
                    {
                        contentId: 'movie-8',
                        contentType: 'Movie',
                        addedAt: new Date('2024-02-05'),
                    },
                    {
                        contentId: 'tvshow-4',
                        contentType: 'TVShow',
                        addedAt: new Date('2024-02-10'),
                    },
                    {
                        contentId: 'tvshow-5',
                        contentType: 'TVShow',
                        addedAt: new Date('2024-02-12'),
                    },
                ],
            },
            {
                userId: 'user-3',
                items: [
                    {
                        contentId: 'movie-2',
                        contentType: 'Movie',
                        addedAt: new Date('2024-01-05'),
                    },
                    {
                        contentId: 'movie-7',
                        contentType: 'Movie',
                        addedAt: new Date('2024-01-08'),
                    },
                    {
                        contentId: 'tvshow-2',
                        contentType: 'TVShow',
                        addedAt: new Date('2024-01-15'),
                    },
                    {
                        contentId: 'tvshow-7',
                        contentType: 'TVShow',
                        addedAt: new Date('2024-01-18'),
                    },
                    {
                        contentId: 'tvshow-8',
                        contentType: 'TVShow',
                        addedAt: new Date('2024-01-22'),
                    },
                ],
            },
            {
                userId: 'user-4',
                items: [
                    {
                        contentId: 'tvshow-2',
                        contentType: 'TVShow',
                        addedAt: new Date('2024-01-01'),
                    },
                    {
                        contentId: 'tvshow-6',
                        contentType: 'TVShow',
                        addedAt: new Date('2024-01-05'),
                    },
                ],
            },
            {
                userId: 'user-5',
                items: [], // Empty list for testing
            },
        ];
        const insertedLists = await MyList_model_1.MyListModel.insertMany(myLists);
        console.log(`✅ Seeded ${insertedLists.length} MyLists\n`);
        // Summary
        console.log('📊 Seed Summary:');
        console.log(`   - Users: ${insertedUsers.length}`);
        console.log(`   - Movies: ${insertedMovies.length}`);
        console.log(`   - TV Shows: ${insertedTVShows.length}`);
        console.log(`   - MyLists: ${insertedLists.length}`);
        console.log('\n✅ All seeds completed successfully!');
        // Disconnect
        await database_1.database.disconnect();
        console.log('Disconnected from database');
        process.exit(0);
    }
    catch (error) {
        console.error('❌ Error seeding data:', error);
        await database_1.database.disconnect().catch(() => { });
        process.exit(1);
    }
}
// Run the seed function
seedAll();
//# sourceMappingURL=seedAll.js.map
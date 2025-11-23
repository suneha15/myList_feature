import mongoose from 'mongoose';
import { database } from '../src/config/database';
import { MovieModel } from '../src/models/Movie.model';
import { Genre } from '../src/types/common.types';

/**
 * Seed Movies Script
 * Creates initial movie data for testing
 */
async function seedMovies() {
  try {
    // Connect to database
    await database.connect();
    console.log('Connected to database');

    // Clear existing movies (optional - comment out if you want to keep existing data)
    await MovieModel.deleteMany({});
    console.log('Cleared existing movies');

    // Sample movies data
    const movies = [
      {
        id: 'movie-1',
        title: 'The Matrix',
        description: 'A computer hacker learns about the true nature of reality and his role in the war against its controllers.',
        genres: ['Action', 'SciFi'] as Genre[],
        releaseDate: new Date('1999-03-31'),
        director: 'Lana Wachowski, Lilly Wachowski',
        actors: ['Keanu Reeves', 'Laurence Fishburne', 'Carrie-Anne Moss'],
      },
      {
        id: 'movie-2',
        title: 'Inception',
        description: 'A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
        genres: ['Action', 'SciFi', 'Drama'] as Genre[],
        releaseDate: new Date('2010-07-16'),
        director: 'Christopher Nolan',
        actors: ['Leonardo DiCaprio', 'Marion Cotillard', 'Tom Hardy'],
      },
      {
        id: 'movie-3',
        title: 'The Dark Knight',
        description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
        genres: ['Action', 'Drama'] as Genre[],
        releaseDate: new Date('2008-07-18'),
        director: 'Christopher Nolan',
        actors: ['Christian Bale', 'Heath Ledger', 'Aaron Eckhart'],
      },
      {
        id: 'movie-4',
        title: 'Pulp Fiction',
        description: 'The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.',
        genres: ['Drama', 'Comedy'] as Genre[],
        releaseDate: new Date('1994-10-14'),
        director: 'Quentin Tarantino',
        actors: ['John Travolta', 'Uma Thurman', 'Samuel L. Jackson'],
      },
      {
        id: 'movie-5',
        title: 'The Shawshank Redemption',
        description: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
        genres: ['Drama'] as Genre[],
        releaseDate: new Date('1994-09-23'),
        director: 'Frank Darabont',
        actors: ['Tim Robbins', 'Morgan Freeman', 'Bob Gunton'],
      },
      {
        id: 'movie-6',
        title: 'Interstellar',
        description: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.',
        genres: ['SciFi', 'Drama'] as Genre[],
        releaseDate: new Date('2014-11-07'),
        director: 'Christopher Nolan',
        actors: ['Matthew McConaughey', 'Anne Hathaway', 'Jessica Chastain'],
      },
      {
        id: 'movie-7',
        title: 'The Lord of the Rings: The Fellowship of the Ring',
        description: 'A meek Hobbit from the Shire and eight companions set out on a journey to destroy the powerful One Ring and save Middle-earth from the Dark Lord Sauron.',
        genres: ['Fantasy', 'Action', 'Drama'] as Genre[],
        releaseDate: new Date('2001-12-19'),
        director: 'Peter Jackson',
        actors: ['Elijah Wood', 'Ian McKellen', 'Orlando Bloom'],
      },
      {
        id: 'movie-8',
        title: 'The Notebook',
        description: 'A poor yet passionate young man falls in love with a rich young woman, giving her a sense of freedom, but they are soon separated because of their social differences.',
        genres: ['Romance', 'Drama'] as Genre[],
        releaseDate: new Date('2004-06-25'),
        director: 'Nick Cassavetes',
        actors: ['Ryan Gosling', 'Rachel McAdams', 'James Garner'],
      },
      {
        id: 'movie-9',
        title: 'Get Out',
        description: 'A young African-American visits his white girlfriend\'s parents for the weekend, where his uneasiness about their reception of him eventually reaches a boiling point.',
        genres: ['Horror', 'Drama'] as Genre[],
        releaseDate: new Date('2017-02-24'),
        director: 'Jordan Peele',
        actors: ['Daniel Kaluuya', 'Allison Williams', 'Bradley Whitford'],
      },
      {
        id: 'movie-10',
        title: 'The Hangover',
        description: 'Three buddies wake up from a bachelor party in Las Vegas, with no memory of the previous night and the bachelor missing. They make their way around the city in order to find their friend before his wedding.',
        genres: ['Comedy'] as Genre[],
        releaseDate: new Date('2009-06-05'),
        director: 'Todd Phillips',
        actors: ['Bradley Cooper', 'Ed Helms', 'Zach Galifianakis'],
      },
    ];

    // Insert movies
    const insertedMovies = await MovieModel.insertMany(movies);
    console.log(`✅ Successfully seeded ${insertedMovies.length} movies`);

    // Display created movies
    insertedMovies.forEach((movie) => {
      console.log(`  - ${movie.title} (ID: ${movie.id})`);
    });

    // Disconnect
    await database.disconnect();
    console.log('Disconnected from database');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding movies:', error);
    await database.disconnect();
    process.exit(1);
  }
}

// Run the seed function
seedMovies();


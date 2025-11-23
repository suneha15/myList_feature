import mongoose from 'mongoose';
import { database } from '../src/config/database';
import { TVShowModel } from '../src/models/TVShow.model';
import { Genre } from '../src/types/common.types';

/**
 * Seed TV Shows Script
 * Creates initial TV show data for testing
 */
async function seedTVShows() {
  try {
    // Connect to database
    await database.connect();
    console.log('Connected to database');

    // Clear existing TV shows (optional - comment out if you want to keep existing data)
    await TVShowModel.deleteMany({});
    console.log('Cleared existing TV shows');

    // Sample TV shows data
    const tvShows = [
      {
        id: 'tvshow-1',
        title: 'Breaking Bad',
        description: 'A high school chemistry teacher turned methamphetamine manufacturer partners with a former student to secure his family\'s future.',
        genres: ['Drama', 'Action'] as Genre[],
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
        genres: ['Fantasy', 'Drama', 'Action'] as Genre[],
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
        genres: ['SciFi', 'Horror', 'Drama'] as Genre[],
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
        genres: ['Comedy'] as Genre[],
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
        genres: ['Comedy', 'Romance'] as Genre[],
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
        genres: ['Drama'] as Genre[],
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
        genres: ['SciFi', 'Action', 'Fantasy'] as Genre[],
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
        genres: ['Fantasy', 'Action', 'Drama'] as Genre[],
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

    // Insert TV shows
    const insertedTVShows = await TVShowModel.insertMany(tvShows);
    console.log(`✅ Successfully seeded ${insertedTVShows.length} TV shows`);

    // Display created TV shows
    insertedTVShows.forEach((tvShow) => {
      console.log(`  - ${tvShow.title} (ID: ${tvShow.id}) - ${tvShow.episodes.length} episodes`);
    });

    // Disconnect
    await database.disconnect();
    console.log('Disconnected from database');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding TV shows:', error);
    await database.disconnect();
    process.exit(1);
  }
}

// Run the seed function
seedTVShows();


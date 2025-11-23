import mongoose, { Schema, Document } from 'mongoose';
import { Movie } from '../types/entities';
import { Genre } from '../types/common.types';

/**
 * Movie Document Interface
 * Extends the base Movie interface with MongoDB Document properties
 */
export interface MovieDocument extends Omit<Movie, 'id'>, Document {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Movie Schema
 * Maps the Movie interface to MongoDB schema
 * Matches the requirements specification exactly
 */
const MovieSchema = new Schema<MovieDocument>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      index: true, // Index for search functionality
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    genres: {
      type: [String],
      required: true,
      enum: ['Action', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Romance', 'SciFi'] as Genre[],
    },
    releaseDate: {
      type: Date,
      required: true,
      index: true, // Index for sorting by release date
    },
    director: {
      type: String,
      required: true,
      trim: true,
    },
    actors: {
      type: [String],
      required: true,
      default: [],
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
    collection: 'movies', // Explicit collection name
  }
);

// Compound index for genre and release date queries (useful for filtering/sorting)
MovieSchema.index({ genres: 1, releaseDate: -1 });

// Text index for full-text search on title and description
MovieSchema.index({ title: 'text', description: 'text' });

export const MovieModel = mongoose.model<MovieDocument>('Movie', MovieSchema);


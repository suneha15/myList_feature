import mongoose, { Schema, Document } from 'mongoose';
import { TVShow } from '../types/entities';
import { Genre } from '../types/common.types';

/**
 * TVShow Document Interface
 * Extends the base TVShow interface with MongoDB Document properties
 */
export interface TVShowDocument extends Omit<TVShow, 'id'>, Document {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * TVShow Schema
 * Maps the TVShow interface to MongoDB schema
 * Matches the requirements specification exactly
 */
const TVShowSchema = new Schema<TVShowDocument>(
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
    episodes: [
      {
        episodeNumber: {
          type: Number,
          required: true,
          min: 1,
        },
        seasonNumber: {
          type: Number,
          required: true,
          min: 1,
        },
        releaseDate: {
          type: Date,
          required: true,
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
    ],
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
    collection: 'tvshows', // Explicit collection name
  }
);

// Compound index for genre queries
TVShowSchema.index({ genres: 1 });

// Index for episode queries within a show
TVShowSchema.index({ 'episodes.seasonNumber': 1, 'episodes.episodeNumber': 1 });

// Text index for full-text search on title and description
TVShowSchema.index({ title: 'text', description: 'text' });

export const TVShowModel = mongoose.model<TVShowDocument>('TVShow', TVShowSchema);


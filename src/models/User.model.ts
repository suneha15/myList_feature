import mongoose, { Schema, Document } from 'mongoose';
import { User } from '../types/entities';
import { Genre } from '../types/common.types';

/**
 * User Document Interface
 * Extends the base User interface with MongoDB Document properties
 */
export interface UserDocument extends Omit<User, 'id'>, Document {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * User Schema
 * Maps the User interface to MongoDB schema
 * Matches the requirements specification exactly
 */
const UserSchema = new Schema<UserDocument>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    username: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    preferences: {
      favoriteGenres: {
        type: [String],
        required: true,
        enum: ['Action', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Romance', 'SciFi'] as Genre[],
        default: [],
      },
      dislikedGenres: {
        type: [String],
        required: true,
        enum: ['Action', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Romance', 'SciFi'] as Genre[],
        default: [],
      },
    },
    watchHistory: [
      {
        contentId: {
          type: String,
          required: true,
        },
        watchedOn: {
          type: Date,
          required: true,
          default: Date.now,
        },
        rating: {
          type: Number,
          min: 0,
          max: 10,
        },
      },
    ],
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
    collection: 'users', // Explicit collection name
  }
);

// Index for faster queries on username
UserSchema.index({ username: 1 });

// Index for watch history queries
UserSchema.index({ 'watchHistory.contentId': 1 });

export const UserModel = mongoose.model<UserDocument>('User', UserSchema);


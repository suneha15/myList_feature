import mongoose, { Schema, Document } from 'mongoose';
import { MyList, MyListItem } from '../types/myList.types';
import { ContentType } from '../types/common.types';

/**
 * MyList Document Interface
 * Extends the base MyList interface with MongoDB Document properties
 */
export interface MyListDocument extends MyList, Document {
  _id: mongoose.Types.ObjectId;
}

/**
 * MyList Schema
 * Optimized for performance with strategic indexes
 * 
 * Design Decision: Separate collection instead of embedding in User
 * - Scalability: Avoids document size limits (16MB in MongoDB)
 * - Performance: Faster queries with dedicated indexes
 * - Flexibility: Easier to add features like shared lists, list metadata
 */
const MyListSchema = new Schema<MyListDocument>(
  {
    userId: {
      type: String,
      required: true,
      unique: true, // One list per user
      index: true,
    },
    items: [
      {
        contentId: {
          type: String,
          required: true,
        },
        contentType: {
          type: String,
          required: true,
          enum: ['Movie', 'TVShow'] as ContentType[],
        },
        addedAt: {
          type: Date,
          required: true,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
    collection: 'mylists', // Explicit collection name
  }
);

/**
 * CRITICAL INDEXES FOR PERFORMANCE (<10ms target)
 * 
 * 1. userId (unique index) - Primary lookup key
 *    - Used in: findByUserId, addItem, removeItem, getItemsPaginated
 *    - Ensures O(log n) lookup time
 * 
 * 2. Compound index: userId + items.contentId
 *    - Used in: Checking for duplicates before adding
 *    - Prevents duplicate items efficiently
 * 
 * 3. updatedAt index
 *    - Used in: Cache invalidation logic
 *    - Helps track when list was last modified
 */

// Primary index on userId (already defined above, but explicit for clarity)
MyListSchema.index({ userId: 1 }, { unique: true });

// Compound index for duplicate checking
// This allows efficient queries like: { userId: '123', 'items.contentId': 'movie-456' }
MyListSchema.index({ userId: 1, 'items.contentId': 1 });

// Index on updatedAt for cache invalidation
MyListSchema.index({ updatedAt: -1 });

/**
 * Instance Method: Check if item exists
 * Optimized to use the compound index
 */
MyListSchema.methods.hasItem = function (contentId: string): boolean {
  return this.items.some((item: MyListItem) => item.contentId === contentId);
};

/**
 * Instance Method: Add item (with duplicate check)
 * Uses atomic operation to prevent race conditions
 */
MyListSchema.methods.addItem = function (item: MyListItem): void {
  if (!this.hasItem(item.contentId)) {
    this.items.push(item);
    this.updatedAt = new Date();
  } else {
    throw new Error('Item already exists in list');
  }
};

/**
 * Instance Method: Remove item
 */
MyListSchema.methods.removeItem = function (contentId: string): boolean {
  const initialLength = this.items.length;
  this.items = this.items.filter((item: MyListItem) => item.contentId !== contentId);
  if (this.items.length < initialLength) {
    this.updatedAt = new Date();
    return true;
  }
  return false;
};

export const MyListModel = mongoose.model<MyListDocument>('MyList', MyListSchema);


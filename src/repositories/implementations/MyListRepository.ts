import mongoose from 'mongoose';
import { IMyListRepository, PaginatedMyListResult } from '../interfaces/IMyListRepository';
import { MyList, MyListItem } from '../../types/myList.types';
import { PaginationMeta } from '../../types/common.types';
import { MyListModel } from '../../models/MyList.model';
import { logger } from '../../config/logger';

/**
 * MyList Repository Implementation
 * Concrete implementation of IMyListRepository
 * Handles all MyList database operations with performance optimizations
 */
export class MyListRepository implements IMyListRepository {
  /**
   * Find user's MyList by user ID
   */
  async findByUserId(userId: string): Promise<MyList | null> {
    try {
      const myListDoc = await MyListModel.findOne({ userId }).lean();
      
      if (!myListDoc) {
        return null;
      }

      return this.toDomainModel(myListDoc);
    } catch (error) {
      logger.error('Error finding MyList by user ID', { userId, error });
      throw error;
    }
  }

  /**
   * Create a new MyList for a user
   */
  async create(userId: string): Promise<MyList> {
    try {
      const myListDoc = new MyListModel({
        userId,
        items: [],
      });

      await myListDoc.save();
      return this.toDomainModel(myListDoc.toObject());
    } catch (error) {
      logger.error('Error creating MyList', { userId, error });
      throw error;
    }
  }

  /**
   * Add item to user's MyList
   * Uses atomic operation to prevent duplicates
   */
  async addItem(userId: string, item: MyListItem): Promise<void> {
    try {
      // First check if item already exists (quick check)
      const exists = await this.itemExists(userId, item.contentId);
      if (exists) {
        throw new Error('Item already exists in list');
      }

      // Use findOneAndUpdate with upsert to handle both existing and new lists
      const result = await MyListModel.findOneAndUpdate(
        { userId, 'items.contentId': { $ne: item.contentId } }, // Only update if item doesn't exist
        {
          $push: {
            items: item,
          },
          $set: {
            updatedAt: new Date(),
          },
          $setOnInsert: {
            userId,
            items: [item],
          },
        },
        {
          upsert: true,
          new: true,
          runValidators: true,
        }
      );

      // Verify item was added (should always be true due to $ne condition)
      const itemWasAdded = result.items.some(
        (existingItem) => existingItem.contentId === item.contentId
      );

      if (!itemWasAdded) {
        // This shouldn't happen, but handle edge case
        throw new Error('Failed to add item to list');
      }
    } catch (error) {
      // Check if it's a duplicate error we threw
      if (error instanceof Error && error.message === 'Item already exists in list') {
        throw error;
      }

      // Re-check for race condition (another process might have added it)
      if (error instanceof Error && error.message !== 'Item already exists in list') {
        const exists = await this.itemExists(userId, item.contentId);
        if (exists) {
          throw new Error('Item already exists in list');
        }
      }

      logger.error('Error adding item to MyList', { userId, item, error });
      throw error;
    }
  }

  /**
   * Alternative implementation using transaction for better atomicity
   */
  async addItemAtomic(userId: string, item: MyListItem): Promise<void> {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Find or create list
      let myListDoc = await MyListModel.findOne({ userId }).session(session);

      if (!myListDoc) {
        myListDoc = new MyListModel({
          userId,
          items: [],
        });
      }

      // Check for duplicate
      const itemExists = myListDoc.items.some(
        (existingItem) => existingItem.contentId === item.contentId
      );

      if (itemExists) {
        await session.abortTransaction();
        throw new Error('Item already exists in list');
      }

      // Add item
      myListDoc.items.push(item);
      myListDoc.updatedAt = new Date();
      await myListDoc.save({ session });

      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      if (error instanceof Error && error.message === 'Item already exists in list') {
        throw error;
      }
      logger.error('Error adding item to MyList (atomic)', { userId, item, error });
      throw error;
    } finally {
      session.endSession();
    }
  }

  /**
   * Remove item from user's MyList
   */
  async removeItem(userId: string, contentId: string): Promise<boolean> {
    try {
      const result = await MyListModel.findOneAndUpdate(
        { userId },
        {
          $pull: {
            items: { contentId },
          },
          $set: {
            updatedAt: new Date(),
          },
        },
        {
          new: true,
        }
      );

      if (!result) {
        return false;
      }

      // Check if item was actually removed
      const itemExists = result.items.some((item) => item.contentId === contentId);
      return !itemExists;
    } catch (error) {
      logger.error('Error removing item from MyList', { userId, contentId, error });
      throw error;
    }
  }

  /**
   * Check if item exists in user's MyList
   * Uses efficient query with compound index
   */
  async itemExists(userId: string, contentId: string): Promise<boolean> {
    try {
      const result = await MyListModel.findOne({
        userId,
        'items.contentId': contentId,
      }).lean();

      return result !== null;
    } catch (error) {
      logger.error('Error checking item existence in MyList', { userId, contentId, error });
      throw error;
    }
  }

  /**
   * Get paginated list of items from user's MyList
   * Optimized for performance with proper indexing
   */
  async getItemsPaginated(userId: string, page: number, limit: number): Promise<PaginatedMyListResult> {
    try {
      // Find the list
      const myListDoc = await MyListModel.findOne({ userId }).lean();

      if (!myListDoc) {
        // Return empty result if list doesn't exist
        return {
          items: [],
          pagination: {
            page,
            limit,
            total: 0,
            totalPages: 0,
            hasNextPage: false,
            hasPreviousPage: false,
          },
        };
      }

      const items = myListDoc.items || [];
      const total = items.length;
      const totalPages = Math.ceil(total / limit);
      const skip = (page - 1) * limit;

      // Sort by addedAt descending (newest first)
      const sortedItems = [...items].sort(
        (a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()
      );

      // Paginate
      const paginatedItems = sortedItems.slice(skip, skip + limit);

      // Transform to domain models
      const domainItems: MyListItem[] = paginatedItems.map((item) => ({
        contentId: item.contentId,
        contentType: item.contentType,
        addedAt: new Date(item.addedAt),
      }));

      const pagination: PaginationMeta = {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      };

      return {
        items: domainItems,
        pagination,
      };
    } catch (error) {
      logger.error('Error getting paginated MyList items', { userId, page, limit, error });
      throw error;
    }
  }

  /**
   * Get total count of items in user's MyList
   */
  async getItemCount(userId: string): Promise<number> {
    try {
      const myListDoc = await MyListModel.findOne({ userId }).lean();
      
      if (!myListDoc) {
        return 0;
      }

      return myListDoc.items?.length || 0;
    } catch (error) {
      logger.error('Error getting MyList item count', { userId, error });
      throw error;
    }
  }

  /**
   * Transform MongoDB document to domain model
   */
  private toDomainModel(doc: any): MyList {
    return {
      userId: doc.userId,
      items: (doc.items || []).map((item: any) => ({
        contentId: item.contentId,
        contentType: item.contentType,
        addedAt: new Date(item.addedAt),
      })),
      updatedAt: new Date(doc.updatedAt),
      createdAt: new Date(doc.createdAt),
    };
  }
}


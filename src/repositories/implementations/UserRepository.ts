import { IUserRepository } from '../interfaces/IUserRepository';
import { User } from '../../types/entities';
import { UserModel } from '../../models/User.model';
import { logger } from '../../config/logger';

/**
 * User Repository Implementation
 * Concrete implementation of IUserRepository
 * Handles all User entity database operations
 */
export class UserRepository implements IUserRepository {
  /**
   * Find user by ID
   */
  async findById(userId: string): Promise<User | null> {
    try {
      const userDoc = await UserModel.findOne({ id: userId }).lean();
      
      if (!userDoc) {
        return null;
      }

      // Transform MongoDB document to domain model
      return this.toDomainModel(userDoc);
    } catch (error) {
      logger.error('Error finding user by ID', { userId, error });
      throw error;
    }
  }

  /**
   * Find user by username
   */
  async findByUsername(username: string): Promise<User | null> {
    try {
      const userDoc = await UserModel.findOne({ username }).lean();
      
      if (!userDoc) {
        return null;
      }

      return this.toDomainModel(userDoc);
    } catch (error) {
      logger.error('Error finding user by username', { username, error });
      throw error;
    }
  }

  /**
   * Check if user exists
   */
  async exists(userId: string): Promise<boolean> {
    try {
      const count = await UserModel.countDocuments({ id: userId });
      return count > 0;
    } catch (error) {
      logger.error('Error checking user existence', { userId, error });
      throw error;
    }
  }

  /**
   * Transform MongoDB document to domain model
   * Removes MongoDB-specific fields and converts to User interface
   */
  private toDomainModel(doc: any): User {
    return {
      id: doc.id,
      username: doc.username,
      preferences: {
        favoriteGenres: doc.preferences.favoriteGenres,
        dislikedGenres: doc.preferences.dislikedGenres,
      },
      watchHistory: doc.watchHistory.map((entry: any) => ({
        contentId: entry.contentId,
        watchedOn: new Date(entry.watchedOn),
        rating: entry.rating,
      })),
    };
  }
}


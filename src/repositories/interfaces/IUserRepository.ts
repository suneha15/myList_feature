import { User } from '../../types/entities';

/**
 * User Repository Interface
 * Defines operations for User entity data access
 * Follows Dependency Inversion Principle - services depend on this interface, not implementation
 */
export interface IUserRepository {
  /**
   * Find user by ID
   * @param userId - User ID
   * @returns User or null if not found
   */
  findById(userId: string): Promise<User | null>;

  /**
   * Find user by username
   * @param username - Username
   * @returns User or null if not found
   */
  findByUsername(username: string): Promise<User | null>;

  /**
   * Check if user exists
   * @param userId - User ID
   * @returns true if user exists, false otherwise
   */
  exists(userId: string): Promise<boolean>;
}


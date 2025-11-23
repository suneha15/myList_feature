import { Request, Response, NextFunction } from 'express';
import { logger } from '../config/logger';

/**
 * Authentication Middleware
 * 
 * For this assignment, we assume basic user authentication is in place.
 * This middleware extracts user ID from request headers.
 * 
 * In production, this would:
 * - Verify JWT token
 * - Extract user ID from token
 * - Validate token expiration
 * - Check user permissions
 * 
 * For now, we use a mock implementation:
 * - Reads user ID from X-User-Id header (for testing)
 * - Falls back to default test user if not provided
 */
export interface AuthenticatedRequest extends Request {
  userId: string;
}

/**
 * Mock Authentication Middleware
 * Extracts user ID from X-User-Id header
 * 
 * Usage:
 * - Set X-User-Id header in requests: X-User-Id: user-1
 * - If header not provided, uses default test user: user-1
 */
export const mockAuthMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    // Extract user ID from header (for testing)
    const userId = req.headers['x-user-id'] as string;

    if (!userId) {
      // Default to test user for development/testing
      // In production, this would return 401 Unauthorized
      (req as AuthenticatedRequest).userId = 'user-1';
      logger.warn('No X-User-Id header provided, using default test user', {
        defaultUserId: 'user-1',
        path: req.path,
      });
    } else {
      // Validate user ID format (basic validation)
      if (userId.trim().length === 0) {
        res.status(401).json({
          error: {
            code: 'UNAUTHORIZED',
            message: 'Invalid user ID',
          },
        });
        return;
      }

      (req as AuthenticatedRequest).userId = userId.trim();
    }

    logger.debug('User authenticated', {
      userId: (req as AuthenticatedRequest).userId,
      path: req.path,
    });

    next();
  } catch (error) {
    logger.error('Authentication middleware error', { error });
    res.status(500).json({
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Authentication failed',
      },
    });
  }
};

/**
 * Production-ready JWT Authentication Middleware (commented out)
 * Uncomment and implement when real authentication is needed
 */
/*
import jwt from 'jsonwebtoken';
import { env } from '../config/env';

export const jwtAuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        error: {
          code: 'UNAUTHORIZED',
          message: 'Missing or invalid authorization header',
        },
      });
      return;
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    try {
      const decoded = jwt.verify(token, env.jwtSecret) as { userId: string };
      (req as AuthenticatedRequest).userId = decoded.userId;
      next();
    } catch (error) {
      res.status(401).json({
        error: {
          code: 'UNAUTHORIZED',
          message: 'Invalid or expired token',
        },
      });
    }
  } catch (error) {
    logger.error('JWT authentication error', { error });
    res.status(500).json({
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Authentication failed',
      },
    });
  }
};
*/


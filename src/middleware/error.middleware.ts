import { Request, Response, NextFunction } from 'express';
import { logger } from '../config/logger';
import { ErrorResponseDto } from '../dtos/myList.dto';

/**
 * Global Error Handler Middleware
 * Catches all errors and formats them into consistent error responses
 * Must be the last middleware in the chain
 */
export const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // If response already sent, delegate to default Express error handler
  if (res.headersSent) {
    return next(error);
  }

  const traceId = (req as any).traceId || 'unknown';
  const statusCode = error.statusCode || 500;
  const errorResponse: ErrorResponseDto = error.errorResponse || {
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected error occurred',
      traceId,
    },
  };

  // Log error
  if (statusCode >= 500) {
    // Server errors - log with full details
    logger.error('Server error', {
      statusCode,
      error: error.message,
      stack: error.stack,
      path: req.path,
      method: req.method,
      traceId,
    });
  } else {
    // Client errors - log as warning
    logger.warn('Client error', {
      statusCode,
      error: error.message,
      path: req.path,
      method: req.method,
      traceId,
    });
  }

  // Send error response
  res.status(statusCode).json(errorResponse);
};

/**
 * 404 Not Found Handler
 * Handles requests to non-existent routes
 */
export const notFoundHandler = (req: Request, res: Response): void => {
  const errorResponse: ErrorResponseDto = {
    error: {
      code: 'NOT_FOUND',
      message: `Route ${req.method} ${req.path} not found`,
      traceId: (req as any).traceId || 'unknown',
    },
  };

  logger.warn('Route not found', {
    method: req.method,
    path: req.path,
  });

  res.status(404).json(errorResponse);
};

/**
 * Async Error Wrapper
 * Wraps async route handlers to catch errors automatically
 * 
 * Usage:
 * router.get('/path', asyncHandler(async (req, res) => {
 *   // async code here
 * }));
 */
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};


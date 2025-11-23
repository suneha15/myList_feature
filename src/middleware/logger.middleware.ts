import { Request, Response, NextFunction } from 'express';
import { logger } from '../config/logger';
import { v4 as uuidv4 } from 'uuid';

/**
 * Request Logger Middleware
 * Logs all incoming requests with structured logging
 * Adds trace ID to requests for distributed tracing
 */
export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Generate trace ID for request tracking
  const traceId = uuidv4();
  (req as any).traceId = traceId;

  // Log request start
  const startTime = Date.now();

  logger.info('Incoming request', {
    method: req.method,
    path: req.path,
    query: req.query,
    traceId,
    userAgent: req.get('user-agent'),
    ip: req.ip || req.connection.remoteAddress,
  });

  // Log response when finished
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const logLevel = res.statusCode >= 400 ? 'error' : 'info';

    logger[logLevel]('Request completed', {
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      traceId,
    });
  });

  next();
};

/**
 * Response Logger Middleware (optional)
 * Logs response data for debugging (use carefully in production)
 */
export const responseLogger = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const originalSend = res.send;

  res.send = function (body: any) {
    // Only log in development
    if (process.env.NODE_ENV === 'development') {
      logger.debug('Response sent', {
        method: req.method,
        path: req.path,
        statusCode: res.statusCode,
        body: typeof body === 'string' ? body.substring(0, 200) : body, // Limit log size
        traceId: (req as any).traceId,
      });
    }

    return originalSend.call(this, body);
  };

  next();
};


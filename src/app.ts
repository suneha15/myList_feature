import express, { Application } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { env } from './config/env';
import { logger } from './config/logger';
import { requestLogger } from './middleware/logger.middleware';
import { mockAuthMiddleware } from './middleware/auth.middleware';
import { errorHandler, notFoundHandler } from './middleware/error.middleware';
import myListRoutes from './routes/myList.routes';

/**
 * Express Application Setup
 * Configures all middleware and routes
 */
export function createApp(): Application {
  const app = express();

  // ========== Security Middleware ==========
  
  // Helmet - Security headers
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", 'data:', 'https:'],
        },
      },
      crossOriginEmbedderPolicy: false,
    })
  );

  // CORS - Cross-Origin Resource Sharing
  app.use(
    cors({
      origin: env.isDevelopment
        ? '*' // Allow all origins in development
        : process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-User-Id'],
    })
  );

  // Rate Limiting - Prevent abuse
  const limiter = rateLimit({
    windowMs: env.rateLimit.windowMs, // 15 minutes
    max: env.rateLimit.maxRequests, // Limit each IP to 100 requests per windowMs
    message: {
      error: {
        code: 'RATE_LIMIT_EXCEEDED',
        message: 'Too many requests from this IP, please try again later.',
      },
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  });
  app.use('/api/', limiter);

  // ========== Body Parsing Middleware ==========
  
  // Parse JSON bodies
  app.use(express.json({ limit: '10mb' }));

  // Parse URL-encoded bodies
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // ========== Compression Middleware ==========
  
  // Compress responses
  app.use(compression());

  // ========== Logging Middleware ==========
  
  // Request logging (must be early in the chain)
  app.use(requestLogger);

  // ========== Health Check Endpoint ==========
  
  app.get('/health', (_req, res) => {
    res.status(200).json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: env.nodeEnv,
    });
  });

  // ========== API Routes ==========
  
  // API version prefix
  const apiRouter = express.Router();

  // Apply authentication middleware to all API routes
  apiRouter.use(mockAuthMiddleware);

  // Register feature routes
  apiRouter.use('/my-list', myListRoutes);

  // Mount API router
  app.use('/api/v1', apiRouter);

  // ========== Error Handling ==========
  
  // 404 handler (must be before error handler)
  app.use(notFoundHandler);

  // Global error handler (must be last)
  app.use(errorHandler);

  return app;
}

/**
 * Initialize Application
 * Sets up database connection and other services
 */
export async function initializeApp(): Promise<void> {
  try {
    // Validate environment variables
    const { validateEnv } = await import('./config/env');
    validateEnv();

    // Connect to database
    const { database } = await import('./config/database');
    await database.connect();

    // Initialize cache service
    const { getCacheServiceInstance } = await import('./services/CacheService');
    await getCacheServiceInstance();

    logger.info('Application initialized successfully');
  } catch (error) {
    logger.error('Failed to initialize application', { error });
    throw error;
  }
}


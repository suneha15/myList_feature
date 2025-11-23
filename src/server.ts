import { createApp, initializeApp } from './app';
import { env } from './config/env';
import { logger } from './config/logger';
import { database } from './config/database';

/**
 * Server Entry Point
 * Starts the Express server and handles graceful shutdown
 */

let server: any = null;

/**
 * Start the server
 */
async function startServer(): Promise<void> {
  try {
    // Initialize application (database, cache, etc.)
    await initializeApp();

    // Create Express app
    const app = createApp();

    // Start server
    // Use process.env.PORT directly for hosting platform compatibility
    const port = process.env.PORT || env.port || 3000;
    server = app.listen(port, () => {
      logger.info('Server started successfully', {
        port: port,
        environment: env.nodeEnv,
        nodeVersion: process.version,
      });

      // Log API endpoints
      logger.info('API Endpoints available:', {
        health: `http://localhost:${env.port}/health`,
        addItem: `POST http://localhost:${env.port}/api/v1/my-list/items`,
        removeItem: `DELETE http://localhost:${env.port}/api/v1/my-list/items/:contentId`,
        getList: `GET http://localhost:${env.port}/api/v1/my-list/items`,
      });
    });

    // Handle server errors
    server.on('error', (error: Error) => {
      logger.error('Server error', { error: error.message });
      process.exit(1);
    });
  } catch (error) {
    logger.error('Failed to start server', { error });
    process.exit(1);
  }
}

/**
 * Graceful shutdown handler
 */
async function gracefulShutdown(signal: string): Promise<void> {
  logger.info(`Received ${signal}, starting graceful shutdown...`);

  // Stop accepting new requests
  if (server) {
    server.close(() => {
      logger.info('HTTP server closed');
    });
  }

  // Close database connection
  try {
    await database.disconnect();
    logger.info('Database connection closed');
  } catch (error) {
    logger.error('Error closing database connection', { error });
  }

  // Exit process
  setTimeout(() => {
    logger.info('Graceful shutdown completed');
    process.exit(0);
  }, 5000); // Give 5 seconds for cleanup
}

// Handle shutdown signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught exceptions
process.on('uncaughtException', (error: Error) => {
  logger.error('Uncaught exception', { error: error.message, stack: error.stack });
  gracefulShutdown('uncaughtException');
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
  logger.error('Unhandled promise rejection', {
    reason: reason?.message || String(reason),
    promise,
  });
  gracefulShutdown('unhandledRejection');
});

// Start the server
if (require.main === module) {
  startServer().catch((error) => {
    logger.error('Fatal error starting server', { error });
    process.exit(1);
  });
}

export { startServer };


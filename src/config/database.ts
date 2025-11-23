/// <reference types="node" />
import mongoose from 'mongoose';
import { env } from './env';
import { logger } from './logger';

/**
 * MongoDB Database Connection
 * Handles connection, reconnection, and error handling
 */
class Database {
  private static instance: Database;
  private isConnected: boolean = false;

  private constructor() {
    this.setupEventHandlers();
  }

  /**
   * Singleton pattern to ensure single database connection
   */
  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  /**
   * Setup MongoDB event handlers for connection lifecycle
   */
  private setupEventHandlers(): void {
    mongoose.connection.on('connected', () => {
      this.isConnected = true;
      logger.info('MongoDB connected successfully', {
        database: mongoose.connection.name,
        host: mongoose.connection.host,
      });
    });

    mongoose.connection.on('error', (error: Error) => {
      this.isConnected = false;
      logger.error('MongoDB connection error', { error: error.message });
    });

    mongoose.connection.on('disconnected', () => {
      this.isConnected = false;
      logger.warn('MongoDB disconnected');
    });

    // Handle application termination
    process.on('SIGINT', async () => {
      await this.disconnect();
      process.exit(0);
    });
  }

  /**
   * Connect to MongoDB database
   * Uses test database URI when in test environment
   */
  public async connect(): Promise<void> {
    // Check if already connected using Mongoose readyState
    if (mongoose.connection.readyState === 1) {
      this.isConnected = true;
      logger.info('MongoDB already connected');
      return;
    }

    // If connection is in progress, wait for it
    if (mongoose.connection.readyState === 2) {
      logger.info('MongoDB connection in progress, waiting...');
      return new Promise((resolve, reject) => {
        mongoose.connection.once('connected', () => {
          this.isConnected = true;
          resolve();
        });
        mongoose.connection.once('error', reject);
      });
    }

    try {
      const uri = env.isTest ? env.mongodbTestUri : env.mongodbUri;

      const options: mongoose.ConnectOptions = {
        maxPoolSize: 10, // Maintain up to 10 socket connections
        serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
        socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
        // Additional options for MongoDB Atlas (mongodb+srv)
        // Note: retryWrites and w are typically in the connection string, but can be set here too
      };

      await mongoose.connect(uri, options);
      // Note: 'connected' event will be fired, which sets isConnected = true
      logger.info('MongoDB connection established', { uri: uri.replace(/\/\/.*@/, '//***@') });
    } catch (error) {
      this.isConnected = false;
      logger.error('Failed to connect to MongoDB', { error });
      throw error;
    }
  }

  /**
   * Disconnect from MongoDB database
   */
  public async disconnect(): Promise<void> {
    // Check Mongoose connection state instead of just flag
    if (mongoose.connection.readyState === 0) {
      this.isConnected = false;
      return;
    }

    try {
      await mongoose.disconnect();
      this.isConnected = false;
      logger.info('MongoDB disconnected');
    } catch (error) {
      this.isConnected = false;
      logger.error('Error disconnecting from MongoDB', { error });
      throw error;
    }
  }

  /**
   * Get connection status
   */
  public getConnectionStatus(): boolean {
    return this.isConnected && mongoose.connection.readyState === 1;
  }

  /**
   * Drop database (useful for testing)
   */
  public async dropDatabase(): Promise<void> {
    if (!env.isTest) {
      throw new Error('dropDatabase can only be called in test environment');
    }
    await mongoose.connection.db?.dropDatabase();
    logger.info('Test database dropped');
  }
}

export const database = Database.getInstance();


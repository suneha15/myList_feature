import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

/**
 * Environment configuration
 * Validates and exports all environment variables with defaults
 */
export const env = {
  // Server Configuration
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isTest: process.env.NODE_ENV === 'test',

  // MongoDB Configuration
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/ott_platform',
  mongodbTestUri: process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/ott_platform_test',

  // Redis Configuration
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    password: process.env.REDIS_PASSWORD || undefined,
    enabled: process.env.REDIS_ENABLED === 'true',
  },

  // Logging
  logLevel: process.env.LOG_LEVEL || 'info',

  // Security
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
  rateLimit: {
    windowMs: parseInt(process.env.API_RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 minutes
    maxRequests: parseInt(process.env.API_RATE_LIMIT_MAX_REQUESTS || '100', 10),
  },
} as const;

/**
 * Validates that all required environment variables are set
 * Throws an error if any critical variables are missing
 */
export function validateEnv(): void {
  const required = [
    { key: 'MONGODB_URI', value: env.mongodbUri },
  ];

  const missing: string[] = [];

  required.forEach(({ key, value }) => {
    if (!value) {
      missing.push(key);
    }
  });

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}`
    );
  }
}


/**
 * Jest Setup File
 * Runs before all tests
 */

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.MONGODB_TEST_URI = process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/ott_platform_test';
process.env.REDIS_ENABLED = 'false'; // Disable Redis for tests

// Increase timeout for integration tests
jest.setTimeout(30000); // 30 seconds


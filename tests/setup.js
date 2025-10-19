// Test setup file
require('dotenv').config();

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.PORT = '0'; // Use random available port for tests

// Increase timeout for database operations
jest.setTimeout(30000);

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  // Uncomment to suppress console.log in tests
  // log: jest.fn(),
  // debug: jest.fn(),
  // info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// Global test utilities
global.generateFirebaseUserId = () => {
  // Generate a valid Firebase user ID for testing
  // Firebase user IDs are typically 28 characters and can contain letters, numbers, and some special chars
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 28; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
};

// Keep the old function name for backward compatibility
global.generateObjectId = global.generateFirebaseUserId;

// Clean up after all tests
afterAll(async () => {
  // Add any global cleanup here
  await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for async operations to complete
});

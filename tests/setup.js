/**
 * Jest setup file for GitHub Mastery tests
 *
 * @fileoverview Global test configuration and utilities
 */

import dotenv from 'dotenv';

// Load test environment variables
dotenv.config({ path: '.env.test' });

// Mock console methods to reduce test noise
const originalConsole = { ...console };

// Global test setup
beforeAll(async () => {
  // Set test environment
  process.env.NODE_ENV = 'test';
  process.env.LOG_LEVEL = 'error'; // Suppress logs during tests

  // Mock console.log during tests to reduce noise
  console.log = jest.fn();
  console.info = jest.fn();
  console.warn = originalConsole.warn; // Keep warnings
  console.error = originalConsole.error; // Keep errors
});

afterAll(async () => {
  // Cleanup after all tests
});

beforeEach(() => {
  // Reset mocks before each test
  jest.clearAllMocks();
});

afterEach(() => {
  // Cleanup after each test
});

// Global test utilities
global.testUtils = {
  /**
   * Wait for specified milliseconds
   * @param {number} ms - Milliseconds to wait
   */
  wait: ms => new Promise(resolve => setTimeout(resolve, ms)),

  /**
   * Mock GitHub API response
   * @param {Object} data - Mock data to return
   */
  mockGitHubResponse: data => ({
    status: 200,
    data,
    headers: {},
  }),
};

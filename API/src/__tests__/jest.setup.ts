import mongoose from 'mongoose';
import dotenv from 'dotenv-flow';

/**
 * Jest setup file for global test configuration.
 * This file runs before all test suites and handles:
 * - Environment variable loading
 * - Global test cleanup
 * - Database connection management
 */

// Load environment variables for testing
dotenv.config();

/**
 * Global cleanup function that runs after all tests complete.
 * Ensures proper cleanup of database connections to prevent:
 * - Memory leaks
 * - Jest hanging after test completion
 * - Connection pool exhaustion
 * 
 * @global
 * @async
 */
afterAll(async () => {
    // Check if MongoDB connection exists before attempting to close
    if (mongoose.connection.readyState !== 0) {
        await mongoose.connection.close();
    }
});
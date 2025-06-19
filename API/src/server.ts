import app from './app'; // Import the Express app
import mongoose from 'mongoose';
import dotenv from 'dotenv-flow';

/**
 * Server initialization module.
 * Handles MongoDB connection and Express server startup.
 */

// Load environment variables from .env file
dotenv.config();

// Default port or use environment port variable
const PORT = process.env.PORT || 3000;

/**
 * Starts the HTTP server and establishes database connection.
 * This function handles the complete server initialization process including:
 * - MongoDB connection establishment
 * - Express server startup
 * - Error handling for connection failures
 *
 * @throws Will log error and exit if MongoDB connection fails
 */
export const startServer = async (): Promise<void> => {
  try {
    // Validate required environment variables
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI environment variable is required');
    }

    // Attempt to connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Successfully connected to MongoDB'); // Log success if connection is established

    // Start the Express server after successful MongoDB connection
    app.listen(PORT, () => {
      console.log(`HTTP Server running on port ${PORT}`); // Log when the server is up and running
      console.log(`API Documentation available at http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    // If connection fails, log the error and exit
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

/**
 * Graceful shutdown handler.
 * Closes MongoDB connection and stops the server gracefully.
 */
export const shutdownServer = async (): Promise<void> => {
  try {
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
    process.exit(0);
  } catch (error) {
    console.error('Error during shutdown:', error);
    process.exit(1);
  }
};

// Handle process termination signals
process.on('SIGINT', shutdownServer);
process.on('SIGTERM', shutdownServer);
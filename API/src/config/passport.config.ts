import passport from 'passport';
import { getUserById } from '../services/user.service';

/**
 * Passport.js configuration module for session-based authentication.
 * This module configures Passport.js to work with Express sessions,
 * handling user serialization and deserialization for persistent login sessions.
 * 
 * @module PassportConfig
 */

/**
 * Serializes the user for storage in the session.
 * This function determines what data should be stored in the session store.
 * Only the user ID is stored to minimize session data and maintain security.
 * 
 * @param {object} user - The user object from authentication
 * @param {string} user._id - MongoDB ObjectId of the user
 * @param {Function} done - Callback function to complete serialization
 * 
 * @example
 * // When a user logs in, this function stores only their ID in the session
 * passport.serializeUser(userObject, done) // Stores user._id as string
 */
passport.serializeUser((user: any, done: Function) => {
  // Validate that user object exists and has an _id property
  if (!user || !user._id) {
    return done(new Error('User ID is missing'));
  }
  
  // Store only the user ID (as string) in the session
  done(null, user._id.toString());
});

/**
 * Deserializes the user from the session.
 * This function reconstructs the user object from the stored session data.
 * It retrieves the full user object from the database using the stored ID.
 * 
 * @param {string} id - User ID stored in the session
 * @param {Function} done - Callback function to complete deserialization
 * 
 * @example
 * // On each request with a session, this function retrieves the full user object
 * passport.deserializeUser('user123', done) // Returns full user object
 */
passport.deserializeUser(async (id: string, done: Function) => {
  try {
    // Fetch the complete user object from database using the stored ID
    const user = await getUserById(id);
    
    // If user is not found (e.g., deleted account), return error
    if (!user) {
      return done(new Error('User not found'), null);
    }
    
    // Successfully return the user object for req.user
    done(null, user);
  } catch (err) {
    // Handle any database or network errors during user retrieval
    done(err, null);
  }
});

/**
 * Configured Passport instance.
 * This instance has been set up with session-based authentication strategies
 * and can be used throughout the application for user authentication.
 * 
 * @type {object} Configured Passport.js instance
 */
export default passport;

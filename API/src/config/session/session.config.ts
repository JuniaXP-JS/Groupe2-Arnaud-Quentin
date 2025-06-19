import session from 'express-session';
import connectMemcached from 'connect-memcached';
import dotenv from 'dotenv-flow';

/**
 * Session configuration module for Express.js application.
 * This module sets up session management using either Memcached (production) 
 * or memory store (test environment) for session storage.
 * 
 * @module SessionConfig
 */

// Load environment variables
dotenv.config();

/**
 * Flag to determine if the application is running in test environment.
 * In test mode, sessions are stored in memory instead of Memcached.
 * 
 * @type {boolean}
 */
const isTestEnv = process.env.NODE_ENV === 'test';

/**
 * Memcached store constructor for session storage.
 * This creates a session store backed by Memcached for production use.
 * 
 * @type {Function}
 */
const MemcachedStore = connectMemcached(session);

/**
 * Session store instance.
 * Uses Memcached in production/development, or undefined (memory store) in test environment.
 * 
 * @type {MemcachedStore|undefined}
 */
const storeInstance = isTestEnv
  ? undefined // Use default memory store in test environment
  : new MemcachedStore({
    hosts: [process.env.MEMCACHED_HOST || '127.0.0.1:11211'],
    secret: process.env.SESSION_SECRET,
  });

// Log the store type being used
if (storeInstance) {
  console.log('MemcachedStore utilisé pour les sessions');
} else {
  console.log('Memory store utilisé pour les sessions (mode test)');
}

/**
 * Express session middleware configuration.
 * Configures session management with the following features:
 * - Session secret for signing cookies
 * - Session store (Memcached or memory)
 * - Cookie settings for security and expiration
 * - Session persistence options
 * 
 * @type {Function} Express middleware function for session management
 * 
 * @example
 * // Usage in Express app
 * app.use(sessionMiddleware);
 */
const sessionMiddleware = session({
  /**
   * Secret used to sign the session ID cookie.
   * Should be a strong, randomly generated string in production.
   */
  secret: process.env.SESSION_SECRET || 'default_secret',

  /**
   * Forces session to be saved back to the session store.
   * Set to false for better performance as we only save when modified.
   */
  resave: false,

  /**
   * Forces uninitialized sessions to be saved to the store.
   * Set to false to avoid creating sessions for anonymous users.
   */
  saveUninitialized: false,

  /**
   * Session store instance for persistence.
   * Uses Memcached in production, memory store in test environment.
   */
  store: storeInstance,

  /**
   * Cookie configuration for session management.
   */
  cookie: {
    /**
     * Maximum age of the session cookie in milliseconds.
     * Currently set to 24 hours (1000 * 60 * 60 * 24).
     */
    maxAge: 1000 * 60 * 60 * 24,

    /**
     * Secure flag for cookies.
     * Set to false for development (HTTP), should be true in production (HTTPS).
     */
    secure: false,

    /**
     * HttpOnly flag prevents client-side JavaScript from accessing the cookie.
     * Helps protect against XSS attacks.
     */
    httpOnly: true,
  },
});

export default sessionMiddleware;
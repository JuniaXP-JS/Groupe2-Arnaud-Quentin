import 'express-session';

/**
 * Extends the express-session module to include custom session data properties.
 * This declaration merges with the existing SessionData interface to add type safety.
 */
declare module 'express-session' {
  export interface SessionData {
    /** The unique identifier of the authenticated user */
    userId: string;
  }
}
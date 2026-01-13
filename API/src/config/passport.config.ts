import passport from 'passport';
import { getUserById } from '../services/user.service';
import { Strategy as CustomStrategy } from 'passport-custom';
import speakeasy from 'speakeasy';
import { Request } from 'express';

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
 * Strategy "totp" :
 * - si l'utilisateur n'a pas de secret TOTP -> passe (pas de MFA)
 * - si req.session.mfaVerified + user id -> passe
 * - sinon vérifie le token TOTP fourni (body.totp | header x-totp | query.totp)
 * - en cas de succès : set req.session.mfaVerified = true
 */
passport.use(
  'totp',
  new CustomStrategy(async (req: Request, done: Function) => {
    try {
      const user = req.user as any;
      if (!user) return done(null, false, { message: 'User not authenticated' });

      // If user has no TOTP configured, skip MFA
      if (!user.totpSecret) return done(null, user);

      // If session already validated for this user
      if (req.session && (req.session as any).mfaVerified && (req.session as any).mfaUserId === user._id?.toString()) {
        return done(null, user);
      }

      const token =
        (req.body && (req.body as any).totp) ||
        (req.headers && (req.headers as any)['x-totp']) ||
        (req.query && (req.query as any).totp);

      if (!token) {
        return done(null, false, { message: 'TOTP token required' });
      }

      const verified = speakeasy.totp.verify({
        secret: user.totpSecret,
        encoding: 'base32',
        token: String(token),
        window: 1
      });

      if (!verified) {
        return done(null, false, { message: 'Invalid TOTP' });
      }

      // Mark session as MFA-verified for this user
      if (req.session) {
        (req.session as any).mfaVerified = true;
        (req.session as any).mfaUserId = user._id?.toString();
      }

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

/**
 * Middleware helper à utiliser sur les routes protégées qui nécessitent MFA.
 * Exemple d'utilisation: passport authenticate 'totp' (n'utilise pas session pour authentifier
 * puisque la session contient déjà req.user via deserializeUser).
 */
export const requireTotp = () => {
  return (req: Request & { user?: any; session?: any }, res: any, next: any) => {
    passport.authenticate('totp', { session: false }, (err: any, user: any, info: any) => {
      if (err) return next(err);
      if (!user) {
        const e: any = new Error(info?.message || 'MFA required');
        e.status = 401;
        return next(e);
      }
      // ensure req.user remains set
      req.user = user;
      return next();
    })(req, res, next);
  };
};

export default passport;

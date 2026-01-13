import { Request, Response } from 'express';
import User from '../../models/user.model';
import bcrypt from 'bcrypt';
import speakeasy from 'speakeasy';

/**
 * Authentication controller containing HTTP endpoint handlers for user authentication.
 * Handles user registration, login, and logout with session-based authentication.
 */

declare module 'express-session' {
    interface SessionData {
        user?: { email: string; name: string };
        mfaVerified?: boolean;
        mfaUserId?: string;
    }
}

/**
 * Regular expression for password validation.
 * Requires at least 8 characters with:
 * - One uppercase letter
 * - One lowercase letter  
 * - One number
 * - One special character
 */
const passwordValidationRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;

/**
 * Registers a new user account and creates a session.
 * Validates email uniqueness, password strength, and creates user in database.
 * 
 * @route POST /api/auth/register
 * @access Public
 * @param req - Express request object containing registration data
 * @param req.body.email - User's email address (must be unique)
 * @param req.body.password - User's password (must meet strength requirements)
 * @param res - Express response object
 * @returns JSON response with user data and session cookie or error message
 * 
 * @example
 * // Request body
 * {
 *   "email": "user@example.com",
 *   "password": "SecurePass123!"
 * }
 * 
 * @example
 * // Success response (201)
 * {
 *   "message": "User registered successfully",
 *   "user": {
 *     "email": "user@example.com",
 *     "name": ""
 *   }
 * }
 * 
 * @example
 * // Error response (409) - User exists
 * {
 *   "message": "User already exists"
 * }
 * 
 * @example
 * // Error response (400) - Weak password
 * {
 *   "message": "Password must be at least 8 characters long, contain one uppercase letter, one lowercase letter, one number, and one special character."
 * }
 */
export const register = async (req: Request, res: Response): Promise<any> => {
    try {
        const { email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: 'User already exists' });
        }

        if (!passwordValidationRegex.test(password)) {
            return res.status(400).json({
                message: 'Password must be at least 8 characters long, contain one uppercase letter, one lowercase letter, one number, and one special character.',
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({ email, password: hashedPassword });

        // Store user info in session
        req.session.user = { email: newUser.email, name: newUser.name || '' };

        return res.status(201).json({ message: 'User registered successfully', user: req.session.user });
    } catch (error) {
        console.error('Registration error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

/**
 * Authenticates user login and creates a session.
 * Validates credentials against database and establishes user session.
 * 
 * @route POST /api/auth/login
 * @access Public
 * @param req - Express request object containing login credentials
 * @param req.body.email - User's email address
 * @param req.body.password - User's plaintext password
 * @param res - Express response object
 * @returns JSON response with user data and session cookie or error message
 * 
 * @example
 * // Request body
 * {
 *   "email": "user@example.com",
 *   "password": "SecurePass123!"
 * }
 * 
 * @example
 * // Success response (200)
 * {
 *   "message": "Login successful",
 *   "user": {
 *     "email": "user@example.com",
 *     "name": "John Doe"
 *   }
 * }
 * 
 * @example
 * // Error response (401) - Invalid credentials
 * {
 *   "message": "Invalid email or password"
 * }
 */
export const login = async (req: Request, res: Response): Promise<any> => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Check if password matches
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Establish passport session (serializes user id)
        (req as any).login(user, (err: any) => {
            if (err) {
                console.error('Login error:', err);
                return res.status(500).json({ message: 'Internal server error' });
            }

            // Keep backward-compatible session.user
            req.session.user = { email: user.email, name: user.name || '' };

            // If user has MFA enabled, indicate that client must submit TOTP next
            if ((user as any).mfaEnabled) {
                return res.status(200).json({ message: 'MFA required', mfa: true });
            }

            return res.status(200).json({ message: 'Login successful', user: req.session.user });
        });

    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

/**
 * Logs out the current user and destroys their session.
 * Removes session data and clears session cookie from client.
 * 
 * @route POST /api/auth/logout
 * @access Private (requires active session)
 * @param req - Express request object containing session data
 * @param req.session - Active user session to destroy
 * @param res - Express response object
 * @returns JSON response confirming logout or error message
 * 
 * @example
 * // Success response (200)
 * {
 *   "message": "Logout successful"
 * }
 * 
 * @example
 * // Error response (500) - Session destruction failed
 * {
 *   "message": "Logout failed"
 * }
 */
export const logout = (req: Request, res: Response): void => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ message: 'Logout failed' });
        }
        res.clearCookie('connect.sid');
        return res.status(200).json({ message: 'Logout successful' });
    });
};

/**
 * Generate a TOTP secret for the authenticated user and return an otpauth URL for QR code.
 * Route: POST /api/auth/totp/setup
 */
export const totpSetup = async (req: Request, res: Response): Promise<any> => {
    try {
        // Identify user: prefer req.user (passport) then session
        const identifierEmail = (req.user as any)?.email || req.session?.user?.email;
        if (!identifierEmail) return res.status(401).json({ message: 'Not authenticated' });

        const user = await User.findOne({ email: identifierEmail });
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Generate secret
        const secret = speakeasy.generateSecret({ length: 20, name: `Junia IoT (${user.email})` });

        // Store temporary secret until user verifies code
        (user as any).tempTotpSecret = secret.base32;
        await user.save();

        return res.status(200).json({ otpauth_url: secret.otpauth_url, base32: secret.base32 });
    } catch (error) {
        console.error('TOTP setup error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

/**
 * Verify a TOTP token. If setting up, promote temp secret to active; otherwise mark session as verified.
 * Route: POST /api/auth/totp/verify
 */
export const totpVerify = async (req: Request, res: Response): Promise<any> => {
    try {
        const token = req.body?.totp || req.headers['x-totp'] || req.query?.totp;
        if (!token) return res.status(400).json({ message: 'TOTP token required' });

        const identifierEmail = (req.user as any)?.email || req.session?.user?.email;
        if (!identifierEmail) return res.status(401).json({ message: 'Not authenticated' });

        const user = await User.findOne({ email: identifierEmail });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const secretToCheck = (user as any).tempTotpSecret || (user as any).totpSecret;
        if (!secretToCheck) return res.status(400).json({ message: 'No TOTP secret configured' });

        const verified = speakeasy.totp.verify({
            secret: secretToCheck,
            encoding: 'base32',
            token: String(token),
            window: 1,
        });

        if (!verified) return res.status(401).json({ message: 'Invalid TOTP' });

        // If we were verifying during setup (temp secret exists), persist it
        if ((user as any).tempTotpSecret) {
            (user as any).totpSecret = (user as any).tempTotpSecret;
            (user as any).tempTotpSecret = undefined;
            (user as any).mfaEnabled = true;
            await user.save();
        }

        // Mark session as MFA-verified
        if (req.session) {
            req.session.mfaVerified = true;
            req.session.mfaUserId = user._id?.toString();
        }

        return res.status(200).json({ message: 'TOTP verified' });
    } catch (error) {
        console.error('TOTP verify error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
import { Request, Response } from 'express';
import User from '../../models/user.model';
import bcrypt from 'bcrypt';

/**
 * Authentication controller containing HTTP endpoint handlers for user authentication.
 * Handles user registration, login, and logout with session-based authentication.
 */

declare module 'express-session' {
    interface SessionData {
        user?: { email: string; name: string };
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

        // Store user info in session
        req.session.user = { email: user.email, name: user.name || '' };

        return res.status(200).json({ message: 'Login successful', user: req.session.user });

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
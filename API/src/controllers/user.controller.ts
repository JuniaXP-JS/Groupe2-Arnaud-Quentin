import { Request, Response } from 'express';

/**
 * User controller containing HTTP endpoint handlers for user-related operations.
 * All endpoints require session-based authentication.
 */

/**
 * Retrieves the current authenticated user's information from the session.
 * 
 * @route GET /api/users/me
 * @access Private (requires authentication)
 * @param req - Express request object containing session data
 * @param res - Express response object
 * @returns JSON response with user data or error message
 * 
 * @example
 * // Success response (200)
 * {
 *   "email": "user@example.com",
 *   "name": "John Doe"
 * }
 * 
 * @example
 * // Error response (401)
 * {
 *   "message": "Not authenticated"
 * }
 */
export const getUserInfo = (req: Request, res: Response): void => {
    const user = req.session.user;

    if (user) {
        res.json(user);
    } else {
        res.status(401).json({ message: 'Not authenticated' });
    }
};

/**
 * Updates the current authenticated user's profile information.
 * 
 * @route PUT /api/users/me
 * @access Private (requires authentication)
 * @param req - Express request object containing session data and update payload
 * @param res - Express response object
 * @returns JSON response with updated user data or error message
 */
export const updateUserProfile = (req: Request, res: Response): void => {
    const user = req.session.user;

    if (!user) {
        res.status(401).json({ message: 'Not authenticated' });
        return;
    }

    const { name } = req.body;

    // Update session data
    req.session.user = {
        ...user,
        name: name || user.name
    };

    res.json({
        message: 'Profile updated successfully',
        user: req.session.user
    });
};
import jwt, { SignOptions } from 'jsonwebtoken';

/**
 * Utility functions for JSON Web Token operations.
 * Note: This application currently uses session-based authentication,
 * but these utilities are kept for potential future use.
 */

/**
 * Generates a JWT token for a given user ID
 * @param userId - The unique identifier of the user
 * @param expiresIn - Token expiration time (default: '7d')
 * @returns The signed JWT token
 * @throws Error if JWT_SECRET is not defined
 */
export const generateToken = (userId: string, expiresIn: any): string => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error('JWT_SECRET environment variable is required');
    }

    const options: SignOptions = { expiresIn: expiresIn };
    
    return jwt.sign(
        { sub: userId },
        secret,
        options
    );
};

/**
 * Verifies and decodes a JWT token
 * @param token - The JWT token to verify
 * @returns The decoded token payload
 * @throws Error if the token is invalid or JWT_SECRET is not defined
 */
export const verifyToken = (token: string): jwt.JwtPayload | string => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error('JWT_SECRET environment variable is required');
    }

    return jwt.verify(token, secret);
};

/**
 * Decodes a JWT token without verification (useful for debugging)
 * @param token - The JWT token to decode
 * @returns The decoded token payload or null if invalid
 */
export const decodeToken = (token: string): jwt.JwtPayload | string | null => {
    return jwt.decode(token);
};

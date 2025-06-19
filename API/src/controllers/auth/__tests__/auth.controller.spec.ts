import request from 'supertest';
import app from '../../../app';
import User from '../../../models/user.model';
import { hashPassword } from '../../../services/auth.service';
import mongoose from 'mongoose';

/**
 * Test suite for authentication controllers and session management.
 * Tests the complete authentication flow including:
 * - User registration with session creation
 * - User login with session management
 * - Session-based route protection
 * - User logout and session destruction
 */
describe('Auth Controller (Session-based)', () => {
    /**
     * Set up test environment before all tests.
     * Establishes MongoDB connection for integration testing.
     */
    beforeAll(async () => {
        const mongoUri = process.env.MONGO_URI_TEST || 'mongodb://localhost:27017/express-db';
        await mongoose.connect(mongoUri, {
        } as any);
    }, 20000);

    /**
     * Clean up test environment after all tests.
     * Closes MongoDB connection to prevent memory leaks.
     */
    afterAll(async () => {
        await mongoose.connection.close();
    }, 20000);

    /**
     * Reset test state before each test.
     * Removes all test users from database to ensure clean state.
     */
    afterEach(async () => {
        await User.deleteMany({});
    }, 20000);

    /**
     * Test user registration endpoint with session cookie creation.
     * Verifies that new users can be registered and receive session cookies.
     * 
     * @test {POST} /api/auth/register - Register new user
     * @expects {201} - User created successfully
     * @expects {object} - Response contains user data
     * @expects {string} - Session cookie set in response headers
     */
    it('should register a new user and set a session cookie', async () => {
        // Ensure no existing user with test email
        await User.deleteMany({ email: 'test@example.com' }); 
        
        const res = await request(app)
            .post('/api/auth/register')
            .send({ email: 'test@example.com', password: 'Password123!' });

        expect(res.status).toBe(201);
        expect(res.body.user).toBeDefined();
        expect(res.headers['set-cookie']).toBeDefined();
        expect(res.headers['set-cookie'][0]).toMatch(/connect\.sid/);
    }, 20000);

    /**
     * Test user login endpoint with session cookie creation.
     * Verifies that existing users can authenticate and receive session cookies.
     * 
     * @test {POST} /api/auth/login - Login existing user
     * @expects {200} - Authentication successful
     * @expects {object} - Response contains user data
     * @expects {string} - Session cookie set in response headers
     */
    it('should login an existing user and set a session cookie', async () => {
        // Pre-create user with hashed password
        await User.create({ email: 'test@example.com', password: await hashPassword('Password123!') });

        const res = await request(app)
            .post('/api/auth/login')
            .send({ email: 'test@example.com', password: 'Password123!' });

        expect(res.status).toBe(200);
        expect(res.body.user).toBeDefined();
        expect(res.headers['set-cookie']).toBeDefined();
        expect(res.headers['set-cookie'][0]).toMatch(/connect\.sid/);
    }, 20000);

    /**
     * Test that protected routes deny access without authentication.
     * Verifies that session-based authentication is properly enforced.
     * 
     * @test {GET} /api/users/me - Access protected route without session
     * @expects {401} - Unauthorized access denied
     */
    it('should not access protected route without session', async () => {
        const res = await request(app)
            .get('/api/users/me'); 

        expect(res.status).toBe(401);
    }, 20000);

    /**
     * Test that protected routes allow access with valid session.
     * Tests complete authentication flow: registration/login → session → protected access.
     * 
     * @test {GET} /api/users/me - Access protected route with valid session
     * @expects {200} - Access granted to authenticated user
     * @expects {string} - Response contains user email
     */
    it('should access protected route with valid session', async () => {
        // Create test user
        await User.create({ email: 'test@example.com', password: await hashPassword('Password123!') });

        // Authenticate and obtain session cookie
        const loginRes = await request(app)
            .post('/api/auth/login')
            .send({ email: 'test@example.com', password: 'Password123!' });

        const cookie = loginRes.headers['set-cookie'];

        // Access protected route with session
        const res = await request(app)
            .get('/api/users/me')
            .set('Cookie', cookie);

        expect(res.status).toBe(200);
        expect(res.body.email).toBe('test@example.com');
    }, 20000);

    /**
     * Test user logout and session destruction.
     * Verifies that logout properly destroys sessions and denies further access.
     * 
     * @test {POST} /api/auth/logout - Logout user and destroy session
     * @expects {200} - Logout successful
     * @expects {401} - Subsequent requests with old session denied
     */
    it('should logout and destroy the session', async () => {
        // Create and authenticate user
        await User.create({ email: 'test@example.com', password: await hashPassword('Password123!') });

        const loginRes = await request(app)
            .post('/api/auth/login')
            .send({ email: 'test@example.com', password: 'Password123!' });

        const cookie = loginRes.headers['set-cookie'];

        // Logout user
        const logoutRes = await request(app)
            .post('/api/auth/logout')
            .set('Cookie', cookie);

        expect(logoutRes.status).toBe(200);

        // Verify session is destroyed - subsequent requests should fail
        const res = await request(app)
            .get('/api/users/me')
            .set('Cookie', cookie);

        expect(res.status).toBe(401);
    }, 20000);
});

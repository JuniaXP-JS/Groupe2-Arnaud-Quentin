import request from 'supertest';
import app from '../../../app';
import GpsData from '../../../models/gps.model';
import User from '../../../models/user.model';
import { hashPassword } from '../../../services/auth.service';
import mongoose from 'mongoose';

jest.mock('../../../models/gps.model');

/**
 * Test suite for GPS routes and controllers.
 * Tests the functionality of GPS data endpoints including:
 * - Creating GPS data (unauthenticated)
 * - Retrieving GPS data by IMEI (authenticated)
 * - Authentication requirements for protected routes
 */
describe('GPS Routes', () => {
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
     * Clears all mocks and removes test data from database.
     */
    beforeEach(async () => {
        jest.clearAllMocks();
        await User.deleteMany({});
        await GpsData.deleteMany?.({});
    }, 20000);

    /**
     * Test suite for POST /api/gps endpoint.
     * Tests GPS data creation functionality.
     */
    describe('POST /api/gps', () => {
        /**
         * Test that GPS data can be added without authentication.
         * This endpoint should be public to allow IoT devices to send data.
         * 
         * @test {POST} /api/gps - Create GPS data without authentication
         * @expects {201} - GPS data created successfully
         * @expects {object} - Response contains GPS data with timestamps
         */
        it('should allow adding GPS data without authentication', async () => {
            (GpsData.create as jest.Mock).mockResolvedValue({
                longitude: 50,
                latitude: 20,
                updatedAt: '2025-05-12T10:00:00.000Z',
                imei: '123456789012345',
            });

            const response = await request(app)
                .post('/api/gps')
                .send({
                    longitude: 50,
                    latitude: 20,
                    updatedAt: '2025-05-12T10:00:00.000Z',
                    imei: '123456789012345',
                });

            expect(response.status).toBe(201);
            expect(response.body).toEqual({
                longitude: 50,
                latitude: 20,
                updatedAt: '2025-05-12T10:00:00.000Z',
                imei: '123456789012345',
            });
        }, 20000);
    });

    /**
     * Test suite for GET /api/gps/:imei endpoint.
     * Tests GPS data retrieval functionality and authentication requirements.
     */
    describe('GET /api/gps/:imei', () => {
        /**
         * Test that GPS data access is denied without authentication.
         * This endpoint should be protected to ensure only authenticated users can view data.
         * 
         * @test {GET} /api/gps/:imei - Access GPS data without authentication
         * @expects {401} - Unauthorized access denied
         * @expects {string} - Error message indicating authentication required
         */
        it('should not allow access to GPS data without authentication', async () => {
            const response = await request(app).get('/api/gps/123456789012345');
            expect(response.status).toBe(401);
            expect(response.body.message).toBe('Not authenticated');
        }, 20000);

        /**
         * Test that GPS data can be retrieved with valid session authentication.
         * Tests the complete flow: user creation, login, and data retrieval.
         * 
         * @test {GET} /api/gps/:imei - Access GPS data with valid session
         * @expects {200} - GPS data retrieved successfully
         * @expects {Array} - Response contains array of GPS data sorted by timestamp
         */
        it('should allow access to GPS data with valid session', async () => {
            (GpsData.find as jest.Mock).mockReturnValue([
                {
                    longitude: 50,
                    latitude: 20,
                    updatedAt: new Date('2025-05-12T10:00:00.000Z'),
                    imei: '123456789012345',
                },
            ]);

            // Create a test user for authentication
            await User.create({ email: 'test@example.com', password: await hashPassword('Password123!') });
            
            // Authenticate user and obtain session cookie
            const loginRes = await request(app)
                .post('/api/auth/login')
                .send({ email: 'test@example.com', password: 'Password123!' });
            const cookie = loginRes.headers['set-cookie'];

            // Make authenticated request to GPS endpoint
            const response = await request(app)
                .get('/api/gps/123456789012345')
                .set('Cookie', cookie);

            expect(response.status).toBe(200);
            expect(response.body).toEqual([
                {
                    longitude: 50,
                    latitude: 20,
                    updatedAt: '2025-05-12T10:00:00.000Z',
                    imei: '123456789012345',
                },
            ]);
        }, 20000);
    });
});

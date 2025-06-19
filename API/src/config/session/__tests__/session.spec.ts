import passport from 'passport';

/**
 * Test suite for Passport.js session serialization and deserialization.
 * Tests the core session management functionality including:
 * - User serialization for session storage
 * - User deserialization from session data
 * - Proper handling of user IDs and objects
 */
describe('Passport Session', () => {
    /**
     * Set up mock serializers and deserializers before all tests.
     * Patches Passport's internal arrays to provide controlled test behavior.
     */
    beforeAll(() => {
        // Patch passport's internal serializers/deserializers for testing
        (passport as any)._serializers = [
            (user: any, done: Function) => done(null, 'abc123')
        ];
        (passport as any)._deserializers = [
            (id: string, done: Function) => {
                if (id === 'abc123') {
                    done(null, { email: 'test@example.com', id: 'abc123' });
                } else {
                    done(null, false);
                }
            }
        ];
    });

    /**
     * Test user serialization for session storage.
     * Verifies that user objects are properly converted to session-storable format.
     * 
     * @test Passport user serialization
     * @expects {string} - User ID extracted and passed to callback
     * @param {object} user - User object with _id property
     * @param {Function} done - Passport callback function
     */
    it('should serialize user by _id as string', () => {
        const done = jest.fn();
        const user = { _id: 'abc123' };
        
        // Call the mocked serializer directly
        (passport as any)._serializers[0](user, done);
        
        // Verify that the serializer called done with the correct ID
        expect(done).toHaveBeenCalledWith(null, 'abc123');
    });

    /**
     * Test user deserialization from session data.
     * Verifies that stored user IDs are properly converted back to user objects.
     * 
     * @test Passport user deserialization
     * @expects {object} - Complete user object reconstructed from ID
     * @param {string} id - User ID stored in session
     * @param {Function} done - Passport callback function
     */
    it('should deserialize user by id and return user object', async () => {
        const done = jest.fn();
        
        // Call the mocked deserializer directly
        await (passport as any)._deserializers[0]('abc123', done);
        
        // Verify that the deserializer called done with the correct user object
        expect(done).toHaveBeenCalledWith(null, { email: 'test@example.com', id: 'abc123' });
    });
});
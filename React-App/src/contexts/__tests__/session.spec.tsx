/**
 * Test suite for the SessionContext and useSession hook.
 *
 * This suite verifies:
 * - That the session provider fetches and sets the user session state correctly.
 * - That errors during session fetch are handled gracefully.
 *
 * @module session.spec
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import axios from 'axios';
import { SessionProvider, useSession } from '../session';

// Mock axios for all tests in this file
vi.mock('axios');

/**
 * Mock user session object for testing.
 * @type {{ name: string, email: string }}
 */
const mockUserSession = {
    name: 'John Doe',
    email: 'john.doe@example.com',
};

describe('SessionContext', () => {
    /**
     * Reset all mocks and silence console.error before each test.
     */
    beforeEach(() => {
        vi.resetAllMocks();
        vi.spyOn(console, 'error').mockImplementation(() => { });
    });

    /**
     * Restore all mocks after each test.
     */
    afterEach(() => {
        vi.restoreAllMocks();
    });

    /**
     * Should fetch user session and set session state.
     *
     * - Mocks axios.get to resolve with a user session.
     * - Renders the useSession hook within a SessionProvider.
     * - Verifies the initial state and the updated state after fetching.
     * - Checks that axios.get is called with the correct parameters.
     */
    it('should fetch user session and set session state', async () => {
        // Mock axios.get before rendering
        (axios.get as any).mockResolvedValue({
            data: { user: mockUserSession } // Format returned by the API
        });

        const { result } = renderHook(() => useSession(), {
            wrapper: ({ children }) => <SessionProvider>{children}</SessionProvider>
        });

        // Verify initial state (user is undefined before fetch completes)
        expect(result.current?.session?.user).toBeUndefined();

        // Wait for update and verify user session is set
        await waitFor(() => {
            expect(result.current?.session?.user).toEqual({ user: mockUserSession });
        });

        // Verify axios.get was called with correct parameters
        expect(axios.get).toHaveBeenCalledWith(
            'http://localhost:3000/api/users/me',
            { withCredentials: true }
        );
    });

    /**
     * Should handle errors when fetching user session.
     *
     * - Mocks axios.get to reject with an error.
     * - Renders the useSession hook within a SessionProvider.
     * - Verifies the initial state and that user is set to null after error.
     */
    it('should handle errors when fetching user session', async () => {
        (axios.get as any).mockRejectedValue(new Error('Failed to fetch'));

        const wrapper = ({ children }: { children: React.ReactNode }) => (
            <SessionProvider>{children}</SessionProvider>
        );

        const { result } = renderHook(() => useSession(), { wrapper });

        // Initial state: user is undefined
        expect(result.current?.session?.user).toBeUndefined();

        // Wait for error handling and state update
        await act(async () => {
            await new Promise(setImmediate);
        });

        // After error: user is null
        expect(result.current?.session?.user).toBeNull();
    });
});

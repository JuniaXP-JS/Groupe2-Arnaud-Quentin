import { vi } from 'vitest';
import React from 'react';

const mockUserData = { name: 'John Doe', email: 'john.doe@example.com' };
const mockSetSession = vi.fn();

// Create a mock useSession hook
const useSession = vi.fn().mockReturnValue({
    session: { user: mockUserData },
    setSession: mockSetSession
});

// Mock getUserSession function
const getUserSession = vi.fn().mockResolvedValue(mockUserData);

// Create a mock SessionProvider component
const SessionProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
    return <>{children}</>;
};

const sessionMock = {
    getUserSession,
    useSession,
    SessionProvider
};

export default sessionMock;

export { mockUserData, mockSetSession, getUserSession };
export { useSession };
export { SessionProvider };
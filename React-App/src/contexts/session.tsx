import { UserSession, SessionContextProps, SessionStateType, SessionProviderProps } from '../types';
import axios from 'axios';
import React, { createContext, useState, useEffect, useContext } from 'react';

/**
 * React context for user session state and updater.
 */
export const SessionContext = createContext<SessionContextProps | null>(null);

/**
 * Fetches the user session from the backend API.
 *
 * @returns {Promise<UserSession | null>} The user session object, or null if not authenticated.
 */
export const getUserSession = async (): Promise<UserSession | null> => {
    try {
        const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/users/me`,
            { withCredentials: true }
        );
        return response.data;
    } catch (error) {
        // Ne pas logguer l'erreur si c'est une erreur 401 (normal quand pas connecté)
        if (axios.isAxiosError(error) && error.response?.status === 401) {
            // L'utilisateur n'est simplement pas connecté, c'est normal
            return null;
        }
        console.error("Error fetching session:", error);
        return null;
    }
};

/**
 * Provides session state and updater to child components.
 *
 * @param {SessionProviderProps} props - The provider props.
 * @returns {JSX.Element} The provider with children.
 */
export const SessionProvider: React.FC<SessionProviderProps> = ({ children }) => {
    const [session, setSession] = useState<SessionStateType>({ user: null });
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            // Do not try to fetch the session on auth pages
            const currentPath = window.location.pathname;
            if (currentPath.startsWith('/auth/')) {
                setIsInitialized(true);
                return;
            }

            const user = await getUserSession();
            setSession({ user });
            setIsInitialized(true);
        };

        fetchUser();
    }, []);

    // Do not render children until the session is initialized
    // This prevents unwanted redirects
    if (!isInitialized) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <SessionContext.Provider value={{ session, setSession }}>
            {children}
        </SessionContext.Provider>
    );
};

/**
 * Custom hook to access the session context.
 *
 * @throws {Error} If used outside of a SessionProvider.
 * @returns {SessionContextProps} The session context value.
 */
export const useSession = () => {
    const context = useContext(SessionContext);
    if (!context) {
        throw new Error('useSession must be used within a SessionProvider');
    }
    return context;
};
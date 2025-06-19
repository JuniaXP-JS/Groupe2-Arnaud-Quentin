import { ReactNode } from "react";

export interface User {
    id: string;
    email: string;
    name?: string;
}

export interface Session {
    user: User | null;
}

// User interface for the session
export interface UserSession {
    name: string;
    email: string;
}

// Session state type
export interface SessionStateType {
    user: UserSession | null;
}

// Context properties
export interface SessionContextProps {
    session: SessionStateType;
    setSession: (session: SessionStateType) => void;
}

export interface SessionProviderProps {
    children: ReactNode;
}


export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterCredentials extends LoginCredentials {
    confirmPassword: string;
}
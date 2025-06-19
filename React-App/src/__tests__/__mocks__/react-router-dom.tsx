import { vi } from 'vitest';
import React from 'react';

const mockNavigate = vi.fn();

// Mock useNavigate hook
const useNavigate = () => mockNavigate;

// Mock BrowserRouter component
const BrowserRouter: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
    return <>{children}</>;
};

export default {
    useNavigate,
    BrowserRouter,
};

export { mockNavigate, BrowserRouter, useNavigate };
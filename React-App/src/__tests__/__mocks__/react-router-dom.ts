import { vi } from 'vitest';
import React from 'react';

export const mockNavigate = vi.fn();
export const mockUseLocation = vi.fn(() => ({
    pathname: '/',
    search: '',
    hash: '',
    state: null,
    key: 'default'
}));

export const useNavigate = vi.fn(() => mockNavigate);
export const useLocation = vi.fn(() => mockUseLocation());

export const Link = vi.fn(({ children, to, ...props }) => {
    return React.createElement('a', { href: to, ...props }, children);
});

export const Outlet = vi.fn(() => React.createElement('div', { 'data-testid': 'outlet' }));

export const BrowserRouter = vi.fn(({ children }) => {
    return React.createElement('div', { 'data-testid': 'browser-router' }, children);
});

export const MemoryRouter = vi.fn(({ children }) => {
    return React.createElement('div', { 'data-testid': 'memory-router' }, children);
});

export const Routes = vi.fn(({ children }) => {
    return React.createElement('div', { 'data-testid': 'routes' }, children);
});

export const Route = vi.fn(({ children }) => {
    return React.createElement('div', { 'data-testid': 'route' }, children);
});

export default {
    useNavigate,
    useLocation,
    Link,
    Outlet,
    BrowserRouter,
    MemoryRouter,
    Routes,
    Route,
    mockNavigate,
    mockUseLocation
};

import React, { createContext } from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import {CustomRenderOptions} from '../types/test';
import { vi } from 'vitest';

// Mock for SidebarContext
export const SidebarContext = createContext({
    state: 'expanded',
    setState: () => { },
});

// Mock SidebarProvider component
const MockSidebarProvider = ({ children }: { children: React.ReactNode }) => {
    return (
        <SidebarContext.Provider value={{ state: 'expanded', setState: vi.fn() }}>
            {children}
        </SidebarContext.Provider>
    );
};

export function renderWithProviders(
    ui: React.ReactElement,
    {
        withSession = true,
        withSidebar = true,
        withRouter = true,
        sessionProvider,
        sidebarProvider,
        ...renderOptions
    }: CustomRenderOptions = {}
) {
    // Create mock providers that just render children if real ones aren't available
    const MockProvider = ({ children }: { children: React.ReactNode }) => <>{children}</>;

    // Use provided providers or mocks
    const SessionProvider = sessionProvider || MockProvider;
    const SidebarProvider = sidebarProvider || MockSidebarProvider;

    function Wrapper({ children }: { children: React.ReactNode }) {
        let result = <>{children}</>;

        if (withSession) {
            result = <SessionProvider>{result}</SessionProvider>;
        }

        if (withSidebar) {
            result = <SidebarProvider>{result}</SidebarProvider>;
        }

        if (withRouter) {
            result = <BrowserRouter>{result}</BrowserRouter>;
        }

        return result;
    }

    return render(ui, { wrapper: Wrapper, ...renderOptions });
}
import { vi } from 'vitest';
import React, { createContext } from 'react';

// Create mockSetState function that can be accessed from tests
const mockSetState = vi.fn();

// Mock sidebar state and functions
const useSidebar = vi.fn().mockReturnValue({
    state: 'expanded',
    setState: mockSetState  // Use the exported function
});

// Create a SidebarContext for the provider
const SidebarContext = createContext({
    state: 'expanded',
    setState: mockSetState  // Use the exported function
});

// Create a SidebarProvider component
const SidebarProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
    return (
        <SidebarContext.Provider value={{ state: 'expanded', setState: mockSetState }}>
            {children}
        </SidebarContext.Provider>
    );
};

export { useSidebar, SidebarContext, SidebarProvider, mockSetState };

export default {
    useSidebar,
    SidebarContext,
    SidebarProvider
};
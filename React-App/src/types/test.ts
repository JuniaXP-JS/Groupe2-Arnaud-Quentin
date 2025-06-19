import { RenderOptions } from '@testing-library/react';
import { vi } from 'vitest';

/**
 * Interface for providing optional props to the custom render function.
 */
export interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
    withSession?: boolean;
    withSidebar?: boolean;
    withRouter?: boolean;
    sessionProvider?: React.ComponentType<{ children: React.ReactNode }>;
    sidebarProvider?: React.ComponentType<{ children: React.ReactNode }>;
}

/**
 * Props for a mock provider component.
 */
export interface MockProviderProps {
    children: React.ReactNode;
}

/**
 * Mock type for ApexCharts chart instance.
 */
export interface MockChartType extends ReturnType<typeof vi.fn> {
    lastOptions?: unknown;
    lastSeries?: unknown;
    lastType?: unknown;
    lastHeight?: unknown;
    lastWidth?: unknown;
    render?: ReturnType<typeof vi.fn>;
    updateOptions?: ReturnType<typeof vi.fn>;
    updateSeries?: ReturnType<typeof vi.fn>;
    appendData?: ReturnType<typeof vi.fn>;
    resetSeries?: ReturnType<typeof vi.fn>;
    toggleSeries?: ReturnType<typeof vi.fn>;
    destroy?: ReturnType<typeof vi.fn>;
    exec?: ReturnType<typeof vi.fn>;
    getChartByID?: ReturnType<typeof vi.fn>;
}
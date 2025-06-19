/**
 * Test suite for the MapContainer component.
 *
 * @module MapContainer.spec
 */

import { screen } from '@testing-library/react';
import { act } from 'react';
import { vi } from 'vitest';

vi.mock('react-map-gl/mapbox', () => import('../../../__tests__/__mocks__/react-map-gl'));
vi.mock('../../../components/ui/sidebar', () => import('../../../__tests__/__mocks__/sidebar'));

import MapContainer from '../MapContainer';
import { renderWithProviders } from '../../../__tests__/test-utils';

describe('MapContainer', () => {
    const mockGpsData = [
        {
            updatedAt: Date.now(),
            latitude: 50.6367,
            longitude: 3.0635,
            imei: '123456789012345'
        }
    ];

    beforeEach(() => {
        // Reset all mocks before each test.
        vi.clearAllMocks();
    });

    /**
     * Should render the map container.
     */
    it('renders the map container', async () => {
        await act(async () => {
            renderWithProviders(
                <MapContainer gpsData={mockGpsData} isLoading={false} />,
                { withSidebar: true }
            );
        });

        expect(screen.getByTestId('mock-map')).toBeInTheDocument();
    });

    /**
     * Should initialize the map with markers.
     */
    it('initializes the map with markers', async () => {
        await act(async () => {
            renderWithProviders(
                <MapContainer gpsData={mockGpsData} isLoading={false} />,
                { withSidebar: true }
            );
        });

        expect(screen.getByTestId('mock-marker')).toBeInTheDocument();
    });

    /**
     * Should display loading spinner when isLoading is true.
     */
    it('displays loading spinner when isLoading is true', async () => {
        await act(async () => {
            renderWithProviders(
                <MapContainer gpsData={[]} isLoading={true} />,
                { withSidebar: true }
            );
        });

        expect(screen.getAllByRole('status')).toHaveLength(1);
        expect(screen.getByTestId('mock-map')).toBeInTheDocument();
    });

    /**
     * Should correctly pass GPS data to child components.
     */
    it('correctly passes GPS data to child components', async () => {
        await act(async () => {
            renderWithProviders(
                <MapContainer gpsData={mockGpsData} isLoading={false} />,
                { withSidebar: true }
            );
        });

        expect(screen.getByTestId('mock-marker')).toBeInTheDocument();
    });
});
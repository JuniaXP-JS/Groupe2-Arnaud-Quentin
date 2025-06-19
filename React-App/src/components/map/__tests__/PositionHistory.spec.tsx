/**
 * Test suite for the PositionHistory component.
 *
 * This suite verifies that the PositionHistory map component:
 * - Renders a marker for each historical GPS position.
 * - Does not render markers when the data array is empty.
 *
 * @module PositionHistory.spec
 */

import { screen } from '@testing-library/react';
import { act } from 'react';
import { vi } from 'vitest';

vi.mock('react-map-gl/mapbox', () => import('../../../__tests__/__mocks__/react-map-gl'));

import PositionHistory from '../PositionHistory';
import { renderWithProviders } from '../../../__tests__/test-utils';

describe('PositionHistory', () => {
    /**
     * Mock marker data for testing.
     * @type {Array<{imei: string, updatedAt: number, latitude: number, longitude: number}>}
     */
    const mockMarkers = [
        {
            imei: '123456789012345',
            updatedAt: Date.now() - 1000,
            latitude: 50.6367,
            longitude: 3.0635
        },
        {
            imei: '123456789012345',
            updatedAt: Date.now(),
            latitude: 50.6368,
            longitude: 3.0636
        }
    ];

    /**
     * Should render a marker for each position in the markers array.
     * Checks that the number of rendered markers matches the input data.
     */
    it('renders markers for all positions', async () => {
        await act(async () => {
            renderWithProviders(<PositionHistory markers={mockMarkers} />);
        });

        const markers = screen.getAllByTestId('mock-marker');
        expect(markers.length).toBe(mockMarkers.length);
    });

    /**
     * Should not render any markers when the markers array is empty.
     * Checks that no marker elements are present in the DOM.
     */
    it('does not render markers when data is empty', async () => {
        await act(async () => {
            renderWithProviders(<PositionHistory markers={[]} />);
        });

        expect(screen.queryByTestId('mock-marker')).not.toBeInTheDocument();
    });
});
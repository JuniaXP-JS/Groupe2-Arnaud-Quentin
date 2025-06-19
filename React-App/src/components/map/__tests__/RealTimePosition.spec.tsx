/**
 * Test suite for the RealTimePosition component.
 *
 * @module RealTimePosition.spec
 */

import { screen } from '@testing-library/react';
import { act } from 'react';
import { vi } from 'vitest';

vi.mock('react-map-gl/mapbox', () => import('../../../__tests__/__mocks__/react-map-gl'));

import RealTimePosition from '../RealTimePosition';
import { renderWithProviders } from '../../../__tests__/test-utils';

describe('RealTimePosition', () => {
    const mockMarkers = [
        {
            updatedAt: Date.now(),
            latitude: 50.6367,
            longitude: 3.0635,
            imei: '123456789012345'
        }
    ];

    /**
     * Should render a marker for the latest position.
     */
    it('renders a marker for the latest position', async () => {
        await act(async () => {
            renderWithProviders(<RealTimePosition markers={mockMarkers} />);
        });

        expect(screen.getByTestId('mock-marker')).toBeInTheDocument();
    });

    /**
     * Should not render markers when data is empty.
     */
    it('does not render markers when data is empty', async () => {
        await act(async () => {
            renderWithProviders(<RealTimePosition markers={[]} />);
        });

        expect(screen.queryByTestId('mock-marker')).not.toBeInTheDocument();
    });
});
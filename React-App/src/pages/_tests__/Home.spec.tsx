import { screen } from '@testing-library/react';
import { act } from 'react';
import { vi } from 'vitest';

vi.mock('axios', () => import('../../__tests__/__mocks__/axios'));
vi.mock('../../components/ui/sidebar', () => import('../../__tests__/__mocks__/sidebar'));
vi.mock('react-apexcharts', () => import('../../__tests__/__mocks__/react-apexcharts'));

import { get as mockGet } from '../../__tests__/__mocks__/axios';

import Home from '../Home';
import { renderWithProviders } from '../../__tests__/test-utils';

describe('Home', () => {
    beforeEach(() => {
        vi.clearAllMocks();

        mockGet.mockResolvedValue({
            data: [
                {
                    id: 1,
                    updatedAt: Date.now(),
                    latitude: 50.6367,
                    longitude: 3.0635,
                    imei: '123456789012345'
                }
            ]
        });
    });

    it('renders the GPS map title', async () => {
        await act(async () => {
            renderWithProviders(<Home />, {
                withSidebar: true
            });
        });

        expect(screen.getByText(/Carte des positions GPS/i)).toBeInTheDocument();
    });

    it('renders the chart with data', async () => {
        await act(async () => {
            renderWithProviders(<Home />, {
                withSidebar: true
            });
        });

        expect(screen.getByTestId('mock-apexchart')).toBeInTheDocument();
    });
});
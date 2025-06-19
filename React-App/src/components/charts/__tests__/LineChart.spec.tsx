/**
 * Test suite for the LineChart component.
 *
 * @module LineChart.spec
 */

import { screen } from '@testing-library/react';
import { act } from 'react';
import { vi } from 'vitest';

vi.mock('react-apexcharts', () => import('../../../__tests__/__mocks__/react-apexcharts'));

import mockChart from '../../../__tests__/__mocks__/react-apexcharts';

import { LineChart } from '../LineChart';
import { renderWithProviders } from '../../../__tests__/test-utils';

/**
 * Generates mock data for the chart tests.
 * @returns {Array<{updatedAt: number}>} Array of mock data points.
 */
function createMockData() {
    return [
        { updatedAt: new Date('2023-01-01').getTime() },
        { updatedAt: new Date('2023-01-01').getTime() },
        { updatedAt: new Date('2023-01-02').getTime() },
        { updatedAt: new Date('2023-01-03').getTime() },
        { updatedAt: new Date('2023-01-03').getTime() },
    ];
}

describe('LineChart', () => {
    /**
     * Mock data used for all tests.
     * @type {Array<{updatedAt: number}>}
     */
    const mockData = createMockData();

    /**
     * Reset all mocks before each test to ensure test isolation.
     */
    beforeEach(() => {
        vi.clearAllMocks();
    });

    /**
     * Should render the chart with default props.
     * Verifies that the chart is rendered and the mockChart function is called.
     */
    it('renders with default props', async () => {
        await act(async () => {
            renderWithProviders(<LineChart data={mockData} />);
        });

        expect(screen.getByTestId('mock-apexchart')).toBeInTheDocument();
        expect(mockChart).toHaveBeenCalled();
    });

    /**
     * Should render the chart with custom axis titles.
     * Verifies that the axis titles are passed to the chart options.
     */
    it('renders with custom axis titles', async () => {
        await act(async () => {
            renderWithProviders(
                <LineChart
                    data={mockData}
                    xAxisTitle="Dates"
                    yAxisTitle="Nombre de positions"
                />
            );
        });

        expect(screen.getByTestId('mock-apexchart')).toBeInTheDocument();
        expect(mockChart).toHaveBeenCalledWith(
            expect.objectContaining({
                options: expect.objectContaining({
                    xaxis: expect.objectContaining({
                        title: expect.objectContaining({
                            text: 'Dates'
                        })
                    }),
                    yaxis: expect.objectContaining({
                        title: expect.objectContaining({
                            text: 'Nombre de positions'
                        })
                    })
                }),
                series: expect.arrayContaining([
                    expect.objectContaining({
                        name: 'Positions per day',
                        data: expect.arrayContaining([
                            expect.objectContaining({ x: '01/01/2023', y: 2 }),
                            expect.objectContaining({ x: '02/01/2023', y: 1 }),
                            expect.objectContaining({ x: '03/01/2023', y: 2 })
                        ])
                    })
                ])
            }),
            undefined
        );
    });

    /**
     * Should handle empty data array gracefully.
     * Verifies that the chart is rendered with an empty data series.
     */
    it('handles empty data array', async () => {
        await act(async () => {
            renderWithProviders(<LineChart data={[]} />);
        });

        expect(screen.queryByTestId('mock-apexchart')).not.toBeInTheDocument();
        expect(mockChart).not.toHaveBeenCalled();
    });

    /**
     * Should correctly group data by day.
     * Verifies that the chart data is grouped and sorted by date.
     */
    it('correctly groups data by day', async () => {
        await act(async () => {
            renderWithProviders(<LineChart data={mockData} />);
        });

        expect(screen.getByTestId('mock-apexchart')).toBeInTheDocument();
        expect(mockChart).toHaveBeenCalledWith(
            expect.objectContaining({
                series: expect.arrayContaining([
                    expect.objectContaining({
                        name: 'Positions per day',
                        data: expect.arrayContaining([
                            expect.objectContaining({ x: '01/01/2023', y: 2 }),
                            expect.objectContaining({ x: '02/01/2023', y: 1 }),
                            expect.objectContaining({ x: '03/01/2023', y: 2 })
                        ])
                    })
                ])
            }),
            undefined
        );
    });
});
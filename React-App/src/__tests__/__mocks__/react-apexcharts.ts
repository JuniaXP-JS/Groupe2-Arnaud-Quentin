import { vi } from 'vitest';
import React from 'react';

const mockChart = vi.fn((props: any) => {
    return React.createElement('div', { 'data-testid': 'mock-apexchart' });
});

export default mockChart;

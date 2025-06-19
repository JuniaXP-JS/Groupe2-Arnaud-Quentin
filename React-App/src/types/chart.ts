/**
 * Data point for a chart.
 */
export interface ChartDataPoint {
    updatedAt: number;
    value: number;
    label?: string;
}

/**
 * Props for the LineChart component.
 */
export interface LineChartProps {
    data: any[];
    xAxisTitle?: string;
    yAxisTitle?: string;
}
import { LineChartProps } from '../../types/chart';
import Chart from 'react-apexcharts';

/**
 * LineChart component to display grouped data by day using ApexCharts.
 *
 * - Groups input data by day and counts occurrences.
 * - Renders a line chart with formatted axes and tooltips.
 * - Returns null if no data is available.
 *
 * @param {LineChartProps} props - The props for the line chart.
 * @returns {JSX.Element | null} The rendered line chart or null if no data.
 */
export const LineChart: React.FC<LineChartProps> = ({ data, xAxisTitle, yAxisTitle }) => {
    // Safety: do not render if data is empty or not an array
    if (!Array.isArray(data) || data.length === 0) {
        return null;
    }

    /**
     * Groups the input data by day and counts the number of items per day.
     */
    const groupedData = data.reduce((acc: Record<string, number>, item) => {
        const date = new Date(item.updatedAt).toISOString().split('T')[0]; // Get YYYY-MM-DD format
        acc[date] = (acc[date] || 0) + 1; // Count items per day
        return acc;
    }, {});

    /**
     * Converts grouped data into an array suitable for the chart.
     * Sorts by date and formats the date as DD/MM/YYYY.
     */
    const chartData = Object.entries(groupedData)
        .sort(([dateA], [dateB]) => new Date(dateA).getTime() - new Date(dateB).getTime()) // Sort oldest to newest
        .map(([date, count]) => ({
            // Format date as DD/MM/YYYY
            x: new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(date)),
            y: count,
        }));

    // Safety: do not render if chartData is empty
    if (!Array.isArray(chartData) || chartData.length === 0) {
        return null;
    }

    const chartOptions = {
        chart: {
            type: "line" as "line",
            toolbar: {
                show: false,
            },
        },
        xaxis: {
            type: 'category' as "category",
            title: {
                text: xAxisTitle || '',
                style: {
                    color: '#000', // Black text for X axis
                },
            },
            labels: {
                style: {
                    colors: '#000', // Black text for X axis labels
                },
            },
        },
        yaxis: {
            title: {
                text: yAxisTitle || '',
                style: {
                    color: '#000', // Black text for Y axis
                },
            },
            labels: {
                style: {
                    colors: '#000', // Black text for Y axis labels
                },
            },
        },
        stroke: {
            curve: "smooth" as "smooth",
            colors: ['#6366f1'],
        },
        tooltip: {
            theme: 'dark',
        },
    };

    const chartSeries = [
        {
            name: 'Positions per day',
            data: chartData,
            color: '#6366f1'
        },
    ];

    return (
        <div
            tabIndex={0}
            className="outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-lg"
        >
            <Chart options={chartOptions} series={chartSeries} type="line" height={300} />
        </div>
    );
};
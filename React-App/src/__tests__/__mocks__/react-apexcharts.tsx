import { MockChartType } from '../../types/test';
import { vi } from 'vitest';

const mockChart = vi.fn().mockImplementation((props) => {
  // Store the last received props to verify them in tests
  (mockChart as MockChartType).lastOptions = props.options;
  (mockChart as MockChartType).lastSeries = props.series;
  (mockChart as MockChartType).lastType = props.type;
  (mockChart as MockChartType).lastHeight = props.height;
  (mockChart as MockChartType).lastWidth = props.width;

  // Return a div with data-testid to retrieve it in tests
  // Also add data attributes for important props to make testing easier
  return (
    <div
      data-testid="mock-apexchart"
      data-chart-type={props.type}
    >
      <span data-testid="chart-options" style={{ display: 'none' }}>
        {JSON.stringify(props.options)}
      </span>
      <span data-testid="chart-series" style={{ display: 'none' }}>
        {JSON.stringify(props.series)}
      </span>
    </div>
  );
}) as MockChartType;

// Add chart instance methods
mockChart.render = vi.fn();
mockChart.updateOptions = vi.fn();
mockChart.updateSeries = vi.fn();
mockChart.appendData = vi.fn();
mockChart.resetSeries = vi.fn();
mockChart.toggleSeries = vi.fn();
mockChart.destroy = vi.fn();

// Add static methods that ApexCharts provides
mockChart.exec = vi.fn();
mockChart.getChartByID = vi.fn(() => ({
  render: vi.fn(),
  updateOptions: vi.fn(),
  updateSeries: vi.fn()
}));

export default mockChart;
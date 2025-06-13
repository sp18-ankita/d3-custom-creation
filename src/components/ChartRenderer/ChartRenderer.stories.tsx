import type { Meta, StoryObj } from '@storybook/react-vite';
import { type DataPoint, type Zone, ChartTypeValues } from '../../enums/ChartType';
import { GenericChartRenderer } from './ChartRenderer';

const DEFAULT_DATA: DataPoint[] = [
  { label: 'A', value: 30 },
  { label: 'B', value: 70 },
  { label: 'C', value: 50 },
];

const DEFAULT_ZONES: Zone[] = [
  { from: 0, to: 30, color: '#4caf50' },
  { from: 30, to: 70, color: '#ffeb3b' },
  { from: 70, to: 100, color: '#f44336' },
];

const meta: Meta<typeof GenericChartRenderer> = {
  title: 'Charts/GenericChartRenderer',
  component: GenericChartRenderer,
  argTypes: {
    type: {
      control: 'select',
      options: Object.values(ChartTypeValues),
    },
    customProps: {
      control: 'object',
    },
  },
};

export default meta;
type Story = StoryObj<typeof GenericChartRenderer>;

/**
 * Bar Chart Story
 */
export const BarChart: Story = {
  args: {
    type: 'bar',
    data: DEFAULT_DATA,
  },
};

/**
 * Line Chart Story
 */
export const LineChart: Story = {
  args: {
    type: 'line',
    data: DEFAULT_DATA,
  },
};

/**
 * Pie Chart Story
 */
export const PieChart: Story = {
  args: {
    type: 'pie',
    data: DEFAULT_DATA,
  },
};

/**
 * Speedometer Chart Story
 */
export const SpeedometerChart: Story = {
  args: {
    type: 'speedometer',
    data: [],
    customProps: {
      value: 45,
      min: 0,
      max: 100,
      majorTicks: 5,
      zones: DEFAULT_ZONES,
      width: 400,
      height: 220,
      startAngle: -180,
      endAngle: 180,
    },
  },
};

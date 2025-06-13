import type { Meta, StoryObj } from '@storybook/react-vite';
import type { DataPoint } from '../../enums/ChartType';
import { LineChart } from './Linechart';

const sampleData: DataPoint[] = [
  { label: 'Jan', value: 30 },
  { label: 'Feb', value: 50 },
  { label: 'Mar', value: 40 },
  { label: 'Apr', value: 70 },
  { label: 'May', value: 60 },
];

const meta: Meta<typeof LineChart> = {
  title: 'Charts/LineChart',
  component: LineChart,
  args: {
    data: sampleData,
  },
};

export default meta;
type Story = StoryObj<typeof LineChart>;

export const Default: Story = {
  args: {
    data: sampleData,
  },
};

export const FewerPoints: Story = {
  args: {
    data: [
      { label: 'A', value: 10 },
      { label: 'B', value: 80 },
    ],
  },
};

export const FlatLine: Story = {
  args: {
    data: [
      { label: 'X', value: 50 },
      { label: 'Y', value: 50 },
      { label: 'Z', value: 50 },
    ],
  },
};

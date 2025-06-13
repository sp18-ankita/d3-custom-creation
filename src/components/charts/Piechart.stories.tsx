import type { Meta, StoryObj } from '@storybook/react-vite';
import type { DataPoint } from '../../enums/ChartType';
import { PieChart } from './Piechart';

const sampleData: DataPoint[] = [
  { label: 'Apples', value: 30 },
  { label: 'Bananas', value: 20 },
  { label: 'Cherries', value: 50 },
];

const meta: Meta<typeof PieChart> = {
  title: 'Charts/PieChart',
  component: PieChart,
  args: {
    data: sampleData,
  },
};

export default meta;
type Story = StoryObj<typeof PieChart>;

export const Default: Story = {
  args: {
    data: sampleData,
  },
};

export const EqualValues: Story = {
  args: {
    data: [
      { label: 'A', value: 25 },
      { label: 'B', value: 25 },
      { label: 'C', value: 25 },
      { label: 'D', value: 25 },
    ],
  },
};

export const SingleSlice: Story = {
  args: {
    data: [{ label: 'Only One', value: 100 }],
  },
};

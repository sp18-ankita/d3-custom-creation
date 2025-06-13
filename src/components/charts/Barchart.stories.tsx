import type { Meta, StoryObj } from '@storybook/react-vite';
import type { DataPoint } from '../../enums/ChartType';
import { BarChart } from './Barchart';

const defaultData: DataPoint[] = [
  { label: 'A', value: 30 },
  { label: 'B', value: 80 },
  { label: 'C', value: 45 },
  { label: 'D', value: 60 },
  { label: 'E', value: 20 },
  { label: 'F', value: 90 },
  { label: 'G', value: 55 },
];

const fewData: DataPoint[] = [
  { label: 'X', value: 10 },
  { label: 'Y', value: 50 },
];

const uniformData: DataPoint[] = [
  { label: 'One', value: 40 },
  { label: 'Two', value: 40 },
  { label: 'Three', value: 40 },
];

const meta: Meta<typeof BarChart> = {
  title: 'Charts/BarChart',
  component: BarChart,
  tags: ['autodocs'],
  args: {
    data: defaultData,
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A simple bar chart using D3 and a custom `useD3` hook.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof BarChart>;

export const Default: Story = {};

// === Additional Variants ===

export const FewBars: Story = {
  args: {
    data: fewData,
  },
};

export const UniformValues: Story = {
  args: {
    data: uniformData,
  },
};

export const TallBars: Story = {
  args: {
    data: [
      { label: 'A', value: 200 },
      { label: 'B', value: 150 },
      { label: 'C', value: 300 },
    ],
  },
};

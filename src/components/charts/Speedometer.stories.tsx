import type { Meta, StoryObj } from '@storybook/react-vite';
import type { Zone } from '../../enums/ChartType';
import { Speedometer } from './Speedometer';

const defaultZones: Zone[] = [
  { from: 0, to: 30, color: '#4caf50' },
  { from: 30, to: 70, color: '#ffeb3b' },
  { from: 70, to: 180, color: '#f44336' },
];

const meta: Meta<typeof Speedometer> = {
  title: 'Charts/Speedometer',
  component: Speedometer,
  args: {
    value: 45,
    min: 0,
    max: 100,
    majorTicks: 5,
    width: 400,
    height: 220,
    startAngle: -180,
    endAngle: 0,
    zones: defaultZones,
  },
  argTypes: {
    value: { control: { type: 'range', min: 0, max: 100, step: 1 } },
    majorTicks: { control: { type: 'number', min: 1, max: 10 } },
    startAngle: { control: { type: 'number', min: -180, max: 0 } },
    endAngle: { control: { type: 'number', min: 0, max: 180 } },
    min: { control: { type: 'number', min: 0, max: 50 } },
    max: { control: { type: 'number', min: 50, max: 200 } },
  },
};

export default meta;
type Story = StoryObj<typeof Speedometer>;

export const Default: Story = {};

export const CustomZones: Story = {
  args: {
    zones: [
      { from: 0, to: 50, color: '#03a9f4' },
      { from: 50, to: 80, color: '#ffc107' },
      { from: 80, to: 180, color: '#e91e63' },
    ],
    value: 75,
  },
};

export const MinimalTicks: Story = {
  args: {
    majorTicks: 2,
    value: 90,
  },
};

export const FullRange: Story = {
  args: {
    value: 100,
    majorTicks: 10,
    startAngle: -180,
    endAngle: 0,
  },
};

export const SmallSize: Story = {
  args: {
    width: 200,
    height: 100,
    value: 30,
  },
};

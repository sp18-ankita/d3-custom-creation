import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { GenericChartRenderer } from '../components/ChartRenderer';
import type { DataPoint } from '../enums/ChartType';

vi.mock('../components/charts/Barchart', () => ({
  BarChart: ({ data }: { data: DataPoint[] }) => (
    <div data-testid="bar-chart">Bar Chart: {data.length}</div>
  ),
}));

vi.mock('../components/charts/Linechart', () => ({
  LineChart: ({ data }: { data: DataPoint[] }) => (
    <div data-testid="line-chart">Line Chart: {data.length}</div>
  ),
}));

vi.mock('../components/charts/Piechart', () => ({
  PieChart: ({ data }: { data: DataPoint[] }) => (
    <div data-testid="pie-chart">Pie Chart: {data.length}</div>
  ),
}));

vi.mock('../components/charts/Speedometer', () => ({
  Speedometer: ({ value }: { value: number }) => (
    <div data-testid="speedometer">Speedometer Value: {value}</div>
  ),
}));

const mockData = [
  { label: 'A', value: 10 },
  { label: 'B', value: 20 },
];

describe('GenericChartRenderer', () => {
  it('renders BarChart with correct data length', () => {
    render(<GenericChartRenderer type="bar" data={mockData} />);
    const el = screen.getByTestId('bar-chart');
    expect(el).toBeTruthy();
    expect(screen.getByText(/Bar Chart: 2/i)).toBeTruthy();
  });

  it('renders LineChart with correct data length', () => {
    render(<GenericChartRenderer type="line" data={mockData} />);
    const el = screen.getByTestId('line-chart');
    expect(el).toBeTruthy();
    expect(screen.getByText(/Line Chart: 2/i)).toBeTruthy();
  });

  it('renders PieChart with correct data length', () => {
    render(<GenericChartRenderer type="pie" data={mockData} />);
    const el = screen.getByTestId('pie-chart');
    expect(el).toBeTruthy();
    expect(screen.getByText(/Pie Chart: 2/i)).toBeTruthy();
  });

  it('renders Speedometer with first data value', () => {
    render(<GenericChartRenderer type="speedometer" data={mockData} />);
    const el = screen.getByTestId('speedometer');
    expect(el).toBeTruthy();
    expect(screen.getByText(/Speedometer Value: 10/i)).toBeTruthy();
  });

  it('renders Speedometer with default value 0 if data is empty', () => {
    render(<GenericChartRenderer type="speedometer" data={[]} />);
    const el = screen.getByTestId('speedometer');
    expect(el).toBeTruthy();
    expect(screen.getByText(/Speedometer Value: 0/i)).toBeTruthy();
  });
});

import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { ChartType, DataPoint } from '../enums/ChartType';
import { GenericChartRenderer } from './ChartRenderer/ChartRenderer';

vi.mock('../config/ChartConfig', async () => {
  return {
    ChartConfig: {
      bar: {
        component: ({ data }: { data: DataPoint[] }) => (
          <div data-testid="bar-chart">Bar Chart: {data.length}</div>
        ),
        mapProps: (data: DataPoint[]) => ({ data }),
      },
      line: {
        component: ({ data }: { data: DataPoint[] }) => (
          <div data-testid="line-chart">Line Chart: {data.length}</div>
        ),
        mapProps: (data: DataPoint[]) => ({ data }),
      },
      pie: {
        component: ({ data }: { data: DataPoint[] }) => (
          <div data-testid="pie-chart">Pie Chart: {data.length}</div>
        ),
        mapProps: (data: DataPoint[]) => ({ data }),
      },
      speedometer: {
        component: ({ value }: { value: number }) => (
          <div data-testid="speedometer">Speedometer Value: {value}</div>
        ),
        mapProps: (data: DataPoint[]) => ({ value: data[0]?.value ?? 0 }),
      },
    },
  };
});

const mockData = [
  { label: 'A', value: 10 },
  { label: 'B', value: 20 },
];

describe('GenericChartRenderer', () => {
  it('renders BarChart with correct data', () => {
    render(<GenericChartRenderer type="bar" data={mockData} />);
    const el = screen.getByTestId('bar-chart');
    expect(el).toBeTruthy();
    expect(screen.getByText(/Bar Chart: 2/)).toBeTruthy();
  });

  it('renders LineChart with correct data', () => {
    render(<GenericChartRenderer type="line" data={mockData} />);
    const el = screen.getByTestId('line-chart');
    expect(el).toBeTruthy();
    expect(screen.getByText(/Line Chart: 2/)).toBeTruthy();
  });

  it('renders PieChart with correct data', () => {
    render(<GenericChartRenderer type="pie" data={mockData} />);
    const el = screen.getByTestId('pie-chart');
    expect(el).toBeTruthy();
    expect(screen.getByText(/Pie Chart: 2/)).toBeTruthy();
  });

  it('renders Speedometer with correct value', () => {
    render(<GenericChartRenderer type="speedometer" data={mockData} />);
    const el = screen.getByTestId('speedometer');
    expect(el).toBeTruthy();
    expect(screen.getByText(/Speedometer Value: 10/)).toBeTruthy();
  });

  it('renders Speedometer with default 0 if data is empty', () => {
    render(<GenericChartRenderer type="speedometer" data={[]} />);
    const el = screen.getByTestId('speedometer');
    expect(el).toBeTruthy();
    expect(screen.getByText(/Speedometer Value: 0/)).toBeTruthy();
  });

  it('renders fallback for unsupported chart type', () => {
    render(<GenericChartRenderer type={'unknown' as ChartType} data={mockData} />);
    expect(screen.getByText(/Unsupported chart type/i)).toBeTruthy();
  });
});

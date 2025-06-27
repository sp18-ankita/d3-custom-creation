import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { Zone } from '../enums/ChartType';
import { ChartProvider, useChartContext } from './useChartContext';

// Helper consumer component to access context
const TestConsumer = () => {
  const {
    chartType,
    setChartType,
    value,
    setValue,
    min,
    setMin,
    max,
    setMax,
    majorTicks,
    setMajorTicks,
    zonesJson,
    setZonesJson,
    zones,
    setZones,
  } = useChartContext();

  return (
    <div>
      <div data-testid="chartType">{chartType}</div>
      <div data-testid="value">{value}</div>
      <div data-testid="min">{min}</div>
      <div data-testid="max">{max}</div>
      <div data-testid="majorTicks">{majorTicks}</div>
      <div data-testid="zonesJson">{zonesJson}</div>
      <div data-testid="zones">{JSON.stringify(zones)}</div>
      <button onClick={() => setChartType('line')}>Set Line Chart</button>
      <button onClick={() => setValue('99')}>Set Value</button>
      <button onClick={() => setMin('-10')}>Set Min</button>
      <button onClick={() => setMax('150')}>Set Max</button>
      <button onClick={() => setMajorTicks('10')}>Set Major Ticks</button>
      <button onClick={() => setZonesJson('[]')}>Clear Zones JSON</button>
      <button onClick={() => setZones([{ from: 0, to: 50, color: '#000000' }])}>Set Zones</button>
    </div>
  );
};

describe('ChartProvider and useChartContext', () => {
  it('provides default values', () => {
    render(
      <ChartProvider>
        <TestConsumer />
      </ChartProvider>,
    );

    expect(screen.getByTestId('chartType').textContent).toBe('bar');
    expect(screen.getByTestId('value').textContent).toBe('45');
    expect(screen.getByTestId('min').textContent).toBe('0');
    expect(screen.getByTestId('max').textContent).toBe('100');
    expect(screen.getByTestId('majorTicks').textContent).toBe('5');

    const zones = JSON.parse(screen.getByTestId('zones').textContent || '[]') as Zone[];
    expect(zones).toHaveLength(3);
    expect(zones[0].color).toBe('#4caf50');
  });

  it('updates context values correctly', () => {
    render(
      <ChartProvider>
        <TestConsumer />
      </ChartProvider>,
    );

    screen.getByText('Set Line Chart').click();
    screen.getByText('Set Value').click();
    screen.getByText('Set Min').click();
    screen.getByText('Set Max').click();
    screen.getByText('Set Major Ticks').click();
    screen.getByText('Clear Zones JSON').click();
    screen.getByText('Set Zones').click();

    expect(screen.getByTestId('chartType').textContent).toBe('bar');
    expect(screen.getByTestId('value').textContent).toBe('45');
    expect(screen.getByTestId('min').textContent).toBe('0');
    expect(screen.getByTestId('max').textContent).toBe('100');
    expect(screen.getByTestId('majorTicks').textContent).toBe('5');

    const updatedZones = JSON.parse(screen.getByTestId('zones').textContent || '[]') as Zone[];
    expect(updatedZones).toHaveLength(3);
    expect(updatedZones[0].color).toBe('#4caf50');
  });

  it('throws error when useChartContext is used outside provider', () => {
    const consoleError = console.error;
    console.error = () => {}; // suppress expected error logs

    const BrokenConsumer = () => {
      useChartContext();
      return null;
    };

    expect(() => render(<BrokenConsumer />)).toThrow(
      'useChartContext must be used within ChartProvider',
    );

    console.error = consoleError; // restore console
  });
});

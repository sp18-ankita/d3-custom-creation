import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import App from './App';
import { ChartProvider } from './hooks/useChartContext';

const renderWithProvider = () =>
  render(
    <ChartProvider>
      <App />
    </ChartProvider>,
  );

describe('App Component with Context', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.spyOn(window, 'alert').mockImplementation(() => {});
  });

  it('renders chart viewer and default bar chart', () => {
    renderWithProvider();
    expect(screen.getByText(/D3 Chart Viewer/i)).toBeInTheDocument();
    expect(screen.getByText(/Data \(JSON\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Render Chart/i)).toBeInTheDocument();
  });

  it('switches to speedometer mode and shows input controls', () => {
    renderWithProvider();
    const chartTypeDropdown = screen.getByLabelText(/Chart Type/i);
    fireEvent.change(chartTypeDropdown, { target: { value: 'speedometer' } });

    expect(screen.getByLabelText(/Value/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Min/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Major Ticks/)).toBeInTheDocument();
  });

  it('shows error message when speedometer input is invalid', () => {
    renderWithProvider();
    const chartTypeDropdown = screen.getByLabelText(/Chart Type/i);
    fireEvent.change(chartTypeDropdown, { target: { value: 'speedometer' } });

    fireEvent.change(screen.getByLabelText(/Value/), { target: { value: '' } });
    fireEvent.change(screen.getByLabelText(/Min/), { target: { value: '10' } });

    expect(
      screen.getByText(/Please enter valid numeric values for all speedometer fields/i),
    ).toBeInTheDocument();
  });

  it('updates chart data from JSON input', () => {
    renderWithProvider();
    const jsonArea = screen.getByLabelText(/Data \(JSON\)/i);
    const renderBtn = screen.getByText(/Render Chart/i);

    const newJson = JSON.stringify(
      [
        { label: 'X', value: 20 },
        { label: 'Y', value: 40 },
      ],
      null,
      2,
    );

    fireEvent.change(jsonArea, { target: { value: newJson } });
    fireEvent.click(renderBtn);

    expect(screen.queryByText(/Data must be an array/)).not.toBeInTheDocument();
  });

  it('handles invalid chart data JSON gracefully', () => {
    renderWithProvider();
    fireEvent.change(screen.getByLabelText(/Data \(JSON\)/i), {
      target: { value: 'invalid-json' },
    });
    fireEvent.click(screen.getByText(/Render Chart/i));

    expect(window.alert).toHaveBeenCalledWith('Invalid JSON data.');
  });

  it('handles invalid zone JSON gracefully', () => {
    renderWithProvider();
    const chartTypeDropdown = screen.getByLabelText(/Chart Type/i);
    fireEvent.change(chartTypeDropdown, { target: { value: 'speedometer' } });

    fireEvent.change(screen.getByLabelText(/Zones \(JSON\)/i), {
      target: { value: 'invalid-zone' },
    });
    fireEvent.click(screen.getByText(/Validate JSON/i));

    expect(window.alert).toHaveBeenCalledWith('Invalid JSON for zones.');
  });
});

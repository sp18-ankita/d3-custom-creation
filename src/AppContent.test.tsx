import '@testing-library/jest-dom';

import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import AppContent from './AppContent';
import { ChartProvider } from './hooks/useChartContext';

const renderWithProvider = () =>
  render(
    <ChartProvider>
      <AppContent />
    </ChartProvider>,
  );

describe('AppContent', () => {
  it('renders header and chart type selector', () => {
    renderWithProvider();
    expect(screen.getByText(/D3 Chart Viewer/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Chart Type/i)).toBeInTheDocument();
  });

  it('renders JSON input for default chart type (non-speedometer)', () => {
    renderWithProvider();
    expect(screen.getByLabelText(/Data \(JSON\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Render Chart/i)).toBeInTheDocument();
  });

  it('alerts on invalid JSON input', () => {
    renderWithProvider();
    const textarea = screen.getByLabelText(/Data \(JSON\)/i);
    fireEvent.change(textarea, { target: { value: 'invalid json' } });

    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});
    fireEvent.click(screen.getByText(/Render Chart/i));

    expect(alertMock).toBeCalledWith('Invalid JSON data.');
  });

  it('alerts if JSON input is valid but not in expected format', () => {
    renderWithProvider();
    const textarea = screen.getByLabelText(/Data \(JSON\)/i);
    fireEvent.change(textarea, { target: { value: '[{"foo": 1}]' } });

    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});
    fireEvent.click(screen.getByText(/Render Chart/i));

    expect(alertMock).toBeCalledWith(
      'Data must be an array of objects with "label" and "value" properties.',
    );
  });

  it('alerts on invalid zones JSON when validating zones', () => {
    renderWithProvider();

    const selector = screen.getByLabelText(/Chart Type/i);
    fireEvent.change(selector, { target: { value: 'speedometer' } });

    const zonesTextarea = screen.getByLabelText(/Zones \(JSON\)/i);
    fireEvent.change(zonesTextarea, { target: { value: 'not valid' } });

    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});
    fireEvent.click(
      screen.getByRole('button', { name: /validate json/i }), // or just /validate/i
    );

    expect(alertMock).toHaveBeenCalledWith('Invalid JSON for zones.');
  });

  it('alerts if zones JSON is valid but not in correct format', () => {
    renderWithProvider();

    const selector = screen.getByLabelText(/Chart Type/i);
    fireEvent.change(selector, { target: { value: 'speedometer' } });

    const zonesTextarea = screen.getByLabelText(/Zones \(JSON\)/i);
    fireEvent.change(zonesTextarea, {
      target: { value: '[{"from": 0, "to": 50}]' }, // missing "color"
    });

    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});

    fireEvent.click(
      screen.getByRole('button', { name: /validate json/i }), // or just /validate/i
    );

    expect(alertMock).toHaveBeenCalledWith(
      'Zones must be an array of objects with "from", "to" (numbers), and "color" (string).',
    );
  });
});

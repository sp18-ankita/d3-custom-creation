import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import AppContent from './AppContent';
import { ChartProvider } from './hooks/useChartContext';

vi.mock('./widget/WeatherWidget', () => ({
  WeatherWidget: () => <div data-testid="weather-widget">Weather</div>,
}));

describe('AppContent', () => {
  const renderWithRouter = (initialPath = '/') =>
    render(
      <ChartProvider>
        <MemoryRouter initialEntries={[initialPath]}>
          <Routes>
            <Route path="/" element={<AppContent />} />
            <Route path="/about" element={<div>About Page</div>} />
            <Route path="/contact" element={<div>Contact Page</div>} /> {/* Added */}
          </Routes>
        </MemoryRouter>
      </ChartProvider>,
    );

  it('renders chart viewer UI', () => {
    renderWithRouter();

    expect(screen.getByText(/D3 Chart Viewer/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Data \(JSON\)/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Render Chart/i })).toBeInTheDocument();
    expect(screen.getByTestId('weather-widget')).toBeInTheDocument();
  });

  it('renders chart when valid JSON is submitted', () => {
    renderWithRouter();

    const input = screen.getByLabelText(/Data \(JSON\)/i);
    fireEvent.change(input, { target: { value: '[{"label":"X","value":10}]' } });

    fireEvent.click(screen.getByText(/Render Chart/i));

    expect(screen.getByText(/X/i)).toBeInTheDocument(); // GenericChartRenderer output
  });

  it('shows alert on invalid JSON', () => {
    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});
    renderWithRouter();

    const input = screen.getByLabelText(/Data \(JSON\)/i);
    fireEvent.change(input, { target: { value: 'INVALID_JSON' } });

    fireEvent.click(screen.getByText(/Render Chart/i));
    expect(alertMock).toHaveBeenCalledWith('Invalid JSON data.');

    alertMock.mockRestore();
  });

  it('renders speedometer and validates numeric input', async () => {
    renderWithRouter();

    fireEvent.change(screen.getByLabelText(/Chart Type/i), {
      target: { value: 'speedometer' },
    });

    fireEvent.change(screen.getByLabelText(/Value/i), { target: { value: '40' } });
    fireEvent.change(screen.getByLabelText(/Min/i), { target: { value: '0' } });
    fireEvent.change(screen.getByLabelText(/Major Ticks/i), { target: { value: '5' } });

    const zonesJson = JSON.stringify([{ from: 0, to: 50, color: 'green' }]);
    fireEvent.change(screen.getByLabelText(/Zones \(JSON\)/i), {
      target: { value: zonesJson },
    });
  });

  it('navigates to About page when About App button is clicked', async () => {
    renderWithRouter();

    const aboutBtn = screen.getByRole('button', { name: /About App/i });
    fireEvent.click(aboutBtn);

    await waitFor(() => {
      expect(screen.getByText(/About Page/i)).toBeInTheDocument();
    });
  });

  it('navigates to Contact page when Contact Us button is clicked', async () => {
    renderWithRouter();

    const contactBtn = screen.getByRole('button', { name: /Contact Us/i });
    fireEvent.click(contactBtn);

    await waitFor(() => {
      expect(screen.getByText(/Contact Page/i)).toBeInTheDocument();
    });
  });
});

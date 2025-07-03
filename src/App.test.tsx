import '@testing-library/jest-dom';

import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import App from './App';

describe('App', () => {
  it('renders the chart viewer title', () => {
    render(<App />);
    expect(screen.getByText(/D3 Chart Viewer/i)).toBeInTheDocument();
  });

  it('renders the chart type selector', () => {
    render(<App />);
    expect(screen.getByLabelText(/Chart Type/i)).toBeInTheDocument();
  });

  it('renders JSON input for non-speedometer charts', () => {
    render(<App />);
    expect(screen.getByLabelText(/Data \(JSON\)/i)).toBeInTheDocument();
  });

  it('alerts on invalid JSON input', () => {
    render(<App />);
    const textarea = screen.getByLabelText(/Data \(JSON\)/i);
    fireEvent.change(textarea, { target: { value: 'invalid json' } });

    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});
    fireEvent.click(screen.getByText(/Render Chart/i));
    expect(alertMock).toHaveBeenCalledWith('Invalid JSON data.');
  });
});

import '@testing-library/jest-dom';

import { render, screen, waitFor } from '@testing-library/react';

import axios from 'axios';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { WeatherWidget } from './WeatherWidget';

interface OpenWeatherResponse {
  main: {
    temp: number;
  };
  weather: {
    description: string;
    icon: string;
  }[];
  name: string;
}
// Mock axios
vi.mock('axios');

const mockedAxios = axios as unknown as {
  get: (url: string) => Promise<{ data: OpenWeatherResponse }>;
};

describe('WeatherWidget', () => {
  const mockWeatherData = {
    main: { temp: 30 },
    weather: [{ description: 'clear sky', icon: '01d' }],
    name: 'Bhubaneshwar',
  };

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('renders weather data after API call', async () => {
    mockedAxios.get = vi.fn().mockResolvedValue({ data: mockWeatherData });

    render(<WeatherWidget />);

    // Wait for weather data to appear
    await waitFor(() => {
      expect(screen.getByText(/Bhubaneshwar/i)).toBeInTheDocument();
      expect(screen.getByText(/30°C/i)).toBeInTheDocument();
      expect(screen.getByText(/clear sky/i)).toBeInTheDocument();
      expect(screen.getByRole('img')).toHaveAttribute('src', expect.stringContaining('01d.png'));
    });
  });

  it('does not render anything before weather data is fetched', () => {
    mockedAxios.get = vi.fn().mockResolvedValue({ data: mockWeatherData });

    const { container } = render(<WeatherWidget />);
    expect(container).toBeEmptyDOMElement();
  });

  it('handles API errors gracefully', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    mockedAxios.get = vi.fn().mockRejectedValue(new Error('API Error'));

    const { container } = render(<WeatherWidget />);

    await waitFor(() => {
      expect(container).toBeEmptyDOMElement();
      expect(errorSpy).toHaveBeenCalledWith(
        expect.stringContaining('Weather API error:'),
        expect.any(Error),
      );
    });

    errorSpy.mockRestore();
  });
});

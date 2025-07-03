import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { WeatherWidget } from './WeatherWidget';

// Mock axios
vi.mock('axios');
const mockedAxios = axios as unknown as {
  get: ReturnType<typeof vi.fn>;
};

describe('WeatherWidget', () => {
  const mockWeatherResponse = {
    data: {
      main: { temp: 29.5 },
      weather: [{ description: 'clear sky', icon: '01d' }],
      name: 'Bhubaneshwar',
    },
  };

  beforeEach(() => {
    mockedAxios.get = vi.fn().mockResolvedValue(mockWeatherResponse);
  });

  it('renders loading state initially', () => {
    render(<WeatherWidget />);
    expect(screen.getByText(/Loading weather/i)).toBeInTheDocument();
  });

  it('renders weather data correctly after fetch', async () => {
    render(<WeatherWidget />);
    await waitFor(() => {
      expect(screen.getByText(/30/)).toBeInTheDocument();
      expect(screen.getByText(/clear sky/)).toBeInTheDocument();
      expect(screen.getByText(/Bhubaneshwar/)).toBeInTheDocument();
    });
  });

  it('displays correct icon', async () => {
    render(<WeatherWidget />);
    await waitFor(() => {
      const img = screen.getByRole('img');
      expect(img).toHaveAttribute('src', 'https://openweathermap.org/img/wn/01d.png');
      expect(img).toHaveAttribute('alt', 'clear sky');
    });
  });

  it('handles API error gracefully', async () => {
    mockedAxios.get = vi.fn().mockRejectedValue(new Error('API error'));

    render(<WeatherWidget />);
    await waitFor(() => {
      expect(screen.getByText(/Loading weather/i)).toBeInTheDocument();
    });
  });
});

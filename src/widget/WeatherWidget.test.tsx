import '@testing-library/jest-dom';
<<<<<<< HEAD

import { render, screen, waitFor } from '@testing-library/react';

=======
import { render, screen, waitFor } from '@testing-library/react';
>>>>>>> 6c538b3 (Updated the tes cases)
import axios from 'axios';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { WeatherWidget } from './WeatherWidget';

<<<<<<< HEAD
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
=======
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
>>>>>>> 6c538b3 (Updated the tes cases)
});

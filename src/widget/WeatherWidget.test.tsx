import '@testing-library/jest-dom';

import { render, screen, waitFor } from '@testing-library/react';

import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as weatherService from '../services/weatherService';
import { WeatherWidget } from './WeatherWidget';

// Mock the weather service
vi.mock('../services/weatherService');

describe('WeatherWidget', () => {
  const mockUseWeatherAPI = {
    fetchWeather: vi.fn().mockResolvedValue(null),
    data: {
      temp: 30,
      description: 'clear sky',
      city: 'Bhubaneshwar',
      icon: 'https://openweathermap.org/img/wn/01d.png',
    },
    loading: false,
    error: null,
    reset: vi.fn(),
  };

  beforeEach(() => {
    vi.resetAllMocks();
    mockUseWeatherAPI.fetchWeather.mockResolvedValue(null);
    vi.mocked(weatherService.useWeatherAPI).mockReturnValue(mockUseWeatherAPI);
  });

  it('renders weather data after API call', async () => {
    render(<WeatherWidget />);

    // Wait for weather data to appear
    await waitFor(() => {
      expect(screen.getByText(/Bhubaneshwar/i)).toBeInTheDocument();
      expect(screen.getByText(/30°C/i)).toBeInTheDocument();
      expect(screen.getByText(/clear sky/i)).toBeInTheDocument();
      expect(screen.getByRole('img')).toHaveAttribute('src', expect.stringContaining('01d.png'));
    });
  });

  it('does not render anything when loading', () => {
    const loadingMock = {
      ...mockUseWeatherAPI,
      loading: true,
      data: null,
    };
    loadingMock.fetchWeather.mockResolvedValue(null);
    vi.mocked(weatherService.useWeatherAPI).mockReturnValue(loadingMock);

    const { container } = render(<WeatherWidget />);
    expect(container).toBeEmptyDOMElement();
  });

  it('does not render anything when there is an error', () => {
    const errorMock = {
      ...mockUseWeatherAPI,
      error: { message: 'API Error', name: 'ApiError' },
      data: null,
    };
    errorMock.fetchWeather.mockResolvedValue(null);
    vi.mocked(weatherService.useWeatherAPI).mockReturnValue(errorMock);

    const { container } = render(<WeatherWidget />);
    expect(container).toBeEmptyDOMElement();
  });

  it('does not render anything when data is null', () => {
    const nullDataMock = {
      ...mockUseWeatherAPI,
      data: null,
    };
    nullDataMock.fetchWeather.mockResolvedValue(null);
    vi.mocked(weatherService.useWeatherAPI).mockReturnValue(nullDataMock);

    const { container } = render(<WeatherWidget />);
    expect(container).toBeEmptyDOMElement();
  });

  it('calls fetchWeather on mount', () => {
    render(<WeatherWidget />);
    expect(mockUseWeatherAPI.fetchWeather).toHaveBeenCalledWith('Bhubaneshwar');
  });
});

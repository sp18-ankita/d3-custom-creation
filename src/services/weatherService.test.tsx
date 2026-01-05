import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fetchWeatherData, useWeatherAPI } from './weatherService';

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

vi.mock('../hooks/useDataFetcher', () => ({
  useDataFetcher: vi.fn(() => ({
    get: vi.fn(),
    data: null,
    loading: false,
    error: null,
    reset: vi.fn(),
  })),
}));

describe('weatherService', () => {
  const mockOpenWeatherResponse = {
    main: { temp: 25.5 },
    weather: [{ description: 'partly cloudy', icon: '02d' }],
    name: 'Test City',
  };

  const expectedWeatherData = {
    temp: 25.5,
    description: 'partly cloudy',
    city: 'Test City',
    icon: 'https://openweathermap.org/img/wn/02d.png',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch.mockReset();
  });

  describe('fetchWeatherData (legacy)', () => {
    it('should fetch weather data successfully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockOpenWeatherResponse,
      });

      const result = await fetchWeatherData('TestCity');

      expect(result).toEqual(expectedWeatherData);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('TestCity'),
        expect.any(Object),
      );
    });

    it('should use default city when no city provided', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockOpenWeatherResponse,
      });

      await fetchWeatherData();

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('Bhubaneshwar'),
        expect.any(Object),
      );
    });

    it('should handle API errors gracefully', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      mockFetch.mockRejectedValueOnce(new Error('API Error'));

      const result = await fetchWeatherData('TestCity');

      expect(result).toBeNull();
      expect(consoleSpy).toHaveBeenCalledWith('Weather API error:', expect.any(Error));

      consoleSpy.mockRestore();
    });

    it('should handle HTTP errors', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      const result = await fetchWeatherData('TestCity');

      expect(result).toBeNull();
      expect(consoleSpy).toHaveBeenCalledWith('Weather API error:', expect.any(Error));

      consoleSpy.mockRestore();
    });
  });

  describe('useWeatherAPI', () => {
    it('should create hook without errors', () => {
      const { result } = renderHook(() => useWeatherAPI());

      expect(result.current.fetchWeather).toBeDefined();
      expect(typeof result.current.fetchWeather).toBe('function');
      expect(result.current.reset).toBeDefined();
    });
  });
});

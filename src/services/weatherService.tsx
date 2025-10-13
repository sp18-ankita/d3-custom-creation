import { useCallback } from 'react';
import { useDataFetcher } from '../hooks/useDataFetcher';

// Weather data interfaces
export interface WeatherData {
  temp: number;
  description: string;
  city: string;
  icon: string;
}

interface OpenWeatherAPIResponse {
  main: { temp: number };
  weather: { description: string; icon: string }[];
  name: string;
}

/**
 * Hook for fetching weather data using the OpenWeather API with caching
 */
export const useWeatherAPI = () => {
  const fetcher = useDataFetcher<WeatherData>({
    cache: true,
    cacheConfig: {
      ttl: 10 * 60 * 1000, // 10 minutes cache
      storage: 'sessionStorage',
    },
  });

  const fetchWeather = useCallback(
    async (city = 'Bhubaneshwar'): Promise<WeatherData | null> => {
      const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
      const baseUrl = import.meta.env.VITE_WEATHER_API_URL;

      if (!apiKey || !baseUrl) {
        console.error('Weather API configuration missing');
        return null;
      }

      const params = {
        q: city,
        units: 'metric',
        appid: apiKey,
      };

      // Use caching with a custom cache key based on city
      const response = await fetcher.get(
        baseUrl,
        params,
        undefined, // headers
        true, // use cache
        `weather_${city.toLowerCase()}`, // custom cache key
      );

      if (response) {
        const data = response as unknown as OpenWeatherAPIResponse;
        return {
          temp: data.main.temp,
          description: data.weather[0].description,
          city: data.name,
          icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`,
        };
      }

      return null;
    },
    [fetcher],
  );

  return {
    fetchWeather,
    data: fetcher.data,
    loading: fetcher.loading,
    error: fetcher.error,
    reset: fetcher.reset,
  };
};

// Legacy function for backward compatibility
export const fetchWeatherData = async (city = 'Bhubaneshwar'): Promise<WeatherData | null> => {
  try {
    const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
    const baseUrl = import.meta.env.VITE_WEATHER_API_URL;

    if (!apiKey || !baseUrl) {
      console.error('Weather API configuration missing');
      return null;
    }

    const url = `${baseUrl}?q=${city}&units=metric&appid=${apiKey}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`);
    }

    const data: OpenWeatherAPIResponse = await response.json();

    return {
      temp: data.main.temp,
      description: data.weather[0].description,
      city: data.name,
      icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`,
    };
  } catch (error) {
    console.error('Weather API error:', error);
    return null;
  }
};

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
 * Hook for fetching weather data using the OpenWeather API
 */
export const useWeatherAPI = () => {
  const fetcher = useDataFetcher<WeatherData>();

  // Memoize the API key and base URL
  const config = useCallback(() => {
    const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
    const baseUrl = import.meta.env.VITE_WEATHER_API_URL;
    return { apiKey, baseUrl };
  }, []);

  // Memoize the fetch function
  const fetchWeather = useCallback(
    async (city = 'Bhubaneshwar'): Promise<WeatherData | null> => {
      const { apiKey, baseUrl } = config();

      if (!apiKey || !baseUrl) {
        console.error('Weather API configuration missing');
        return null;
      }

      const params = {
        q: city,
        units: 'metric',
        appid: apiKey,
      };

      try {
        const response = await fetcher.get(baseUrl, params);

        if (response) {
          const data = response as unknown as OpenWeatherAPIResponse;
          return {
            temp: data.main.temp,
            description: data.weather[0].description,
            city: data.name,
            icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`,
          };
        }
      } catch (error) {
        console.error('Weather API fetch error:', error);
      }

      return null;
    },
    [config, fetcher],
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

    const url = `${baseUrl}?q=${encodeURIComponent(city)}&units=metric&appid=${apiKey}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: 'omit',
      mode: 'cors',
    });

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

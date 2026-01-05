import { useCallback, useRef } from 'react';
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

// Cache for weather data to prevent excessive API calls
const weatherCache = new Map<string, { data: WeatherData; timestamp: number }>();
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

// Rate limiting
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 5000; // 5 seconds between requests

/**
 * Hook for fetching weather data using the OpenWeather API
 */
export const useWeatherAPI = () => {
  const fetcher = useDataFetcher<WeatherData>();
  const requestInProgress = useRef(false);

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

      // Rate limiting
      const now = Date.now();
      if (now - lastRequestTime < MIN_REQUEST_INTERVAL) {
        console.log('Rate limiting: too many requests, using cached or returning null');
        return cached?.data || null;
      }

      try {
        requestInProgress.current = true;
        lastRequestTime = now;

        // Use environment variables or fallback to direct API
        const apiKey = import.meta.env.VITE_WEATHER_API_KEY || 'f7429ca057dcb2b75a0e591ee9743a7e';
        const baseUrl =
          import.meta.env.VITE_WEATHER_API_URL || 'https://api.openweathermap.org/data/2.5/weather';

        const params = {
          q: city,
          units: 'metric',
          appid: apiKey,
        };

        const response = await fetcher.get(baseUrl, params);

        if (response) {
          const data = response as unknown as OpenWeatherAPIResponse;
          const weatherData: WeatherData = {
            temp: data.main.temp,
            description: data.weather[0].description,
            city: data.name,
            icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`,
          };

          // Cache the result
          weatherCache.set(cacheKey, { data: weatherData, timestamp: now });
          return weatherData;
        }

        return null;
      } catch (error) {
        console.error('Weather API error:', error);

        // Return cached data if available during error
        const cached = weatherCache.get(cacheKey);
        if (cached) {
          console.log('Using cached data due to API error');
          return cached.data;
        }

        // Return mock data as fallback
        const fallbackData: WeatherData = {
          temp: 25,
          description: 'partly cloudy',
          city: city,
          icon: 'https://openweathermap.org/img/wn/02d.png',
        };

        console.log('Using fallback weather data');
        return fallbackData;
      } finally {
        requestInProgress.current = false;
      }
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

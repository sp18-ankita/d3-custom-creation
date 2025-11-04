import React, { useEffect, useState } from 'react';
import { useWeatherAPI } from '../services/weatherService';

export const WeatherWidget: React.FC = () => {
  const { fetchWeather, data: weather, loading, error } = useWeatherAPI();
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const fetchData = async () => {
      try {
        await fetchWeather('Bhubaneshwar');
      } catch (err) {
        console.error('Weather fetch error:', err);
        if (retryCount < maxRetries) {
          timeoutId = setTimeout(() => {
            setRetryCount(prev => prev + 1);
          }, 5000); // Retry after 5 seconds
        }
      }
    };

    fetchData();

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [fetchWeather, retryCount]); // Only retry when fetchWeather changes or retryCount updates

  // Don't render anything if there's an error and we've exceeded retries, or if there's no data
  if ((error && retryCount >= maxRetries) || !weather) return null;

  // Show loading state only on first load
  if (loading && !weather) return null;

  return (
    <div
      style={{
        position: 'absolute',
        top: 16,
        right: 20,
        backgroundColor: '#ffffffcc',
        backdropFilter: 'blur(6px)',
        padding: '10px 14px',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        fontSize: 14,
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        zIndex: 1000,
      }}
      data-testid="weather-widget"
    >
      <img src={weather.icon} alt={weather.description} width={36} height={36} />
      <div style={{ lineHeight: '1.2' }}>
        <strong>{weather.city}</strong>
        <div>{Math.round(weather.temp)}°C</div>
        <div style={{ textTransform: 'capitalize', fontSize: '12px' }}>{weather.description}</div>
      </div>
    </div>
  );
};

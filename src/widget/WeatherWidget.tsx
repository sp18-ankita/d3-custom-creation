import React, { useEffect } from 'react';
import { useWeatherAPI } from '../services/weatherService';

/**
 * WeatherWidget component - currently disabled to prevent multiple API calls
 *
 * This widget fetches weather data from OpenWeatherMap API and displays it.
 * It has been temporarily commented out in AppContent.tsx and About.tsx
 * to prevent multiple simultaneous API calls.
 *
 * To re-enable:
 * 1. Uncomment the import and usage in either AppContent.tsx OR About.tsx (not both)
 * 2. Ensure you have valid VITE_WEATHER_API_KEY and VITE_WEATHER_API_URL in your .env
 */
export const WeatherWidget: React.FC = () => {
  const { fetchWeather, data: weather, loading, error } = useWeatherAPI();

  useEffect(() => {
    fetchWeather('Bhubaneshwar').catch(err => {
      console.error('Weather fetch error:', err);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array to run only once on mount

  // Don't render anything while loading or if there's an error
  if (loading || error || !weather) return null;

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

import React, { useEffect, useState } from 'react';
import { useWeatherAPI, type WeatherData } from '../services/weatherService';

export const WeatherWidget: React.FC = () => {
  const { fetchWeather, loading, error } = useWeatherAPI();
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [hasInitialized, setHasInitialized] = useState(false);

  useEffect(() => {
    if (!hasInitialized) {
      setHasInitialized(true);
      fetchWeather('Bhubaneshwar')
        .then(data => {
          if (data) {
            setWeather(data);
          }
        })
        .catch(err => {
          console.error('Weather fetch error:', err);
        });
    }
  }, [fetchWeather, hasInitialized]);

  // Don't render anything while loading initially
  if (!hasInitialized || (loading && !weather)) return null;

  // Show error state with fallback data
  if (error && !weather) {
    return (
      <div
        style={{
          position: 'absolute',
          top: 16,
          right: 20,
          backgroundColor: '#ffebee',
          backdropFilter: 'blur(6px)',
          padding: '10px 14px',
          borderRadius: '12px',
          fontSize: 14,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          zIndex: 1000,
          color: '#c62828',
        }}
        data-testid="weather-widget-error"
      >
        ⚠️ Weather unavailable
      </div>
    );
  }

  // Don't render if no weather data
  if (!weather) return null;

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

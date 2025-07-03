<<<<<<< HEAD
=======
// src/components/WeatherWidget.tsx
>>>>>>> 6c538b3 (Updated the tes cases)
import axios from 'axios';
import React, { useEffect, useState } from 'react';

interface WeatherData {
  temp: number;
  description: string;
  city: string;
  icon: string;
}

export const WeatherWidget: React.FC = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
<<<<<<< HEAD
        const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
        const city = 'Bhubaneshwar';
        const url = `${import.meta.env.VITE_WEATHER_API_URL}?q=${city}&units=metric&appid=${apiKey}`;
=======
        const apiKey = 'f7429ca057dcb2b75a0e591ee9743a7e'; // Replace with your OpenWeatherMap API key
        const city = 'Bhubaneshwar'; // You can make this dynamic later
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

>>>>>>> 6c538b3 (Updated the tes cases)
        const response = await axios.get(url);
        const data = response.data;

        setWeather({
          temp: data.main.temp,
          description: data.weather[0].description,
          city: data.name,
          icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`,
        });
      } catch (error) {
        console.error('Weather API error:', error);
      }
    };

    fetchWeather();
  }, []);

<<<<<<< HEAD
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
=======
  if (!weather) return <div>Loading weather...</div>;

  return (
    <div style={{ textAlign: 'right', position: 'absolute', top: 20, right: 20 }}>
      <div style={{ backgroundColor: '#f0f0f0', padding: '10px 15px', borderRadius: 8 }}>
        <strong>{weather.city}</strong>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
          <img src={weather.icon} alt={weather.description} />
          <span>
            {Math.round(weather.temp)}°C, {weather.description}
          </span>
        </div>
>>>>>>> 6c538b3 (Updated the tes cases)
      </div>
    </div>
  );
};

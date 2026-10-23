import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { CloudSun, Droplets, Wind } from 'lucide-react';
import './WeatherPage.css';

type WeatherPayload = {
  current: { temperature_2m: number; relative_humidity_2m: number; weather_code: number; wind_speed_10m: number };
  daily: { time: string[]; temperature_2m_max: number[]; temperature_2m_min: number[]; precipitation_sum: number[] };
};

const WEATHER_URL =
  'https://api.open-meteo.com/v1/forecast?latitude=11.0168&longitude=76.9558' +
  '&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m' +
  '&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=Asia%2FKolkata';

export const WeatherPage: React.FC = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['farm-weather', 'coimbatore'],
    queryFn: async () => {
      const response = await fetch(WEATHER_URL);
      if (!response.ok) throw new Error('Weather service unavailable');
      return (await response.json()) as WeatherPayload;
    },
    staleTime: 15 * 60 * 1000,
  });

  return (
    <div className="farm-weather-page">
      <header className="farm-weather-header">
        <h1>Farm Weather</h1>
        <p>Current conditions and 7-day outlook for Coimbatore to help plan irrigation, spraying and harvest.</p>
      </header>

      {isLoading && <p className="farm-weather-status">Loading weather…</p>}
      {isError && <p className="farm-weather-status">Weather is unavailable right now. Please try again shortly.</p>}

      {data && (
        <>
          <section className="farm-weather-current" aria-label="Current weather">
            <CloudSun size={56} />
            <strong>{Math.round(data.current.temperature_2m)}°C</strong>
            <span><Droplets size={16} /> Humidity {data.current.relative_humidity_2m}%</span>
            <span><Wind size={16} /> Wind {Math.round(data.current.wind_speed_10m)} km/h</span>
          </section>

          <section className="farm-weather-forecast" aria-label="7 day forecast">
            {data.daily.time.map((day, i) => (
              <div className="farm-weather-day" key={day}>
                <span>{new Date(day).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}</span>
                <strong>{Math.round(data.daily.temperature_2m_max[i])}° / {Math.round(data.daily.temperature_2m_min[i])}°</strong>
                <small>Rain {data.daily.precipitation_sum[i]} mm</small>
              </div>
            ))}
          </section>
        </>
      )}
    </div>
  );
};

export default WeatherPage;

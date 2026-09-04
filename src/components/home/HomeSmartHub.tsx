import React from 'react';
import { ArrowRight, CalendarDays, ChartNoAxesCombined, CloudSun, Leaf, ShieldCheck, Smartphone, Sprout } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

type CurrentWeather = { temperature_2m: number; relative_humidity_2m: number; weather_code: number; wind_speed_10m: number };

const weatherLabel = (code: number) => {
  if (code === 0) return 'Clear sky';
  if (code <= 3) return 'Partly cloudy';
  if (code <= 48) return 'Foggy';
  if (code <= 67) return 'Rain expected';
  if (code <= 77) return 'Wintry showers';
  if (code <= 82) return 'Rain showers';
  if (code <= 86) return 'Snow showers';
  return 'Thunderstorms';
};

const WeatherSnapshot: React.FC = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['home-current-weather', 'coimbatore'],
    queryFn: async () => {
      const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=11.0168&longitude=76.9558&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=Asia%2FKolkata');
      if (!response.ok) throw new Error('Weather service unavailable');
      const payload = await response.json() as { current: CurrentWeather };
      return payload.current;
    },
    staleTime: 15 * 60 * 1000,
    refetchInterval: 30 * 60 * 1000,
    retry: 2,
  });

  return <>
    <p className="smart-hub-weather-copy">{data ? `${weatherLabel(data.weather_code)} · Humidity ${data.relative_humidity_2m}% · Wind ${Math.round(data.wind_speed_10m)} km/h` : 'Current Coimbatore weather and farm conditions.'}</p>
    <div className="smart-hub-weather-art" aria-label={data ? `${Math.round(data.temperature_2m)} degrees Celsius` : 'Loading weather'}>
      <CloudSun size={61} fill="white" />
      <span>{isLoading ? '--' : `${Math.round(data?.temperature_2m ?? 28)}°C`}<small>Coimbatore</small></span>
    </div>
  </>;
};

const tools = [
  {
    theme: 'doctor',
    icon: <Sprout size={19} />,
    title: 'Crop Doctor',
    heading: 'Identify Crop Problems',
    description: 'Upload crop photo & get expert guidance instantly.',
    action: 'Ask Crop Doctor',
    to: '/services/farm-consultancy',
    art: (
      <div className="smart-hub-phone" aria-hidden="true">
        <Smartphone size={68} strokeWidth={1.7} />
        <span><Leaf size={18} fill="currentColor" /><ShieldCheck size={12} /></span>
      </div>
    ),
  },
  {
    theme: 'calendar',
    icon: <CalendarDays size={19} />,
    title: 'Crop Calendar',
    heading: 'Plan Your Crop Season',
    description: 'Get crop-wise schedule for sowing, irrigation, fertilizer & harvesting.',
    action: 'View Calendar',
    to: '/services/farm-development',
    art: (
      <div className="smart-hub-calendar-art" aria-hidden="true">
        <Sprout size={33} />
        <CalendarDays size={61} fill="white" />
      </div>
    ),
  },
  {
    theme: 'weather',
    icon: <CloudSun size={19} />,
    title: 'Weather Update',
    heading: 'Live Farm Weather',
    description: 'Live weather loading…',
    action: 'Check Weather',
    to: '/services',
    art: null,
  },
  {
    theme: 'market',
    icon: <ChartNoAxesCombined size={19} />,
    title: 'Daily Market Price',
    heading: "Today's Agriculture Prices",
    description: 'Check daily market prices of crops, seeds, fertilizers and more.',
    action: 'View Market Prices',
    to: '/products',
    art: <ChartNoAxesCombined className="smart-hub-market-art" size={67} aria-hidden="true" />,
  },
];

export const HomeSmartHub: React.FC = () => (
  <section className="smart-hub-section" aria-labelledby="smart-hub-title">
    <header className="smart-hub-header">
      <h2 id="smart-hub-title">Farmer Smart Hub</h2>
      <p>Smart tools and real-time information to help you make the right farming decisions.</p>
    </header>

    <div className="smart-hub-grid">
      {tools.map((tool) => (
        <article className={`smart-hub-card smart-hub-card--${tool.theme}`} key={tool.title}>
          <div className="smart-hub-card-title">{tool.icon}<h3>{tool.title}</h3></div>
          <h4>{tool.heading}</h4>
          {tool.theme === 'weather' ? <WeatherSnapshot /> : <p>{tool.description}</p>}
          {tool.art}
          <Link className="smart-hub-action" to={tool.to}>{tool.action}<ArrowRight size={15} /></Link>
        </article>
      ))}
    </div>
  </section>
);

export default HomeSmartHub;

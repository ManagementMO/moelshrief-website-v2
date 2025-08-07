import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Cloud, CloudRain, CloudSnow, CloudLightning, Sun, Moon, CloudDrizzle, Wind, Droplets, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import ENV from '@/config/env';

interface WeatherData {
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
  };
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
  wind: {
    speed: number;
  };
  name: string;
  sys: {
    country: string;
  };
}

const MiniWeatherCard: React.FC = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Get user's location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
        },
        (err) => {
          setError("Location error");
          // Default to Waterloo, ON as fallback
          setLocation({
            lat: 43.4643,
            lon: -80.5204,
          });
        }
      );
    } else {
      setError("Geolocation unsupported");
      // Default to Waterloo, ON as fallback
      setLocation({
        lat: 43.4643,
        lon: -80.5204,
      });
    }
  }, []);

  // Fetch weather data when location is available
  useEffect(() => {
    if (location) {
      fetchWeatherData();
    }
  }, [location]);

  const fetchWeatherData = async () => {
    if (!location) return;

    try {
      setLoading(true);
      if (!ENV.WEATHER_API_KEY) {
        throw new Error('Missing OpenWeatherMap API key (VITE_WEATHER_API_KEY)');
      }
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${location.lat}&lon=${location.lon}&units=metric&appid=${ENV.WEATHER_API_KEY}`
      );

      if (!response.ok) {
        throw new Error('Weather data not available');
      }

      const data = await response.json();
      setWeatherData(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch weather data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Get appropriate weather icon based on weather condition
  const getWeatherIcon = () => {
    if (!weatherData) return <Cloud className="w-5 h-5 text-blue-400" />;

    const weatherId = weatherData.weather[0].id;
    const isDay = weatherData.weather[0].icon.includes('d');

    // Weather condition codes: https://openweathermap.org/weather-conditions
    if (weatherId >= 200 && weatherId < 300) {
      return <CloudLightning className="w-5 h-5 text-yellow-400" />; // Thunderstorm
    } else if (weatherId >= 300 && weatherId < 400) {
      return <CloudDrizzle className="w-5 h-5 text-blue-400" />; // Drizzle
    } else if (weatherId >= 500 && weatherId < 600) {
      return <CloudRain className="w-5 h-5 text-blue-500" />; // Rain
    } else if (weatherId >= 600 && weatherId < 700) {
      return <CloudSnow className="w-5 h-5 text-blue-200" />; // Snow
    } else if (weatherId >= 700 && weatherId < 800) {
      return <Wind className="w-5 h-5 text-gray-400" />; // Atmosphere (fog, mist, etc.)
    } else if (weatherId === 800) {
      return isDay
        ? <Sun className="w-5 h-5 text-yellow-500" />
        : <Moon className="w-5 h-5 text-gray-300" />; // Clear sky
    } else {
      return <Cloud className="w-5 h-5 text-gray-400" />; // Clouds
    }
  };

  // Get background gradient based on weather and time
  const getBackgroundGradient = () => {
    if (!weatherData) return 'from-blue-500/20 to-purple-500/20';

    const weatherId = weatherData.weather[0].id;
    const isDay = weatherData.weather[0].icon.includes('d');

    if (weatherId >= 200 && weatherId < 300) {
      return 'from-gray-700/30 to-gray-900/30'; // Thunderstorm
    } else if (weatherId >= 300 && weatherId < 600) {
      return 'from-blue-600/30 to-blue-800/30'; // Rain
    } else if (weatherId >= 600 && weatherId < 700) {
      return 'from-blue-200/30 to-blue-400/30'; // Snow
    } else if (weatherId === 800) {
      return isDay
        ? 'from-blue-400/20 to-cyan-300/20' // Clear day
        : 'from-indigo-900/30 to-purple-900/30'; // Clear night
    } else {
      return isDay
        ? 'from-blue-500/20 to-gray-400/20' // Cloudy day
        : 'from-gray-700/30 to-gray-900/30'; // Cloudy night
    }
  };

  return (
    <motion.div
      className="absolute -top-14 left-1/2 transform -translate-x-1/2 z-10 w-full max-w-[180px]"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -4 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <div
        className={cn(
          "overflow-hidden backdrop-blur-md border border-white/10 rounded-lg p-2",
          "bg-gradient-to-br",
          getBackgroundGradient()
        )}
        style={{
          boxShadow: isHovered
            ? '0 10px 20px rgba(0, 0, 0, 0.3), 0 0 10px rgba(168, 85, 247, 0.2), inset 0 0 0 1px rgba(255, 255, 255, 0.1)'
            : '0 5px 15px rgba(0, 0, 0, 0.2), inset 0 0 0 1px rgba(255, 255, 255, 0.05)',
          transition: 'box-shadow 0.4s ease-out, transform 0.4s ease-out',
        }}
      >
        {loading ? (
          <div className="flex items-center justify-center py-1.5">
            <div className="animate-pulse flex items-center gap-2">
              <div className="h-5 w-5 bg-white/10 rounded-full"></div>
              <div className="h-3 w-16 bg-white/10 rounded"></div>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-between py-1.5 px-2">
            <div className="flex items-center gap-1.5">
              <Cloud className="w-5 h-5 text-gray-400" />
              <span className="text-white/80 text-xs">{error}</span>
            </div>
            <motion.button
              whileHover={{ scale: 1.1, rotate: 180 }}
              transition={{ duration: 0.5 }}
              onClick={fetchWeatherData}
              className="p-1 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              title="Retry"
            >
              <RefreshCw className="w-3 h-3 text-white/70" />
            </motion.button>
          </div>
        ) : weatherData && (
          <div className="flex items-center justify-between py-1 px-2">
            <div className="flex items-center gap-1.5">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {getWeatherIcon()}
              </motion.div>
              <div>
                <div className="flex items-center">
                  <span className="text-sm font-bold text-white">
                    {Math.round(weatherData.main.temp)}°C
                  </span>
                </div>
                <span className="text-white/70 text-xs">
                  {weatherData.name}
                </span>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <div className="flex items-center gap-1">
                <Droplets className="w-3 h-3 text-blue-400" />
                <span className="text-white/80 text-xs">
                  {weatherData.main.humidity}%
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Wind className="w-3 h-3 text-gray-400" />
                <span className="text-white/80 text-xs">
                  {Math.round(weatherData.wind.speed * 3.6)} km/h
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default MiniWeatherCard;

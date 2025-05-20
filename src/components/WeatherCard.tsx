import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Cloud, CloudRain, CloudSnow, CloudLightning, Sun, Moon, CloudDrizzle, Wind, Droplets, Thermometer, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from '@/lib/utils';
import ENV from '@/config/env';

interface WeatherData {
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
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

const WeatherCard: React.FC = () => {
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
          setError("Unable to retrieve your location. Using default location.");
          // Default to Waterloo, ON as fallback
          setLocation({
            lat: 43.4643,
            lon: -80.5204,
          });
        }
      );
    } else {
      setError("Geolocation is not supported by your browser. Using default location.");
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
    if (!weatherData) return <Cloud className="w-12 h-12 text-blue-400" />;

    const weatherId = weatherData.weather[0].id;
    const isDay = weatherData.weather[0].icon.includes('d');

    // Weather condition codes: https://openweathermap.org/weather-conditions
    if (weatherId >= 200 && weatherId < 300) {
      return <CloudLightning className="w-12 h-12 text-yellow-400" />; // Thunderstorm
    } else if (weatherId >= 300 && weatherId < 400) {
      return <CloudDrizzle className="w-12 h-12 text-blue-400" />; // Drizzle
    } else if (weatherId >= 500 && weatherId < 600) {
      return <CloudRain className="w-12 h-12 text-blue-500" />; // Rain
    } else if (weatherId >= 600 && weatherId < 700) {
      return <CloudSnow className="w-12 h-12 text-blue-200" />; // Snow
    } else if (weatherId >= 700 && weatherId < 800) {
      return <Wind className="w-12 h-12 text-gray-400" />; // Atmosphere (fog, mist, etc.)
    } else if (weatherId === 800) {
      return isDay
        ? <Sun className="w-12 h-12 text-yellow-500" />
        : <Moon className="w-12 h-12 text-gray-300" />; // Clear sky
    } else {
      return <Cloud className="w-12 h-12 text-gray-400" />; // Clouds
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
      className="w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -8 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card
        className={cn(
          "overflow-hidden backdrop-blur-md border border-white/10",
          "bg-gradient-to-br",
          getBackgroundGradient()
        )}
        style={{
          boxShadow: isHovered
            ? '0 20px 40px rgba(0, 0, 0, 0.4), 0 0 20px rgba(168, 85, 247, 0.2), inset 0 0 0 1px rgba(255, 255, 255, 0.1)'
            : '0 10px 30px rgba(0, 0, 0, 0.3), inset 0 0 0 1px rgba(255, 255, 255, 0.05)',
          transition: 'box-shadow 0.4s ease-out, transform 0.4s ease-out',
        }}
      >
        {loading ? (
          <CardContent className="p-6 flex flex-col items-center justify-center min-h-[200px]">
            <div className="animate-pulse flex flex-col items-center gap-4">
              <div className="h-12 w-12 bg-white/10 rounded-full"></div>
              <div className="h-4 w-24 bg-white/10 rounded"></div>
              <div className="h-3 w-32 bg-white/10 rounded"></div>
            </div>
          </CardContent>
        ) : error ? (
          <CardContent className="p-6 flex flex-col items-center justify-center min-h-[200px]">
            <Cloud className="w-12 h-12 text-gray-400 mb-2" />
            <p className="text-white/80 text-center">{error}</p>
            <button
              onClick={fetchWeatherData}
              className="mt-4 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-md text-white/80 text-sm transition-colors"
            >
              Retry
            </button>
          </CardContent>
        ) : weatherData && (
          <>
            <CardHeader className="p-6 pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl font-bold text-white">
                    {weatherData.name}, {weatherData.sys.country}
                  </CardTitle>
                  <CardDescription className="text-white/70">
                    {weatherData.weather[0].description.charAt(0).toUpperCase() +
                     weatherData.weather[0].description.slice(1)}
                  </CardDescription>
                </div>
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {getWeatherIcon()}
                </motion.div>
              </div>
            </CardHeader>
            <CardContent className="p-6 pt-2">
              <div className="flex items-end gap-2 mb-4">
                <span className="text-4xl font-bold text-white">
                  {Math.round(weatherData.main.temp)}°C
                </span>
                <span className="text-white/70 text-sm mb-1">
                  Feels like {Math.round(weatherData.main.feels_like)}°C
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="flex items-center gap-2">
                  <Droplets className="w-4 h-4 text-blue-400" />
                  <span className="text-white/80 text-sm">
                    Humidity: {weatherData.main.humidity}%
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Wind className="w-4 h-4 text-gray-400" />
                  <span className="text-white/80 text-sm">
                    Wind: {Math.round(weatherData.wind.speed * 3.6)} km/h
                  </span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0 flex justify-between items-center">
              <p className="text-xs text-white/50">
                Last updated: {new Date().toLocaleTimeString()}
              </p>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 180 }}
                transition={{ duration: 0.5 }}
                onClick={fetchWeatherData}
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                title="Refresh weather data"
              >
                <RefreshCw className="w-3.5 h-3.5 text-white/70" />
              </motion.button>
            </CardFooter>
          </>
        )}

        {/* Enhanced RTX Effects */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{
            opacity: isHovered ? 1 : 0,
          }}
          transition={{ duration: 0.5 }}
        >
          {/* Top edge glow */}
          <div
            className="absolute top-0 left-0 right-0 h-[1px]"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(168, 85, 247, 0.5), transparent)',
              boxShadow: '0 0 10px rgba(168, 85, 247, 0.5), 0 0 20px rgba(168, 85, 247, 0.3)',
            }}
          />

          {/* Bottom edge glow */}
          <div
            className="absolute bottom-0 left-0 right-0 h-[1px]"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.5), transparent)',
              boxShadow: '0 0 10px rgba(59, 130, 246, 0.5), 0 0 20px rgba(59, 130, 246, 0.3)',
            }}
          />

          {/* Corner accents */}
          <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 rounded-tl-lg" style={{ borderColor: 'rgba(168, 85, 247, 0.5)' }} />
          <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 rounded-tr-lg" style={{ borderColor: 'rgba(168, 85, 247, 0.5)' }} />
          <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 rounded-bl-lg" style={{ borderColor: 'rgba(59, 130, 246, 0.5)' }} />
          <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 rounded-br-lg" style={{ borderColor: 'rgba(59, 130, 246, 0.5)' }} />
        </motion.div>
      </Card>
    </motion.div>
  );
};

export default WeatherCard;

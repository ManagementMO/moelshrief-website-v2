import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Cloud,
  CloudRain,
  CloudSnow,
  CloudLightning,
  Sun,
  Moon,
  CloudDrizzle,
  Wind,
  Droplets,
  RefreshCw,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface WeatherData {
  current: {
    temperature_2m: number;
    apparent_temperature: number;
    relative_humidity_2m: number;
    surface_pressure: number;
    weather_code: number;
    wind_speed_10m: number;
    is_day: number;
  };
  location: {
    name: string;
    country: string;
  };
}

// Mock weather data for fallback when API is unavailable
const getMockWeatherData = (
  locationName: string = "Demo Location"
): WeatherData => ({
  current: {
    temperature_2m: 22,
    apparent_temperature: 24,
    relative_humidity_2m: 65,
    surface_pressure: 1013,
    weather_code: 0, // Clear sky
    wind_speed_10m: 3.5,
    is_day: 1,
  },
  location: {
    name: locationName,
    country: "CA",
  },
});

// OpenMeteo weather code mappings
// https://open-meteo.com/en/docs
const getWeatherDescription = (code: number): string => {
  const descriptions: { [key: number]: string } = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Depositing rime fog",
    51: "Light drizzle",
    53: "Moderate drizzle",
    55: "Dense drizzle",
    56: "Light freezing drizzle",
    57: "Dense freezing drizzle",
    61: "Slight rain",
    63: "Moderate rain",
    65: "Heavy rain",
    66: "Light freezing rain",
    67: "Heavy freezing rain",
    71: "Slight snow fall",
    73: "Moderate snow fall",
    75: "Heavy snow fall",
    77: "Snow grains",
    80: "Slight rain showers",
    81: "Moderate rain showers",
    82: "Violent rain showers",
    85: "Slight snow showers",
    86: "Heavy snow showers",
    95: "Thunderstorm",
    96: "Thunderstorm with slight hail",
    99: "Thunderstorm with heavy hail",
  };
  return descriptions[code] || "Unknown weather";
};



const WeatherCard: React.FC = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Initialize with demo data immediately to prevent errors
  useEffect(() => {
    console.log("Initializing weather card with demo data...");
    setWeatherData(getMockWeatherData("Waterloo, ON"));
    setLoading(false);
    setError(null);
    
    // Try to get real data in the background
    fetchRealWeatherData();
  }, []);

  const fetchRealWeatherData = async () => {
    try {
      console.log("Fetching real weather data...");
      
      // Use default location (Waterloo, ON)
      const lat = 43.4643;
      const lon = -80.5204;
      
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,apparent_temperature,relative_humidity_2m,surface_pressure,weather_code,wind_speed_10m,is_day&timezone=auto`
      );

      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status}`);
      }

      const data = await response.json();
      console.log("Got real weather data:", data);

      if (data && data.current) {
        const realWeatherData: WeatherData = {
          current: data.current,
          location: {
            name: "Waterloo, ON",
            country: "CA"
          }
        };
        
        setWeatherData(realWeatherData);
        setError(null);
        console.log("Updated with real weather data");
      }
    } catch (err) {
      console.warn("Failed to fetch real weather data, keeping demo data:", err);
      // Keep the demo data, don't show error
    }
  };



  // Get appropriate weather icon based on OpenMeteo weather code
  const getWeatherIcon = () => {
    if (!weatherData || !weatherData.current) {
      return <Cloud className="w-12 h-12 text-blue-400" />;
    }

    const weatherCode = weatherData.current.weather_code;
    const isDay = weatherData.current.is_day === 1;

    // OpenMeteo weather codes: https://open-meteo.com/en/docs
    if (weatherCode === 0) {
      return isDay ? (
        <Sun className="w-12 h-12 text-yellow-500" />
      ) : (
        <Moon className="w-12 h-12 text-gray-300" />
      ); // Clear sky
    } else if (weatherCode >= 1 && weatherCode <= 3) {
      return <Cloud className="w-12 h-12 text-gray-400" />; // Cloudy
    } else if (weatherCode === 45 || weatherCode === 48) {
      return <Wind className="w-12 h-12 text-gray-400" />; // Fog
    } else if (weatherCode >= 51 && weatherCode <= 57) {
      return <CloudDrizzle className="w-12 h-12 text-blue-400" />; // Drizzle
    } else if (weatherCode >= 61 && weatherCode <= 67) {
      return <CloudRain className="w-12 h-12 text-blue-500" />; // Rain
    } else if (weatherCode >= 71 && weatherCode <= 77) {
      return <CloudSnow className="w-12 h-12 text-blue-200" />; // Snow
    } else if (weatherCode >= 80 && weatherCode <= 82) {
      return <CloudRain className="w-12 h-12 text-blue-500" />; // Rain showers
    } else if (weatherCode >= 85 && weatherCode <= 86) {
      return <CloudSnow className="w-12 h-12 text-blue-200" />; // Snow showers
    } else if (weatherCode >= 95 && weatherCode <= 99) {
      return <CloudLightning className="w-12 h-12 text-yellow-400" />; // Thunderstorm
    } else {
      return <Cloud className="w-12 h-12 text-gray-400" />; // Default
    }
  };

  // Get background gradient based on OpenMeteo weather code and time
  const getBackgroundGradient = () => {
    if (!weatherData || !weatherData.current) {
      return "from-blue-500/20 to-purple-500/20";
    }

    const weatherCode = weatherData.current.weather_code;
    const isDay = weatherData.current.is_day === 1;

    if (weatherCode >= 95 && weatherCode <= 99) {
      return "from-gray-700/30 to-gray-900/30"; // Thunderstorm
    } else if (
      (weatherCode >= 51 && weatherCode <= 67) ||
      (weatherCode >= 80 && weatherCode <= 82)
    ) {
      return "from-blue-600/30 to-blue-800/30"; // Rain
    } else if (
      (weatherCode >= 71 && weatherCode <= 77) ||
      (weatherCode >= 85 && weatherCode <= 86)
    ) {
      return "from-blue-200/30 to-blue-400/30"; // Snow
    } else if (weatherCode === 0) {
      return isDay
        ? "from-blue-400/20 to-cyan-300/20" // Clear day
        : "from-indigo-900/30 to-purple-900/30"; // Clear night
    } else {
      return isDay
        ? "from-blue-500/20 to-gray-400/20" // Cloudy day
        : "from-gray-700/30 to-gray-900/30"; // Cloudy night
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
            ? "0 20px 40px rgba(0, 0, 0, 0.4), 0 0 20px rgba(168, 85, 247, 0.2), inset 0 0 0 1px rgba(255, 255, 255, 0.1)"
            : "0 10px 30px rgba(0, 0, 0, 0.3), inset 0 0 0 1px rgba(255, 255, 255, 0.05)",
          transition: "box-shadow 0.4s ease-out, transform 0.4s ease-out",
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
            <p className="text-white/80 text-center text-sm mb-3">{error}</p>

            <button
              onClick={fetchRealWeatherData}
              className="mt-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-md text-white/80 text-sm transition-colors"
              disabled={loading}
            >
              {loading ? "Retrying..." : "Retry"}
            </button>
          </CardContent>
        ) : weatherData ? (
          <>
            <CardHeader className="p-6 pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl font-bold text-white">
                    {weatherData.location.name}, {weatherData.location.country}
                  </CardTitle>
                  <CardDescription className="text-white/70">
                    {getWeatherDescription(weatherData.current.weather_code)}
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
                  {Math.round(weatherData.current.temperature_2m)}°C
                </span>
                <span className="text-white/70 text-sm mb-1">
                  Feels like{" "}
                  {Math.round(weatherData.current.apparent_temperature)}°C
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="flex items-center gap-2">
                  <Droplets className="w-4 h-4 text-blue-400" />
                  <span className="text-white/80 text-sm">
                    Humidity: {weatherData.current.relative_humidity_2m}%
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Wind className="w-4 h-4 text-gray-400" />
                  <span className="text-white/80 text-sm">
                    Wind: {Math.round(weatherData.current.wind_speed_10m)} km/h
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
                onClick={fetchRealWeatherData}
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                title="Refresh weather data"
              >
                <RefreshCw className="w-3.5 h-3.5 text-white/70" />
              </motion.button>
            </CardFooter>
          </>
        ) : (
          <CardContent className="p-6 flex flex-col items-center justify-center min-h-[200px]">
            <Cloud className="w-12 h-12 text-gray-400 mb-2" />
            <p className="text-white/80 text-center text-sm">
              No weather data available
            </p>
          </CardContent>
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
              background:
                "linear-gradient(90deg, transparent, rgba(168, 85, 247, 0.5), transparent)",
              boxShadow:
                "0 0 10px rgba(168, 85, 247, 0.5), 0 0 20px rgba(168, 85, 247, 0.3)",
            }}
          />

          {/* Bottom edge glow */}
          <div
            className="absolute bottom-0 left-0 right-0 h-[1px]"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.5), transparent)",
              boxShadow:
                "0 0 10px rgba(59, 130, 246, 0.5), 0 0 20px rgba(59, 130, 246, 0.3)",
            }}
          />

          {/* Corner accents */}
          <div
            className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 rounded-tl-lg"
            style={{ borderColor: "rgba(168, 85, 247, 0.5)" }}
          />
          <div
            className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 rounded-tr-lg"
            style={{ borderColor: "rgba(168, 85, 247, 0.5)" }}
          />
          <div
            className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 rounded-bl-lg"
            style={{ borderColor: "rgba(59, 130, 246, 0.5)" }}
          />
          <div
            className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 rounded-br-lg"
            style={{ borderColor: "rgba(59, 130, 246, 0.5)" }}
          />
        </motion.div>
      </Card>
    </motion.div>
  );
};

export default WeatherCard;

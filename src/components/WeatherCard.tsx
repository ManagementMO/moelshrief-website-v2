import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Cloud,
  CloudRain,
  CloudSnow,
  Sun,
  Moon,
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
  location: string;
  temperature: number;
  description: string;
  humidity: number;
  windSpeed: number;
  icon: string;
}

const WeatherCard: React.FC = () => {
  const [weatherData, setWeatherData] = useState<WeatherData>({
    location: "Waterloo, ON",
    temperature: 22,
    description: "Clear sky",
    humidity: 65,
    windSpeed: 12,
    icon: "clear-day",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState(false);

  const getWeatherIcon = (code: string) => {
    const isDay = new Date().getHours() >= 6 && new Date().getHours() < 20;

    // Simple weather code mapping with proper blocks
    if (code === "113") {
      return isDay ? "clear-day" : "clear-night";
    }
    if (["116", "119", "122"].includes(code)) {
      return "cloudy";
    }
    if (["296", "299", "302", "305"].includes(code)) {
      return "rain";
    }
    if (["323", "326", "329", "332"].includes(code)) {
      return "snow";
    }

    return isDay ? "clear-day" : "clear-night";
  };

  const fetchWeatherData = async () => {
    setLoading(true);
    try {
      console.log("Fetching weather data...");
      const response = await fetch("https://wttr.in/Waterloo,ON?format=j1");

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Weather API response:", data);

      // Safely access nested properties with fallbacks
      const current = data?.current_condition?.[0];
      const location = data?.nearest_area?.[0];

      if (!current || !location) {
        throw new Error("Invalid API response structure");
      }

      const newWeatherData = {
        location: `${location?.areaName?.[0]?.value || "Unknown"}, ${
          location?.country?.[0]?.value || "Unknown"
        }`,
        temperature: parseInt(current?.temp_C || "22"),
        description: current?.weatherDesc?.[0]?.value || "Clear sky",
        humidity: parseInt(current?.humidity || "65"),
        windSpeed: parseInt(current?.windspeedKmph || "12"),
        icon: getWeatherIcon(current?.weatherCode || "113"),
      };

      console.log("Setting weather data:", newWeatherData);
      setWeatherData(newWeatherData);
    } catch (error) {
      console.error("Weather fetch failed:", error);
      // Keep existing data on error - don't update state
    } finally {
      setLoading(false);
    }
  };

  const renderWeatherIcon = () => {
    const iconClass = "w-12 h-12";

    try {
      switch (weatherData?.icon) {
        case "clear-day":
          return <Sun className={`${iconClass} text-yellow-500`} />;
        case "clear-night":
          return <Moon className={`${iconClass} text-gray-300`} />;
        case "cloudy":
          return <Cloud className={`${iconClass} text-gray-400`} />;
        case "rain":
          return <CloudRain className={`${iconClass} text-blue-500`} />;
        case "snow":
          return <CloudSnow className={`${iconClass} text-blue-200`} />;
        default:
          return <Sun className={`${iconClass} text-yellow-500`} />;
      }
    } catch (error) {
      console.error("Error rendering weather icon:", error);
      return <Sun className={`${iconClass} text-yellow-500`} />;
    }
  };

  const getBackgroundGradient = () => {
    try {
      const isDay = new Date().getHours() >= 6 && new Date().getHours() < 20;

      switch (weatherData?.icon) {
        case "clear-day":
          return "from-blue-400/20 to-cyan-300/20";
        case "clear-night":
          return "from-indigo-900/30 to-purple-900/30";
        case "cloudy":
          return isDay
            ? "from-blue-500/20 to-gray-400/20"
            : "from-gray-700/30 to-gray-900/30";
        case "rain":
          return "from-blue-600/30 to-blue-800/30";
        case "snow":
          return "from-blue-200/30 to-blue-400/30";
        default:
          return "from-blue-500/20 to-purple-500/20";
      }
    } catch (error) {
      console.error("Error getting background gradient:", error);
      return "from-blue-500/20 to-purple-500/20";
    }
  };

  useEffect(() => {
    fetchWeatherData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Add error boundary for the entire component
  try {
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
          <CardHeader className="p-6 pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-xl font-bold text-white">
                  {weatherData?.location || "Waterloo, ON"}
                </CardTitle>
                <CardDescription className="text-white/70">
                  {weatherData?.description || "Clear sky"}
                </CardDescription>
              </div>
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {renderWeatherIcon()}
              </motion.div>
            </div>
          </CardHeader>

          <CardContent className="p-6 pt-2">
            <div className="flex items-end gap-2 mb-4">
              <span className="text-4xl font-bold text-white">
                {weatherData?.temperature || 22}°C
              </span>
              <span className="text-white/70 text-sm mb-1">
                Feels like {(weatherData?.temperature || 22) + 2}°C
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="flex items-center gap-2">
                <Droplets className="w-4 h-4 text-blue-400" />
                <span className="text-white/80 text-sm">
                  Humidity: {weatherData?.humidity || 65}%
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Wind className="w-4 h-4 text-gray-400" />
                <span className="text-white/80 text-sm">
                  Wind: {weatherData?.windSpeed || 12} km/h
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
              className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors disabled:opacity-50"
              title="Refresh weather data"
              disabled={loading}
            >
              <RefreshCw
                className={`w-3.5 h-3.5 text-white/70 ${
                  loading ? "animate-spin" : ""
                }`}
              />
            </motion.button>
          </CardFooter>

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
  } catch (error) {
    console.error("WeatherCard render error:", error);
    // Return a simple fallback UI
    return (
      <div className="w-full p-6 bg-blue-500/20 border border-white/10 rounded-lg backdrop-blur-md">
        <div className="flex items-center gap-3">
          <Sun className="w-8 h-8 text-yellow-500" />
          <div>
            <h3 className="text-white font-semibold">Weather</h3>
            <p className="text-white/70 text-sm">22°C • Clear sky</p>
          </div>
        </div>
      </div>
    );
  }
};

export default WeatherCard;

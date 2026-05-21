import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Cloud,
  CloudRain,
  CloudSnow,
  CloudDrizzle,
  CloudLightning,
  Sun,
  Moon,
  Wind,
  Droplets,
  RefreshCw,
  MapPin,
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

type Coordinates = {
  latitude: number;
  longitude: number;
};

type OpenMeteoCurrent = {
  temperature_2m?: number;
  relative_humidity_2m?: number;
  apparent_temperature?: number;
  is_day?: number;
  weather_code?: number;
  wind_speed_10m?: number;
};

type OpenMeteoResponse = {
  current?: OpenMeteoCurrent;
  timezone?: string;
};

type ReverseGeocodeResponse = {
  results?: Array<{
    name?: string;
    country?: string;
    admin1?: string;
  }>;
};

type IpApiResponse = {
  latitude?: number;
  longitude?: number;
  lat?: number;
  lon?: number;
};

interface WeatherData {
  location: string;
  temperature: number;
  apparentTemperature: number;
  description: string;
  humidity: number;
  windSpeed: number;
  icon: string;
  isDay: boolean;
}

const DEFAULT_COORDS: Coordinates = { latitude: 43.4643, longitude: -80.5204 }; // Waterloo, ON

const WeatherCard: React.FC = () => {
  const [weatherData, setWeatherData] = useState<WeatherData>({
    location: "Waterloo, ON",
    temperature: 22,
    apparentTemperature: 24,
    description: "Clear sky",
    humidity: 65,
    windSpeed: 12,
    icon: "clear-day",
    isDay: true,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);

  // Helper functions for geolocation and API calls
  const getBrowserCoordinates = useCallback(async (timeoutMs = 4000): Promise<Coordinates | null> => {
    if (!("geolocation" in navigator)) return null;
    try {
      const isLocalhost = typeof window !== "undefined" && /^(localhost|127\.0\.0\.1|\[::1\])$/i.test(window.location.hostname);
      if (typeof window !== "undefined" && !window.isSecureContext && !isLocalhost) {
        return null;
      }
    } catch {
      return null;
    }
    return new Promise((resolve) => {
      const timer = setTimeout(() => resolve(null), timeoutMs);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          clearTimeout(timer);
          resolve({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
        },
        () => {
          clearTimeout(timer);
          resolve(null);
        },
        { enableHighAccuracy: false, maximumAge: 5 * 60 * 1000, timeout: timeoutMs }
      );
    });
  }, []);

  const safeFetchJson = useCallback(async <T = unknown>(url: string, signal?: AbortSignal, timeoutMs = 8000): Promise<T> => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const res = await fetch(url, { signal: signal ?? controller.signal });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return (await res.json()) as T;
    } finally {
      clearTimeout(timeout);
    }
  }, []);

  const fetchIpGeo = useCallback(async (signal?: AbortSignal): Promise<Coordinates | null> => {
    try {
      const data = await safeFetchJson<IpApiResponse>("https://ipapi.co/json/", signal, 5000);
      const lat = (data.latitude ?? data.lat) as number | undefined;
      const lon = (data.longitude ?? data.lon) as number | undefined;
      if (typeof lat === "number" && typeof lon === "number") {
        return { latitude: lat, longitude: lon };
      }
    } catch {
      // ignore
    }
    return null;
  }, [safeFetchJson]);

  const mapWeatherCodeToIcon = (code: number | undefined, isDay: boolean): string => {
    if (code === undefined || code === null) {
      return isDay ? "clear-day" : "clear-night";
    }

    // Based on Open-Meteo/WMO weather codes
    if (code === 0) return isDay ? "clear-day" : "clear-night";
    if ([1, 2, 3].includes(code)) return "cloudy";
    if ([45, 48].includes(code)) return "fog";
    if ([51, 53, 55, 56, 57].includes(code)) return "drizzle";
    if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return "rain";
    if ([71, 73, 75, 77, 85, 86].includes(code)) return "snow";
    if ([95, 96, 99].includes(code)) return "thunder";
    return "cloudy";
  };

  const mapWeatherCodeToDescription = (code: number | undefined): string => {
    if (code === undefined || code === null) return "Clear sky";
    
    if (code === 0) return "Clear sky";
    if ([1, 2, 3].includes(code)) return "Cloudy";
    if ([45, 48].includes(code)) return "Fog";
    if ([51, 53, 55, 56, 57].includes(code)) return "Drizzle";
    if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return "Rain";
    if ([71, 73, 75, 77, 85, 86].includes(code)) return "Snow";
    if ([95, 96, 99].includes(code)) return "Thunderstorm";
    return "Cloudy";
  };

  const fetchWeatherData = useCallback(async () => {
    setLoading(true);
    try {
      console.log("Fetching weather data with real location...");
      
      // Get user location: browser geolocation -> IP geolocation -> default
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);
      
      const geo = await getBrowserCoordinates();
      const ipGeo = geo ? null : await fetchIpGeo(controller.signal);
      const coords = geo ?? ipGeo ?? DEFAULT_COORDS;
      
      console.log("Using coordinates:", coords);

      // Fetch weather data from OpenMeteo
      const params = new URLSearchParams({
        latitude: String(coords.latitude),
        longitude: String(coords.longitude),
        current: [
          "temperature_2m",
          "relative_humidity_2m",
          "apparent_temperature",
          "is_day",
          "weather_code",
          "wind_speed_10m",
        ].join(","),
        wind_speed_unit: "kmh",
        timezone: "auto",
      });
      params.append("_", String(Date.now()));

      // Fetch location name
      const reverseGeoUrl = `https://geocoding-api.open-meteo.com/v1/reverse?latitude=${coords.latitude}&longitude=${coords.longitude}&language=en&format=json&_=${Date.now()}`;
      
      const [meteoResponse, reverseResponse] = await Promise.all([
        safeFetchJson<OpenMeteoResponse>(`https://api.open-meteo.com/v1/forecast?${params.toString()}`, controller.signal),
        safeFetchJson<ReverseGeocodeResponse>(reverseGeoUrl, controller.signal).catch(() => ({ results: [] })),
      ]);

      clearTimeout(timeout);

      const current = meteoResponse.current ?? {};
      const isDay = (current.is_day ?? 1) === 1;
      
      // Get location name
      const best = reverseResponse.results?.[0];
      const locationName = best 
        ? [best.name, best.admin1, best.country].filter(Boolean).join(", ")
        : "Waterloo, ON";

      const newWeatherData: WeatherData = {
        location: locationName,
        temperature: typeof current.temperature_2m === "number" ? Math.round(current.temperature_2m) : 22,
        apparentTemperature: typeof current.apparent_temperature === "number" ? Math.round(current.apparent_temperature) : 24,
        description: mapWeatherCodeToDescription(current.weather_code),
        humidity: typeof current.relative_humidity_2m === "number" ? Math.round(current.relative_humidity_2m) : 65,
        windSpeed: typeof current.wind_speed_10m === "number" ? Math.round(current.wind_speed_10m) : 12,
        icon: mapWeatherCodeToIcon(current.weather_code, isDay),
        isDay,
      };

      console.log("Setting weather data:", newWeatherData);
      setWeatherData(newWeatherData);
      setLastUpdated(Date.now());
    } catch (error) {
      console.error("Weather fetch failed:", error);
      // Try fallback with default coordinates
      try {
        const fallbackParams = new URLSearchParams({
          latitude: String(DEFAULT_COORDS.latitude),
          longitude: String(DEFAULT_COORDS.longitude),
          current: "temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,wind_speed_10m",
          wind_speed_unit: "kmh",
          timezone: "auto",
        });
        fallbackParams.append("_", String(Date.now()));
        
        const fallbackResponse = await safeFetchJson<OpenMeteoResponse>(`https://api.open-meteo.com/v1/forecast?${fallbackParams.toString()}`);
        const current = fallbackResponse.current ?? {};
        const isDay = (current.is_day ?? 1) === 1;
        
        const fallbackData: WeatherData = {
          location: "Waterloo, ON",
          temperature: typeof current.temperature_2m === "number" ? Math.round(current.temperature_2m) : 22,
          apparentTemperature: typeof current.apparent_temperature === "number" ? Math.round(current.apparent_temperature) : 24,
          description: mapWeatherCodeToDescription(current.weather_code),
          humidity: typeof current.relative_humidity_2m === "number" ? Math.round(current.relative_humidity_2m) : 65,
          windSpeed: typeof current.wind_speed_10m === "number" ? Math.round(current.wind_speed_10m) : 12,
          icon: mapWeatherCodeToIcon(current.weather_code, isDay),
          isDay,
        };
        
        setWeatherData(fallbackData);
        setLastUpdated(Date.now());
      } catch (fallbackError) {
        console.error("Fallback weather fetch also failed:", fallbackError);
      }
    } finally {
      setLoading(false);
    }
  }, [getBrowserCoordinates, fetchIpGeo, safeFetchJson]);

  const renderWeatherIcon = () => {
    const iconClass = "w-16 h-16"; // Made bigger

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
        case "drizzle":
          return <CloudDrizzle className={`${iconClass} text-blue-400`} />;
        case "thunder":
          return <CloudLightning className={`${iconClass} text-yellow-400`} />;
        case "fog":
          return <Cloud className={`${iconClass} text-gray-300`} />;
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
      const isDay = weatherData?.isDay ?? true;

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
        case "drizzle":
          return "from-blue-500/25 to-blue-700/25";
        case "snow":
          return "from-blue-200/30 to-blue-400/30";
        case "thunder":
          return "from-gray-700/35 to-gray-900/35";
        case "fog":
          return "from-gray-500/25 to-gray-700/25";
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
    // Auto-refresh every 15 minutes
    const interval = setInterval(fetchWeatherData, 15 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchWeatherData]);

  // Add error boundary for the entire component
  try {
    return (
      <motion.div
        className="w-full max-w-lg mx-auto" // Made it wider with larger max width
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
          <CardHeader className="p-8 pb-4"> {/* Increased padding */}
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-4 h-4 text-white/70" />
                  <CardTitle className="text-2xl font-bold text-white"> {/* Made bigger */}
                    {weatherData?.location || "Waterloo, ON"}
                  </CardTitle>
                </div>
                <CardDescription className="text-white/70 text-lg"> {/* Made bigger */}
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

          <CardContent className="p-8 pt-4"> {/* Increased padding */}
            <div className="flex items-end gap-3 mb-6"> {/* Increased spacing */}
              <span className="text-6xl font-bold text-white"> {/* Made bigger */}
                {weatherData?.temperature || 22}°C
              </span>
              <span className="text-white/70 text-base mb-2"> {/* Made bigger */}
                Feels like {weatherData?.apparentTemperature || 24}°C
              </span>
            </div>

            <div className="grid grid-cols-1 gap-6 mt-6"> {/* Changed to single column with more spacing */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Droplets className="w-5 h-5 text-blue-400" /> {/* Made bigger */}
                  <span className="text-white/80 text-base"> {/* Made bigger */}
                    Humidity
                  </span>
                </div>
                <span className="text-white font-semibold text-base">
                  {weatherData?.humidity || 65}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Wind className="w-5 h-5 text-gray-400" /> {/* Made bigger */}
                  <span className="text-white/80 text-base"> {/* Made bigger */}
                    Wind Speed
                  </span>
                </div>
                <span className="text-white font-semibold text-base">
                  {weatherData?.windSpeed || 12} km/h
                </span>
              </div>
            </div>
          </CardContent>

          <CardFooter className="p-6 pt-0 flex justify-between items-center"> {/* Increased padding */}
            <p className="text-sm text-white/50"> {/* Made bigger */}
              Last updated: {lastUpdated ? new Date(lastUpdated).toLocaleTimeString() : "Never"}
            </p>
            <motion.button
              whileHover={{ scale: 1.1, rotate: 180 }}
              transition={{ duration: 0.5 }}
              onClick={fetchWeatherData}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors disabled:opacity-50" // Made bigger
              title="Refresh weather data"
              disabled={loading}
            >
              <RefreshCw
                className={`w-4 h-4 text-white/70 ${ // Made bigger
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
      <div className="w-full max-w-lg mx-auto p-8 bg-blue-500/20 border border-white/10 rounded-lg backdrop-blur-md">
        <div className="flex items-center gap-4">
          <Sun className="w-12 h-12 text-yellow-500" />
          <div>
            <h3 className="text-white font-semibold text-xl">Weather</h3>
            <p className="text-white/70 text-base">22°C • Clear sky</p>
          </div>
        </div>
      </div>
    );
  }
};

export default WeatherCard;

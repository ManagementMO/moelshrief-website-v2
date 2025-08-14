import React, { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Cloud, CloudRain, CloudSnow, CloudLightning, Sun, Moon, CloudDrizzle, Wind, Droplets } from 'lucide-react';
import { cn } from '@/lib/utils';

type Coordinates = { latitude: number; longitude: number };

type OpenMeteoCurrent = {
  temperature_2m?: number;
  relative_humidity_2m?: number;
  is_day?: number;
  weather_code?: number;
  wind_speed_10m?: number;
};

type ReverseGeocodeResponse = {
  results?: Array<{ name?: string; country?: string; admin1?: string }>;
};

type IpApiResponse = { latitude?: number; longitude?: number; lat?: number; lon?: number };

type WeatherData = {
  temperatureC: number | null;
  humidity: number | null;
  windKmh: number | null;
  code: number | null;
  isDay: boolean;
  locationName: string;
};

const DEFAULT_COORDS: Coordinates = { latitude: 43.4643, longitude: -80.5204 };

function pickLocationName(resp?: ReverseGeocodeResponse): string {
  const best = resp?.results?.[0];
  const pieces = [best?.name, best?.admin1, best?.country].filter(Boolean) as string[];
  return pieces.join(', ') || 'Your location';
}

function tzToName(tz?: string | null): string | undefined {
  if (!tz) return undefined;
  const parts = tz.split('/');
  const last = parts[parts.length - 1] || '';
  const pretty = last.replace(/[_-]+/g, ' ').trim();
  return pretty || undefined;
}

function coordsApproxEqual(a: Coordinates, b: Coordinates, epsilon = 0.02): boolean {
  return (
    Math.abs(a.latitude - b.latitude) < epsilon &&
    Math.abs(a.longitude - b.longitude) < epsilon
  );
}

function mapWmoToIcon(code: number | null | undefined, isDay: boolean) {
  if (code === null || code === undefined) return isDay ? <Sun className="w-5 h-5 text-yellow-500"/> : <Moon className="w-5 h-5 text-gray-300"/>;
  if (code === 0) return isDay ? <Sun className="w-5 h-5 text-yellow-500"/> : <Moon className="w-5 h-5 text-gray-300"/>;
  if ([1,2,3].includes(code)) return <Cloud className="w-5 h-5 text-gray-400"/>;
  if ([45,48].includes(code)) return <Wind className="w-5 h-5 text-gray-400"/>;
  if ([51,53,55,56,57].includes(code)) return <CloudDrizzle className="w-5 h-5 text-blue-400"/>;
  if ([61,63,65,66,67,80,81,82].includes(code)) return <CloudRain className="w-5 h-5 text-blue-500"/>;
  if ([71,73,75,77,85,86].includes(code)) return <CloudSnow className="w-5 h-5 text-blue-200"/>;
  if ([95,96,99].includes(code)) return <CloudLightning className="w-5 h-5 text-yellow-400"/>;
  return <Cloud className="w-5 h-5 text-gray-400"/>;
}

async function getBrowserCoordinates(timeoutMs = 4000): Promise<Coordinates | null> {
  if (!("geolocation" in navigator)) return null;
  try {
    const isLocalhost = typeof window !== 'undefined' && /^(localhost|127\.0\.0\.1|\[::1\])$/i.test(window.location.hostname);
    if (typeof window !== 'undefined' && !window.isSecureContext && !isLocalhost) return null;
  } catch {
    // ignore
  }
  return new Promise((resolve) => {
    const timer = setTimeout(() => resolve(null), timeoutMs);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        clearTimeout(timer);
        resolve({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
      },
      () => { clearTimeout(timer); resolve(null); },
      { enableHighAccuracy: false, maximumAge: 5 * 60 * 1000, timeout: timeoutMs }
    );
  });
}

async function safeFetchJson<T = unknown>(url: string, signal?: AbortSignal, timeoutMs = 8000): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: signal ?? controller.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return (await res.json()) as T;
  } finally {
    clearTimeout(timeout);
  }
}

async function fetchIpGeo(signal?: AbortSignal): Promise<Coordinates | null> {
  try {
    const data = await safeFetchJson<IpApiResponse>('https://ipapi.co/json/', signal, 5000);
    const lat = (data.latitude ?? data.lat) as number | undefined;
    const lon = (data.longitude ?? data.lon) as number | undefined;
    if (typeof lat === 'number' && typeof lon === 'number') return { latitude: lat, longitude: lon };
  } catch {
    // ignore
  }
  return null;
}

const NavbarWeatherCard: React.FC = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isHovered, setIsHovered] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchWeatherData = useCallback(async () => {
    setLoading(true);
    try {
      const browserCoords = await getBrowserCoordinates();
      const controller = new AbortController();
      const ipCoords = browserCoords ? null : await fetchIpGeo(controller.signal);
      const coords = browserCoords ?? ipCoords ?? DEFAULT_COORDS;

      const params = new URLSearchParams({
        latitude: String(coords.latitude),
        longitude: String(coords.longitude),
        current: [
          'temperature_2m',
          'relative_humidity_2m',
          'is_day',
          'weather_code',
          'wind_speed_10m',
        ].join(','),
        wind_speed_unit: 'kmh',
        timezone: 'auto',
        _: String(Date.now()),
      });

      const [forecast, reverse] = await Promise.all([
        safeFetchJson<{ current?: OpenMeteoCurrent; timezone?: string }>(`https://api.open-meteo.com/v1/forecast?${params.toString()}`, controller.signal, 8000),
        safeFetchJson<ReverseGeocodeResponse>(`https://geocoding-api.open-meteo.com/v1/reverse?latitude=${coords.latitude}&longitude=${coords.longitude}&language=en&format=json&_=${Date.now()}`, controller.signal, 8000).catch(() => ({ results: [] })),
      ]);

      const c = forecast.current ?? {};
      const isDay = (c.is_day ?? 1) === 1;
      const reverseName = pickLocationName(reverse);
      const tzName = tzToName(forecast.timezone);
      const displayName = reverseName && reverseName !== 'Your location' ? reverseName : (coordsApproxEqual(coords, DEFAULT_COORDS) ? 'Waterloo, ON' : (tzName ?? 'Waterloo, ON'));
      const ui: WeatherData = {
        temperatureC: typeof c.temperature_2m === 'number' ? Math.round(c.temperature_2m) : null,
        humidity: typeof c.relative_humidity_2m === 'number' ? Math.round(c.relative_humidity_2m) : null,
        windKmh: typeof c.wind_speed_10m === 'number' ? Math.round(c.wind_speed_10m) : null,
        code: typeof c.weather_code === 'number' ? c.weather_code : null,
        isDay,
        locationName: displayName,
      };
      setWeatherData(ui);
      setErrorMessage(null);
    } catch (err) {
      // Strong fallback: fetch Waterloo, ON
      try {
        const fallback = await safeFetchJson<{ current?: OpenMeteoCurrent }>(
          `https://api.open-meteo.com/v1/forecast?latitude=${DEFAULT_COORDS.latitude}&longitude=${DEFAULT_COORDS.longitude}&current=temperature_2m,relative_humidity_2m,is_day,weather_code,wind_speed_10m&wind_speed_unit=kmh&timezone=auto&_=${Date.now()}`,
          undefined,
          8000
        );
        const c = fallback.current ?? {};
        const isDay = (c.is_day ?? 1) === 1;
        const ui: WeatherData = {
          temperatureC: typeof c.temperature_2m === 'number' ? Math.round(c.temperature_2m) : null,
          humidity: typeof c.relative_humidity_2m === 'number' ? Math.round(c.relative_humidity_2m) : null,
          windKmh: typeof c.wind_speed_10m === 'number' ? Math.round(c.wind_speed_10m) : null,
          code: typeof c.weather_code === 'number' ? c.weather_code : null,
          isDay,
          locationName: 'Waterloo, ON',
        };
        setWeatherData(ui);
        setErrorMessage('Using fallback: Waterloo, ON');
      } catch {
        const msg = err instanceof Error ? err.message : 'Unknown error';
        setErrorMessage(msg);
        setWeatherData((prev) => prev ?? {
          temperatureC: null,
          humidity: null,
          windKmh: null,
          code: null,
          isDay: true,
          locationName: 'Waterloo, ON',
        });
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchWeatherData(); }, [fetchWeatherData]);

  const getWeatherIcon = () => mapWmoToIcon(weatherData?.code ?? null, weatherData?.isDay ?? true);

  // Get background gradient based on weather and time
  const getBackgroundGradient = () => {
    if (!weatherData) return 'from-blue-500/20 to-purple-500/20';
    const code = weatherData.code ?? 3; // default cloudy
    const isDay = weatherData.isDay;
    if ([95,96,99].includes(code)) return 'from-gray-700/30 to-gray-900/30'; // thunder
    if ([61,63,65,66,67,80,81,82].includes(code)) return 'from-blue-600/30 to-blue-800/30'; // rain
    if ([71,73,75,77,85,86].includes(code)) return 'from-blue-200/30 to-blue-400/30'; // snow
    if (code === 0) return isDay ? 'from-blue-400/20 to-cyan-300/20' : 'from-indigo-900/30 to-purple-900/30';
    return isDay ? 'from-blue-500/20 to-gray-400/20' : 'from-gray-700/30 to-gray-900/30';
  };

  return (
    <motion.div
      className="w-[420px] mx-auto"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.5 }}
      whileHover={{ scale: 1.05 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <div
        className={cn(
          "overflow-hidden backdrop-blur-md border border-white/10 rounded-lg py-1 px-2.5",
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
          <div className="flex items-center justify-between py-1">
            <div className="animate-pulse flex items-center gap-3 min-w-[80px]">
              <div className="h-5 w-5 bg-white/10 rounded-full"></div>
              <div className="h-3 w-12 bg-white/10 rounded"></div>
            </div>
            <div className="animate-pulse min-w-[100px] mx-6">
              <div className="h-3 w-20 bg-white/10 rounded mx-auto"></div>
            </div>
            <div className="animate-pulse flex items-center gap-8 min-w-[150px] justify-end pr-2">
              <div className="h-3 w-10 bg-white/10 rounded"></div>
              <div className="h-3 w-16 bg-white/10 rounded"></div>
            </div>
          </div>
        ) : weatherData && (
          <div className="flex items-center justify-between py-1">
            <div className="flex items-center gap-3 min-w-[80px]">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {getWeatherIcon()}
              </motion.div>
              <span className="text-base font-bold text-white">
                {weatherData.temperatureC !== null ? `${Math.round(weatherData.temperatureC)}°C` : 'N/A'}
              </span>
            </div>

            <span className="text-white/70 text-sm mx-6 whitespace-nowrap min-w-[100px] text-center">
              {weatherData.locationName}
            </span>

            <div className="flex items-center gap-8 min-w-[150px] justify-end pr-2">
              <div className="flex items-center gap-1.5">
                <Droplets className="w-4 h-4 text-blue-400" />
                <span className="text-white/80 text-sm whitespace-nowrap">
                  {weatherData.humidity !== null ? `${weatherData.humidity}%` : 'N/A'}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Wind className="w-4 h-4 text-gray-400" />
                <span className="text-white/80 text-sm whitespace-nowrap">
                  {weatherData.windKmh !== null ? `${Math.round(weatherData.windKmh)} km/h` : 'N/A'}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default NavbarWeatherCard;

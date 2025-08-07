import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Cloud, CloudRain, CloudSnow, Droplets, Moon, RefreshCw, Sun, Wind, Zap } from "lucide-react";

type Coordinates = {
  latitude: number;
  longitude: number;
};

type OpenMeteoCurrent = {
  temperature_2m?: number;
  relative_humidity_2m?: number;
  apparent_temperature?: number;
  is_day?: number; // 1 = day, 0 = night
  precipitation?: number;
  weather_code?: number;
  wind_speed_10m?: number;
};

type OpenMeteoResponse = {
  latitude: number;
  longitude: number;
  timezone?: string;
  current?: OpenMeteoCurrent;
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

type WeatherUIData = {
  locationName: string;
  temperatureC: number | null;
  description: string;
  windKmh: number | null;
  humidity: number | null;
  isDay: boolean;
  icon: "sun" | "moon" | "cloud" | "rain" | "snow" | "wind" | "drizzle" | "fog" | "thunder";
};

const DEFAULT_COORDS: Coordinates = { latitude: 43.4643, longitude: -80.5204 }; // Waterloo, ON

function mapWeatherCodeToDescriptionAndIcon(code: number | undefined, isDay: boolean): {
  description: string;
  icon: WeatherUIData["icon"];
} {
  if (code === undefined || code === null) {
    return { description: "Clear", icon: isDay ? "sun" : "moon" };
  }

  // Based on Open-Meteo/WMO weather codes
  if (code === 0) return { description: "Clear sky", icon: isDay ? "sun" : "moon" };
  if ([1, 2, 3].includes(code)) return { description: "Cloudy", icon: "cloud" };
  if ([45, 48].includes(code)) return { description: "Fog", icon: "fog" };
  if ([51, 53, 55, 56, 57].includes(code)) return { description: "Drizzle", icon: "drizzle" };
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return { description: "Rain", icon: "rain" };
  if ([71, 73, 75, 77, 85, 86].includes(code)) return { description: "Snow", icon: "snow" };
  if ([95, 96, 99].includes(code)) return { description: "Thunderstorm", icon: "thunder" };
  return { description: "Cloudy", icon: "cloud" };
}

async function getBrowserCoordinates(timeoutMs = 4000): Promise<Coordinates | null> {
  if (!("geolocation" in navigator)) return null;
  // Avoid prompting on clearly insecure contexts except localhost
  try {
    const isLocalhost = typeof window !== "undefined" && /^(localhost|127\.0\.0\.1|\[::1\])$/i.test(window.location.hostname);
    if (typeof window !== "undefined" && !window.isSecureContext && !isLocalhost) {
      return null;
    }
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
      () => {
        clearTimeout(timer);
        resolve(null);
      },
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
  // Try ipapi.co first
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
  // Fallback: ipinfo.io (no lat/lon directly, omit)
  return null;
}

async function fetchOpenMeteo(coords: Coordinates, signal?: AbortSignal): Promise<OpenMeteoResponse> {
  const params = new URLSearchParams({
    latitude: String(coords.latitude),
    longitude: String(coords.longitude),
    current: [
      "temperature_2m",
      "relative_humidity_2m",
      "apparent_temperature",
      "is_day",
      "precipitation",
      "weather_code",
      "wind_speed_10m",
    ].join(","),
    wind_speed_unit: "kmh",
    timezone: "auto",
  });
  // Add a cache-busting param to avoid stale caches without adding custom headers (preflight risk)
  params.append("_", String(Date.now()));
  const url = `https://api.open-meteo.com/v1/forecast?${params.toString()}`;
  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error(`Weather fetch failed: ${res.status}`);
  return res.json();
}

async function reverseGeocode(coords: Coordinates, signal?: AbortSignal): Promise<string> {
  const params = new URLSearchParams({
    latitude: String(coords.latitude),
    longitude: String(coords.longitude),
    language: "en",
    format: "json",
  });
  params.append("_", String(Date.now()));
  const url = `https://geocoding-api.open-meteo.com/v1/reverse?${params.toString()}`;
  const res = await fetch(url, { signal });
  if (!res.ok) return "Waterloo, ON";
  const data = (await res.json()) as ReverseGeocodeResponse;
  const best = data.results?.[0];
  if (!best) return "Waterloo, ON";
  const pieces = [best.name, best.admin1, best.country].filter(Boolean);
  return pieces.join(", ");
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

export type OpenMeteoWeatherCardProps = {
  className?: string;
  compact?: boolean; // compact variant for navbar
};

const OpenMeteoWeatherCard: React.FC<OpenMeteoWeatherCardProps> = ({ className, compact = true }) => {
  const [data, setData] = useState<WeatherUIData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    setIsLoading(true);
    try {
      // Determine coordinates: browser geolocation -> IP geolocation -> default
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);
      const geo = await getBrowserCoordinates().catch(() => null);
      const ipGeo = geo ? null : await fetchIpGeo(controller.signal);
      const coords = geo ?? ipGeo ?? DEFAULT_COORDS;

      const [meteo, locName] = await Promise.all([
        fetchOpenMeteo(coords, controller.signal),
        reverseGeocode(coords, controller.signal).catch(() => "Waterloo, ON"),
      ]);
      clearTimeout(timeout);

      const current: OpenMeteoCurrent = meteo.current ?? {};
      const isDay = (current.is_day ?? 1) === 1;
      const { description, icon } = mapWeatherCodeToDescriptionAndIcon(current.weather_code, isDay);

      const tzName = tzToName(meteo.timezone);
      const displayName = (locName && locName.trim().length > 0) ? locName : (coordsApproxEqual(coords, DEFAULT_COORDS) ? "Waterloo, ON" : (tzName ?? "Waterloo, ON"));
      const uiData: WeatherUIData = {
        locationName: displayName,
        temperatureC: typeof current.temperature_2m === "number" ? Math.round(current.temperature_2m) : null,
        description,
        windKmh: typeof current.wind_speed_10m === "number" ? Math.round(current.wind_speed_10m) : null,
        humidity: typeof current.relative_humidity_2m === "number" ? Math.round(current.relative_humidity_2m) : null,
        isDay,
        icon,
      };

      setData(uiData);
      setLastUpdated(Date.now());
      setErrorMessage(null);
    } catch (err) {
      // Strong fallback: fetch Waterloo, ON instead of showing placeholders
      try {
        const fallback = await fetchOpenMeteo(DEFAULT_COORDS);
        const current: OpenMeteoCurrent = fallback.current ?? {};
        const isDay = (current.is_day ?? 1) === 1;
        const { description, icon } = mapWeatherCodeToDescriptionAndIcon(current.weather_code, isDay);
        const uiData: WeatherUIData = {
          locationName: "Waterloo, ON",
          temperatureC: typeof current.temperature_2m === "number" ? Math.round(current.temperature_2m) : null,
          description,
          windKmh: typeof current.wind_speed_10m === "number" ? Math.round(current.wind_speed_10m) : null,
          humidity: typeof current.relative_humidity_2m === "number" ? Math.round(current.relative_humidity_2m) : null,
          isDay,
          icon,
        };
        setData(uiData);
        setLastUpdated(Date.now());
        setErrorMessage("Using fallback: Waterloo, ON");
      } catch (err2) {
        const message = err instanceof Error ? err.message : "Unknown error";
        setErrorMessage(message);
        setData((prev) =>
          prev ?? {
            locationName: "Waterloo, ON",
            temperatureC: null,
            description: "Unavailable",
            windKmh: null,
            humidity: null,
            isDay: true,
            icon: "cloud",
          }
        );
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
    // Refresh every 15 minutes
    const id = setInterval(fetchAll, 15 * 60 * 1000);
    return () => clearInterval(id);
  }, [fetchAll]);

  const IconEl = useMemo(() => {
    const sizeCls = compact ? "w-4 h-4" : "w-6 h-6";
    switch (data?.icon) {
      case "sun":
        return <Sun className={sizeCls} />;
      case "moon":
        return <Moon className={sizeCls} />;
      case "rain":
        return <CloudRain className={sizeCls} />;
      case "snow":
        return <CloudSnow className={sizeCls} />;
      case "wind":
        return <Wind className={sizeCls} />;
      case "drizzle":
        return <Droplets className={sizeCls} />;
      case "thunder":
        return <Zap className={sizeCls} />;
      case "cloud":
      default:
        return <Cloud className={sizeCls} />;
    }
  }, [data?.icon, compact]);

  const tempText = data?.temperatureC !== null && data?.temperatureC !== undefined ? `${data.temperatureC}°C` : "N/A";
  const windText = data?.windKmh !== null && data?.windKmh !== undefined ? `${data.windKmh} km/h` : "N/A";
  const humidityText = data?.humidity !== null && data?.humidity !== undefined ? `${data.humidity}%` : "N/A";

  return (
    <Card
      className={cn(
        "group relative select-none border-white/10 bg-black/30 text-white backdrop-blur-md",
        compact ? "px-3 py-2 rounded-full" : "p-4 rounded-xl w-full max-w-xs",
        className
      )}
      role="region"
      aria-label="Current weather"
      title={errorMessage ? `Weather status: ${errorMessage}` : undefined}
    >
      <div className={cn("flex items-center gap-2", compact ? "" : "justify-between")}>
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "flex items-center justify-center rounded-full bg-white/10",
              compact ? "w-7 h-7" : "w-10 h-10"
            )}
            aria-hidden
          >
            {IconEl}
          </div>
          <div className="flex flex-col leading-tight">
            <span className={cn("font-medium", compact ? "text-xs" : "text-sm")}>{tempText}</span>
            <span className={cn("text-white/70", compact ? "text-[10px]" : "text-xs")}>{data?.description ?? ""}</span>
          </div>
        </div>

        {!compact && (
          <div className="flex items-center gap-3">
            <div className="text-xs text-white/80">
              <div className="flex items-center gap-1"><Wind className="w-3 h-3" />{windText}</div>
              <div className="flex items-center gap-1"><Droplets className="w-3 h-3" />{humidityText}</div>
            </div>
            <button
              type="button"
              aria-label="Refresh weather"
              className={cn(
                "rounded-md border border-white/10 bg-white/5 p-1 text-white/80 transition hover:bg-white/10",
                isLoading && "opacity-70"
              )}
              onClick={fetchAll}
              disabled={isLoading}
            >
              <RefreshCw className={cn("w-4 h-4", isLoading && "animate-spin")}/>
            </button>
          </div>
        )}
      </div>

      {/* Footer line with location and manual refresh for compact variant */}
      <div className={cn("flex items-center justify-between", compact ? "mt-1" : "mt-3")}> 
        <span className={cn("truncate text-white/70", compact ? "text-[10px]" : "text-xs")}>{data?.locationName ?? ""}</span>
        {compact && (
          <button
            type="button"
            aria-label="Refresh weather"
            className={cn(
              "ml-2 rounded-md border border-white/10 bg-white/5 p-1 text-white/70 transition hover:text-white hover:bg-white/10",
              isLoading && "opacity-70"
            )}
            onClick={fetchAll}
            disabled={isLoading}
          >
            <RefreshCw className={cn("w-3 h-3", isLoading && "animate-spin")}/>
          </button>
        )}
      </div>

      {/* subtle shine on hover */}
      <div className={cn(
        "pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100",
        "[background:radial-gradient(circle_at_30%_10%,rgba(255,255,255,0.08),transparent_50%)]"
      )}/>
    </Card>
  );
};

export default OpenMeteoWeatherCard;



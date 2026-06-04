import { useState, useEffect } from "react";
import type { GeoCoords } from "./useGeolocation";

export interface WeatherData {
  temperature: number;
  weatherCode: number;
  precipitation: number;
  label: string;
  emoji: string;
  isOutdoorFriendly: boolean;
}

const WMO_LABELS: Record<number, { label: string; emoji: string; outdoor: boolean }> = {
  0: { label: "Clear sky", emoji: "☀️", outdoor: true },
  1: { label: "Mainly clear", emoji: "🌤️", outdoor: true },
  2: { label: "Partly cloudy", emoji: "⛅", outdoor: true },
  3: { label: "Overcast", emoji: "☁️", outdoor: true },
  45: { label: "Foggy", emoji: "🌫️", outdoor: false },
  48: { label: "Foggy", emoji: "🌫️", outdoor: false },
  51: { label: "Light drizzle", emoji: "🌦️", outdoor: false },
  53: { label: "Drizzle", emoji: "🌦️", outdoor: false },
  55: { label: "Heavy drizzle", emoji: "🌧️", outdoor: false },
  61: { label: "Light rain", emoji: "🌧️", outdoor: false },
  63: { label: "Rain", emoji: "🌧️", outdoor: false },
  65: { label: "Heavy rain", emoji: "⛈️", outdoor: false },
  71: { label: "Snow", emoji: "❄️", outdoor: false },
  80: { label: "Rain showers", emoji: "🌧️", outdoor: false },
  95: { label: "Thunderstorm", emoji: "⛈️", outdoor: false },
};

function decodeWeather(code: number) {
  return (
    WMO_LABELS[code] ?? {
      label: "Variable",
      emoji: "🌡️",
      outdoor: true,
    }
  );
}

export function useWeather(coords: GeoCoords | null) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!coords) return;

    const controller = new AbortController();
    setLoading(true);
    setError(null);

    const { latitude, longitude } = coords;
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code,precipitation&timezone=auto`;

    fetch(url, { signal: controller.signal })
      .then((r) => {
        if (!r.ok) throw new Error("Weather unavailable");
        return r.json();
      })
      .then((data) => {
        const c = data.current;
        const decoded = decodeWeather(c.weather_code);
        setWeather({
          temperature: Math.round(c.temperature_2m),
          weatherCode: c.weather_code,
          precipitation: c.precipitation ?? 0,
          label: decoded.label,
          emoji: decoded.emoji,
          isOutdoorFriendly: decoded.outdoor,
        });
      })
      .catch((e) => {
        if (e.name !== "AbortError") setError("Could not load weather");
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [coords?.latitude, coords?.longitude]);

  return { weather, loading, error };
}

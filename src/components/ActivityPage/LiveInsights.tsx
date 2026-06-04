import React, { useMemo, useState, useEffect } from "react";
import {
  Cloud,
  MapPin,
  ExternalLink,
  Sparkles,
  Navigation,
  RefreshCw,
  Star,
} from "lucide-react";
import { useThemeContext } from "@/context/ThemeProvider";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useWeather } from "@/hooks/useWeather";
import { useGoogleNearby, type NearbyTab } from "@/hooks/useGoogleNearby";
import type { IActivity } from "@/types";
import DraggableSuggestion from "./DraggableSuggestion";

interface Props {
  activities: IActivity[];
}

const TABS: { id: NearbyTab; label: string }[] = [
  { id: "all", label: "All" },
  { id: "food", label: "Cafés & food" },
  { id: "fun", label: "Fun & outings" },
];

const LiveInsights: React.FC<Props> = ({ activities }) => {
  const { theme } = useThemeContext();
  const isDark = theme === "dark";
  const { coords, error: geoError, loading: geoLoading, refresh } =
    useGeolocation();
  const { weather, loading: weatherLoading, error: weatherError } =
    useWeather(coords);
  const [nearbyTab, setNearbyTab] = useState<NearbyTab>("all");
  const { places, loading: placesLoading, error: placesError, refetch } =
    useGoogleNearby(coords, nearbyTab);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const suggestions = useMemo(() => {
    if (!weather) return activities.slice(0, 3);
    if (weather.isOutdoorFriendly) {
      return activities.filter((a) =>
        ["outdoor", "fitness", "social"].includes(a.category)
      );
    }
    return activities.filter((a) =>
      ["indoor", "food", "culture", "relaxation"].includes(a.category)
    );
  }, [weather, activities]);

  const panelClass = isDark
    ? "bg-gray-900/90 border-gray-800 text-gray-100"
    : "bg-white/90 border-gray-200 text-gray-900 shadow-sm";

  return (
    <div className={`rounded-2xl border p-5 backdrop-blur-md ${panelClass}`}>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <Sparkles
            className={`w-5 h-5 ${isDark ? "text-cyan-400" : "text-indigo-500"}`}
          />
          <h3 className="font-bold text-lg">Live Weekend Insights</h3>
        </div>
        <button
          type="button"
          onClick={refresh}
          disabled={geoLoading}
          className={`inline-flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg border transition ${
            isDark
              ? "border-gray-600 hover:bg-gray-800"
              : "border-gray-200 hover:bg-gray-50"
          }`}
        >
          <Navigation className="w-4 h-4" />
          {geoLoading ? "Locating…" : "Use my location"}
        </button>
      </div>

      {coords && (
        <p className="text-xs opacity-50 mb-3 -mt-2">
          📍 {coords.latitude.toFixed(4)}, {coords.longitude.toFixed(4)}
        </p>
      )}
      {geoError && !coords && (
        <p className="text-sm text-amber-500 mb-3">{geoError}</p>
      )}

      <div className="grid sm:grid-cols-2 gap-4">
        <div
          className={`rounded-xl p-4 border ${
            isDark ? "border-gray-700 bg-gray-800/50" : "border-gray-100 bg-gray-50"
          }`}
        >
          <div className="flex items-center gap-2 mb-2 text-sm font-medium opacity-80">
            <Cloud className="w-4 h-4" />
            Weather at your location
          </div>
          {!coords ? (
            <p className="text-sm opacity-60">Enable location for local weather</p>
          ) : geoLoading || weatherLoading ? (
            <p className="text-sm opacity-60 animate-pulse">Loading forecast…</p>
          ) : weatherError ? (
            <p className="text-sm text-amber-500">{weatherError}</p>
          ) : weather ? (
            <div>
              <p className="text-2xl font-bold">
                {weather.emoji} {weather.temperature}°C
              </p>
              <p className="text-sm mt-1 opacity-80">{weather.label}</p>
              <p className="text-xs mt-2 opacity-60">
                {weather.isOutdoorFriendly
                  ? "Great day for outdoor plans"
                  : "Indoor & food picks recommended"}
              </p>
            </div>
          ) : null}
        </div>

        <div
          className={`rounded-xl p-4 border ${
            isDark ? "border-gray-700 bg-gray-800/50" : "border-gray-100 bg-gray-50"
          }`}
        >
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2 text-sm font-medium opacity-80">
              <MapPin className="w-4 h-4" />
              Google Places nearby
            </div>
            <button
              type="button"
              onClick={refetch}
              disabled={!coords || placesLoading}
              aria-label="Refresh places"
              className="opacity-60 hover:opacity-100"
            >
              <RefreshCw
                className={`w-4 h-4 ${placesLoading ? "animate-spin" : ""}`}
              />
            </button>
          </div>

          <div className="flex gap-1 mb-2 flex-wrap">
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setNearbyTab(t.id)}
                className={`text-xs px-2 py-0.5 rounded-full border transition ${
                  nearbyTab === t.id
                    ? "bg-indigo-500 text-white border-indigo-500"
                    : isDark
                      ? "border-gray-600 hover:bg-gray-700"
                      : "border-gray-200 hover:bg-white"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {!coords ? (
            <p className="text-sm opacity-60">Tap “Use my location” to see cafés & fun spots</p>
          ) : placesLoading ? (
            <p className="text-sm opacity-60 animate-pulse">Searching Google Places…</p>
          ) : placesError ? (
            <p className="text-sm text-amber-500">{placesError}</p>
          ) : places.length === 0 ? (
            <p className="text-sm opacity-60">No results — try another tab</p>
          ) : (
            <ul className="space-y-2 max-h-36 overflow-y-auto scrollbar-thin">
              {places.map((p) => (
                <li key={p.id} className="text-sm">
                  <a
                    href={p.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium hover:underline inline-flex items-center gap-1 flex-wrap"
                  >
                    <span>{p.icon}</span>
                    {p.name}
                    {p.rating != null && (
                      <span className="inline-flex items-center gap-0.5 text-xs opacity-70">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        {p.rating.toFixed(1)}
                      </span>
                    )}
                    <ExternalLink className="w-3 h-3 opacity-60" />
                  </a>
                  {p.address && (
                    <p className="text-xs opacity-50 truncate">{p.address}</p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {suggestions.length > 0 && (
        <div className="mt-4">
          <p className="text-xs font-medium uppercase tracking-wide opacity-60 mb-2">
            Smart picks — drag to schedule
          </p>
          <div className="flex flex-wrap gap-2">
            {suggestions.slice(0, 4).map((a) => (
              <DraggableSuggestion key={a.id} activity={a} isDark={isDark} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveInsights;

import { useState, useEffect, useCallback } from "react";
import type { GeoCoords } from "./useGeolocation";
import { loadGoogleMaps, getGoogleMapsApiKey } from "@/lib/googleMaps";

export type NearbyTab = "food" | "fun" | "all";

export interface NearbyPlace {
  id: string;
  name: string;
  address: string;
  rating?: number;
  mapsUrl: string;
  icon: string;
}

const TAB_TYPES: Record<NearbyTab, string[]> = {
  food: ["cafe", "restaurant", "bakery", "meal_takeaway"],
  fun: [
    "tourist_attraction",
    "amusement_center",
    "movie_theater",
    "park",
    "museum",
    "bowling_alley",
  ],
  all: [
    "cafe",
    "restaurant",
    "tourist_attraction",
    "amusement_center",
    "bar",
    "movie_theater",
  ],
};

const TYPE_ICONS: Record<string, string> = {
  cafe: "☕",
  restaurant: "🍽️",
  bakery: "🥐",
  tourist_attraction: "📍",
  amusement_center: "🎢",
  movie_theater: "🎬",
  park: "🌳",
  museum: "🏛️",
  bar: "🍹",
  bowling_alley: "🎳",
};

/** REST fallback via Vite dev proxy (same pattern as pharmacy apps). */
async function fetchNearbyRest(
  coords: GeoCoords,
  tab: NearbyTab
): Promise<NearbyPlace[]> {
  const key = getGoogleMapsApiKey();
  if (!key) return [];

  const type = tab === "food" ? "cafe" : tab === "fun" ? "tourist_attraction" : "restaurant";
  const { latitude, longitude } = coords;
  const url = `/google-places/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=4000&type=${type}&key=${key}`;

  const res = await fetch(url);
  const data = await res.json();

  if (data.status !== "OK" && data.status !== "ZERO_RESULTS") {
    throw new Error(data.error_message || data.status || "Places API error");
  }

  const results = data.results ?? [];
  return results.slice(0, 8).map(
    (p: {
      place_id: string;
      name: string;
      vicinity?: string;
      formatted_address?: string;
      rating?: number;
      types?: string[];
    }) => ({
      id: p.place_id,
      name: p.name,
      address: p.vicinity || p.formatted_address || "",
      rating: p.rating,
      mapsUrl: `https://www.google.com/maps/place/?q=place_id:${p.place_id}`,
      icon: TYPE_ICONS[p.types?.[0] ?? ""] ?? "📍",
    })
  );
}

async function fetchNearbyJs(
  coords: GeoCoords,
  tab: NearbyTab
): Promise<NearbyPlace[]> {
  await loadGoogleMaps();
  const { Place, SearchNearbyRankPreference } =
    (await google.maps.importLibrary("places")) as google.maps.PlacesLibrary;

  const types = TAB_TYPES[tab];

  const { places } = await Place.searchNearby({
    fields: [
      "id",
      "displayName",
      "formattedAddress",
      "location",
      "rating",
      "types",
      "googleMapsURI",
    ],
    locationRestriction: {
      center: {
        lat: coords.latitude,
        lng: coords.longitude,
      },
      radius: 4000,
    },
    includedPrimaryTypes: types,
    maxResultCount: 10,
    rankPreference: SearchNearbyRankPreference.POPULARITY,
  });

  const seen = new Set<string>();
  const out: NearbyPlace[] = [];

  for (const place of places) {
    const id = place.id ?? place.displayName ?? "";
    if (!id || seen.has(id)) continue;
    seen.add(id);

    const primaryType = place.types?.[0] ?? "";
    out.push({
      id,
      name: place.displayName ?? "Unknown",
      address: place.formattedAddress ?? "",
      rating: place.rating ?? undefined,
      mapsUrl:
        place.googleMapsURI ??
        `https://www.google.com/maps/search/?api=1&query=${place.location?.lat()},${place.location?.lng()}`,
      icon: TYPE_ICONS[primaryType] ?? "📍",
    });
  }

  return out;
}

export function useGoogleNearby(
  coords: GeoCoords | null,
  tab: NearbyTab = "all"
) {
  const [places, setPlaces] = useState<NearbyPlace[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPlaces = useCallback(async () => {
    if (!coords) return;
    if (!getGoogleMapsApiKey()) {
      setError(
        "Google API key missing. Set VITE_GOOGLE_MAPS_API_KEY on your host, then redeploy."
      );
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let results: NearbyPlace[] = [];
      try {
        results = await fetchNearbyJs(coords, tab);
      } catch {
        results = await fetchNearbyRest(coords, tab);
      }
      setPlaces(results);
      if (results.length === 0) {
        setError("No places found nearby — try another category.");
      }
    } catch (e) {
      setPlaces([]);
      setError(e instanceof Error ? e.message : "Could not load nearby places");
    } finally {
      setLoading(false);
    }
  }, [coords, tab]);

  useEffect(() => {
    fetchPlaces();
  }, [fetchPlaces]);

  return { places, loading, error, refetch: fetchPlaces };
}

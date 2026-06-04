import { useState, useCallback } from "react";

export interface GeoCoords {
  latitude: number;
  longitude: number;
}

export function useGeolocation() {
  const [coords, setCoords] = useState<GeoCoords | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported in this browser.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });
        setError(null);
        setLoading(false);
      },
      (err) => {
        setCoords(null);
        setLoading(false);
        if (err.code === err.PERMISSION_DENIED) {
          setError("Location blocked — allow access in browser settings, then retry.");
        } else if (err.code === err.TIMEOUT) {
          setError("Location timed out — try again.");
        } else {
          setError("Could not get your location — try again.");
        }
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  }, []);

  return { coords, error, loading, refresh };
}

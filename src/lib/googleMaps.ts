import { setOptions, importLibrary } from "@googlemaps/js-api-loader";

let initialized = false;

export function getGoogleMapsApiKey(): string | undefined {
  return import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
}

export async function loadGoogleMaps(): Promise<typeof google> {
  const apiKey = getGoogleMapsApiKey();
  if (!apiKey) {
    throw new Error("Add VITE_GOOGLE_MAPS_API_KEY to .env.local");
  }

  if (!initialized) {
    setOptions({ key: apiKey, v: "weekly" });
    initialized = true;
  }

  await importLibrary("places");
  return google;
}

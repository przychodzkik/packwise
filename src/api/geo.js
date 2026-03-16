const GEO_API = "https://geocoding-api.open-meteo.com/v1/search";

export async function fetchGeoSuggestions(query, count = 6) {
  const url = new URL(GEO_API);
  url.searchParams.set("name", query);
  url.searchParams.set("count", count);
  url.searchParams.set("language", "pl");
  url.searchParams.set("format", "json");

  const response = await fetch(url);
  if (!response.ok) throw new Error("Błąd API geolokalizacji");

  const data = await response.json();
  return data.results ?? [];
}

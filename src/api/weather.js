const WEATHER_API = "https://api.open-meteo.com/v1/forecast";

export async function fetchWeather(lat, lon, from, to) {
  const url = new URL(WEATHER_API);
  url.searchParams.set("latitude", lat);
  url.searchParams.set("longitude", lon);
  url.searchParams.set("daily", "temperature_2m_max,temperature_2m_min,precipitation_sum,weather_code");
  url.searchParams.set("timezone", "auto");
  url.searchParams.set("start_date", from);
  url.searchParams.set("end_date", to);

  const response = await fetch(url);
  if (!response.ok) throw new Error("Błąd API pogodowego");

  const data = await response.json();
  if (!data.daily) throw new Error(data.reason ?? "Nie udało się pobrać prognozy pogody");

  return data.daily;
}

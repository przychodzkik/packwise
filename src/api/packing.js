import { weatherLabel } from "../constants/weather.js";
import { shortDay, nightsCount, pluralNights } from "../utils/date.js";

const OPENAI_API = "https://api.openai.com/v1/chat/completions";

function buildPrompt(legWeatherData, accommodation) {
  const totalNights = legWeatherData.reduce((sum, l) => sum + nightsCount(l.dateFrom, l.dateTo), 0);

  const legSummaries = legWeatherData.map((leg, i) => {
    const days = leg.daily.time.map((t, j) => ({
      date: shortDay(t),
      maxTemp: Math.round(leg.daily.temperature_2m_max[j]),
      minTemp: Math.round(leg.daily.temperature_2m_min[j]),
      rain: leg.daily.precipitation_sum[j],
      desc: weatherLabel(leg.daily.weather_code[j]),
    }));

    const avgMax = Math.round(days.reduce((a, d) => a + d.maxTemp, 0) / days.length);
    const avgMin = Math.round(days.reduce((a, d) => a + d.minTemp, 0) / days.length);
    const rainDays = days.filter((d) => d.rain > 1).length;
    const nights = nightsCount(leg.dateFrom, leg.dateTo);
    const weatherSummary = days
      .map((d) => `  ${d.date}: ${d.maxTemp}°/${d.minTemp}°C, ${d.desc}, opady: ${d.rain}mm`)
      .join("\n");

    return (
      `Etap ${i + 1}: ${leg.geo.name}, ${leg.geo.country} — ${nights} ${pluralNights(nights)}\n` +
      `${weatherSummary}\n` +
      `  Średnia maks: ${avgMax}°C, min: ${avgMin}°C, dni z deszczem: ${rainDays}/${days.length}`
    );
  });

  const accommParts = [
    accommodation.hotel   && "hotel (ręczniki, mydło, szampon zapewnione — NIE dodawaj ich do listy)",
    accommodation.airbnb  && "Airbnb/apartament",
    accommodation.camping && "kemping/namiot (dodaj śpiwór, karimatę, latarkę)",
  ].filter(Boolean);

  const accommLine = accommParts.length > 0
    ? `\nZakwaterowanie: ${accommParts.join(" + ")}`
    : "";

  return (
    `Planuję podróż na łącznie ${totalNights} ${pluralNights(totalNights)}.${accommLine}\n\n` +
    `${legSummaries.join("\n\n")}\n\n` +
    `Wygeneruj listę rzeczy do spakowania na całą podróż, uwzględniając wszystkie etapy i zmienną pogodę.\n` +
    `Odpowiedz TYLKO w formacie JSON (bez markdown ani komentarzy):\n` +
    `{\n` +
    `  "alerts": ["ostrzeżenia pogodowe lub praktyczne wskazówki"],\n` +
    `  "sections": [\n` +
    `    {"name": "Ubrania", "items": [{"name": "...", "qty": "...", "note": "..."}]},\n` +
    `    {"name": "Buty", "items": [...]},\n` +
    `    {"name": "Toaleta", "items": [...]},\n` +
    `    {"name": "Elektronika", "items": [...]},\n` +
    `    {"name": "Dokumenty", "items": [...]},\n` +
    `    {"name": "Zdrowie", "items": [...]},\n` +
    `    {"name": "Inne", "items": [...]}\n` +
    `  ]\n` +
    `}\n` +
    `Bądź konkretny i praktyczny. Pisz po polsku.`
  );
}

export async function fetchPackingList(legWeatherData, accommodation) {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  if (!apiKey) throw new Error("Brak klucza API. Ustaw VITE_OPENAI_API_KEY w pliku .env");

  const response = await fetch(OPENAI_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o",
      max_tokens: 2048,
      messages: [{ role: "user", content: buildPrompt(legWeatherData, accommodation) }],
    }),
  });

  const data = await response.json();
  const text = data.choices?.[0]?.message?.content ?? "";
  if (!text) throw new Error(data.error?.message ?? "Błąd API");

  return JSON.parse(text.replace(/```json|```/g, "").trim());
}

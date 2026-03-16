import { useState, useCallback } from "react";

const STORAGE_KEY = "packwise_history";
const MAX_ENTRIES = 5;

function readHistory() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
  } catch {
    return [];
  }
}

export function useHistory() {
  const [history, setHistory] = useState(readHistory);

  const save = useCallback((legs, accommodation) => {
    const entry = {
      legs: legs.map(({ city, geoName, lat, lon, country, dateFrom, dateTo }) => ({
        city, geoName, lat, lon, country, dateFrom, dateTo,
      })),
      accommodation,
      timestamp: Date.now(),
    };

    setHistory((prev) => {
      const keyOf = (h) => h.legs.map((l) => l.city).join(",") + h.legs[0]?.dateFrom;
      const deduped = prev.filter((h) => keyOf(h) !== keyOf(entry));
      const updated = [entry, ...deduped].slice(0, MAX_ENTRIES);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  return { history, save };
}

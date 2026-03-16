import { useState, useRef, useEffect } from "react";
import { fetchGeoSuggestions } from "../api/geo.js";

const DEBOUNCE_MS = 300;
const MIN_QUERY_LENGTH = 2;

export function useCityAutocomplete() {
  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  function onQueryChange(query) {
    clearTimeout(timerRef.current);

    if (query.length < MIN_QUERY_LENGTH) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    timerRef.current = setTimeout(async () => {
      try {
        const results = await fetchGeoSuggestions(query);
        setSuggestions(results);
        setIsOpen(results.length > 0);
      } catch {
        setSuggestions([]);
        setIsOpen(false);
      }
    }, DEBOUNCE_MS);
  }

  function onSelect() {
    setSuggestions([]);
    setIsOpen(false);
  }

  function onFocus() {
    if (suggestions.length > 0) setIsOpen(true);
  }

  function close() {
    setIsOpen(false);
  }

  return { suggestions, isOpen, onQueryChange, onSelect, onFocus, close };
}

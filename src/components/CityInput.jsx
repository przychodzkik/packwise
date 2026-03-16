import { useRef, useEffect } from "react";
import { useCityAutocomplete } from "../hooks/useCityAutocomplete.js";

export function CityInput({ value, onChange, onSelect, placeholder }) {
  const wrapRef = useRef(null);
  const { suggestions, isOpen, onQueryChange, onSelect: closeDropdown, onFocus, close } =
    useCityAutocomplete();

  useEffect(() => {
    function handleClickOutside(e) {
      if (!wrapRef.current?.contains(e.target)) close();
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [close]);

  function handleChange(e) {
    onChange(e.target.value);
    onQueryChange(e.target.value);
  }

  function handleSelect(result) {
    onSelect(result);
    closeDropdown();
  }

  return (
    <div ref={wrapRef} className="suggestion-wrap">
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        onFocus={onFocus}
        autoComplete="off"
        aria-autocomplete="list"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      />
      {isOpen && (
        <ul className="suggestions" role="listbox">
          {suggestions.map((s) => (
            <li
              key={s.id}
              className="suggestion-item"
              role="option"
              onMouseDown={() => handleSelect(s)}
            >
              <span className="sugg-name">{s.name}</span>
              <span className="sugg-country">
                {s.admin1 ? `${s.admin1}, ` : ""}{s.country}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

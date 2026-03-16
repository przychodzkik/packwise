import { memo } from "react";

const OPTIONS = [
  { key: "hotel",   label: "🏨 Hotel" },
  { key: "airbnb",  label: "🏠 Airbnb" },
  { key: "camping", label: "⛺ Kemping" },
];

export const AccommodationPicker = memo(function AccommodationPicker({ value, onToggle }) {
  return (
    <div className="form-group">
      <label>Zakwaterowanie (opcjonalnie)</label>
      <div className="accommodation-group" role="group" aria-label="Typ zakwaterowania">
        {OPTIONS.map(({ key, label }) => (
          <button
            key={key}
            className={`accomm-btn${value[key] ? " active" : ""}`}
            onClick={() => onToggle(key)}
            aria-pressed={value[key]}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
});

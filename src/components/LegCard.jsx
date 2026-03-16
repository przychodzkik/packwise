import { memo } from "react";
import { CityInput } from "./CityInput.jsx";

export const LegCard = memo(function LegCard({
  leg, index, isOnly, today, onUpdate, onSelectGeo, onRemove,
}) {
  return (
    <div className="leg-card">
      <div className="leg-header">
        <span className="leg-label">{isOnly ? "Cel podróży" : `Etap ${index + 1}`}</span>
        {!isOnly && (
          <button
            className="leg-remove"
            onClick={() => onRemove(leg.id)}
            aria-label={`Usuń etap ${index + 1}`}
          >
            Usuń
          </button>
        )}
      </div>

      <div className="form-group">
        <label>Miasto</label>
        <CityInput
          value={leg.city}
          onChange={(val) => onUpdate(leg.id, "city", val)}
          onSelect={(r) => onSelectGeo(leg.id, r)}
          placeholder="np. Barcelona, Paryż, Kraków…"
        />
      </div>

      <div className="form-group" style={{ marginBottom: 0 }}>
        <label>Daty</label>
        <div className="date-row">
          <input
            type="date"
            value={leg.dateFrom}
            min={today}
            onChange={(e) => onUpdate(leg.id, "dateFrom", e.target.value)}
            aria-label="Data wyjazdu"
          />
          <input
            type="date"
            value={leg.dateTo}
            min={leg.dateFrom || today}
            onChange={(e) => onUpdate(leg.id, "dateTo", e.target.value)}
            aria-label="Data powrotu"
          />
        </div>
      </div>
    </div>
  );
});

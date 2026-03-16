import { memo } from "react";
import { formatDate } from "../utils/date.js";

export const HistoryList = memo(function HistoryList({ history, onLoad }) {
  if (history.length === 0) return null;

  return (
    <div className="history-section">
      <label>Ostatnie wyjazdy</label>
      <div className="history-list">
        {history.map((entry, i) => (
          <button key={i} className="history-item" onClick={() => onLoad(entry)}>
            <span className="history-cities">
              {entry.legs.map((l) => l.geoName ?? l.city).join(" → ")}
            </span>
            <span className="history-dates">{formatDate(entry.legs[0]?.dateFrom)}</span>
          </button>
        ))}
      </div>
    </div>
  );
});

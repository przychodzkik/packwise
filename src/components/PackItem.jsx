import { memo } from "react";

export const PackItem = memo(function PackItem({ item, itemKey, checked, onToggle }) {
  function handleKeyDown(e) {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      onToggle(itemKey);
    }
  }

  return (
    <div
      className={`pack-item${checked ? " checked" : ""}`}
      onClick={() => onToggle(itemKey)}
      onKeyDown={handleKeyDown}
      role="checkbox"
      aria-checked={checked}
      tabIndex={0}
    >
      <div className="check-box" aria-hidden="true">
        <span className="check-mark">✓</span>
      </div>
      <div className="item-content">
        <div className="item-name">{item.name}</div>
        {item.note && <div className="item-note">{item.note}</div>}
      </div>
      {item.qty && <span className="item-qty">{item.qty}</span>}
    </div>
  );
});

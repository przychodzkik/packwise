import { memo } from "react";
import { PackItem } from "./PackItem.jsx";
import { SECTION_COLORS, SECTION_ICONS } from "../constants/sections.js";

export const PackingSection = memo(function PackingSection({ section, checked, onToggle }) {
  const { bg, color } = SECTION_COLORS[section.name] ?? { bg: "#f0f0f0", color: "#606060" };

  return (
    <div className="packing-section">
      <div className="section-header">
        <div className="section-icon" style={{ background: bg, color }} aria-hidden="true">
          {SECTION_ICONS[section.name] ?? "📦"}
        </div>
        <span className="section-name">{section.name}</span>
      </div>

      <div className="items-list" role="group" aria-label={section.name}>
        {section.items.map((item, idx) => {
          const key = `${section.name}-${idx}`;
          return (
            <PackItem
              key={key}
              item={item}
              itemKey={key}
              checked={!!checked[key]}
              onToggle={onToggle}
            />
          );
        })}
      </div>
      <div className="divider" />
    </div>
  );
});

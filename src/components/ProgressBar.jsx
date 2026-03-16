import { memo } from "react";

export const ProgressBar = memo(function ProgressBar({ checked, total }) {
  const pct = total > 0 ? Math.round((checked / total) * 100) : 0;

  return (
    <>
      <div
        className="progress-bar"
        role="progressbar"
        aria-valuenow={checked}
        aria-valuemin={0}
        aria-valuemax={total}
        aria-label="Postęp pakowania"
      >
        <div className="progress-fill" style={{ width: `${pct}%` }} />
      </div>
      <p className="progress-text">Spakowano: {checked} / {total} rzeczy</p>
    </>
  );
});

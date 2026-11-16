import type { CSSProperties } from "react";

const STEPS = 1000;

interface PriceSliderProps {
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
  marker?: number | null;
  markerLabel?: string;
  label: string;
  valueText: string;
  ends: [string, string, string];
}

// A price slider on a log scale between min and max, so wide ranges
// (cents to hundreds of euros) stay usable. `marker` draws a labelled tick.
export default function PriceSlider({ value, min, max, onChange, marker, markerLabel, label, valueText, ends }: PriceSliderProps) {
  const toPos = (v: number): number =>
    Math.round((Math.log(Math.min(max, Math.max(min, v)) / min) / Math.log(max / min)) * STEPS);
  const toPrice = (pos: number): number => {
    const v = min * Math.pow(max / min, pos / STEPS);
    return Number(v.toPrecision(v < 10 ? 3 : 4));
  };
  const style = {
    "--pos": `${toPos(value) / 10}%`,
    ...(marker != null ? { "--avg": `${toPos(marker) / 10}%` } : {}),
  } as CSSProperties;

  return (
    <div className="goods-slider" style={style}>
      {marker != null && (
        <span className="goods-avg" aria-hidden="true">
          <span>{markerLabel}</span>
        </span>
      )}
      <input
        type="range"
        min="0"
        max={STEPS}
        step="1"
        value={toPos(value)}
        aria-label={label}
        aria-valuetext={valueText}
        onChange={(e) => onChange(toPrice(Number(e.target.value)))}
      />
      <div className="goods-ends">
        <span>{ends[0]}</span>
        <span>{ends[1]}</span>
        <span>{ends[2]}</span>
      </div>
    </div>
  );
}

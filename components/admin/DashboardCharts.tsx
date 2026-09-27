"use client";

import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";

/**
 * Hand-rolled SVG charts for the admin dashboard.
 *
 * No chart library on purpose: the panel only needs two shapes, and drawing
 * them here keeps the bundle small and the styling on the Seawise palette.
 * Everything is drawn in real pixels (width from a ResizeObserver) instead of a
 * stretched viewBox, so strokes stay 2px and labels never squash on a phone.
 */

/** Series colours. Brand-adjacent green and a warm red, checked for colour
 *  blindness separation and contrast on the white card. sea-foam itself is too
 *  grey to read as a data colour next to red. */
export const CHART_COLORS = {
  income: "#12876F",
  expense: "#D4533B",
  leads: "#12876F",
} as const;

const AXIS_INK = "rgba(19,42,34,0.5)";
const GRID_INK = "rgba(19,42,34,0.08)";

function useWidth<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setWidth(Math.floor(entry.contentRect.width)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, width] as const;
}

/** Rounds the axis max up to a readable step (1, 2, 2.5, 5 × 10ⁿ). */
function niceTicks(max: number, count = 4): number[] {
  if (max <= 0) return [0, 1];
  const raw = max / count;
  const mag = 10 ** Math.floor(Math.log10(raw));
  const step = [1, 2, 2.5, 5, 10].map((m) => m * mag).find((s) => s >= raw) ?? raw;
  const ticks: number[] = [];
  for (let v = 0; v <= max + step * 0.001; v += step) ticks.push(v);
  if (ticks[ticks.length - 1] < max) ticks.push(ticks[ticks.length - 1] + step);
  return ticks;
}

/**
 * Monotone cubic path (Fritsch–Carlson). A plain Catmull-Rom curve overshoots
 * between points, which on a money chart draws a dip below Rp0 that never
 * happened. Monotone keeps the curve smooth without inventing values.
 */
function smoothPath(pts: [number, number][]): string {
  const n = pts.length;
  if (n === 0) return "";
  if (n === 1) return `M${pts[0][0]},${pts[0][1]}`;
  const dx: number[] = [];
  const slope: number[] = [];
  for (let i = 0; i < n - 1; i++) {
    dx.push(pts[i + 1][0] - pts[i][0]);
    slope.push((pts[i + 1][1] - pts[i][1]) / dx[i]);
  }
  const t: number[] = [slope[0]];
  for (let i = 1; i < n - 1; i++) {
    t.push(slope[i - 1] * slope[i] <= 0 ? 0 : (slope[i - 1] + slope[i]) / 2);
  }
  t.push(slope[n - 2]);
  for (let i = 0; i < n - 1; i++) {
    if (slope[i] === 0) {
      t[i] = 0;
      t[i + 1] = 0;
      continue;
    }
    const a = t[i] / slope[i];
    const b = t[i + 1] / slope[i];
    const h = a * a + b * b;
    if (h > 9) {
      const k = 3 / Math.sqrt(h);
      t[i] = k * a * slope[i];
      t[i + 1] = k * b * slope[i];
    }
  }
  let d = `M${pts[0][0]},${pts[0][1]}`;
  for (let i = 0; i < n - 1; i++) {
    const [x0, y0] = pts[i];
    const [x1, y1] = pts[i + 1];
    const h = dx[i] / 3;
    d += ` C${x0 + h},${y0 + t[i] * h} ${x1 - h},${y1 - t[i + 1] * h} ${x1},${y1}`;
  }
  return d;
}

type Tip = { x: number; y: number; title: string; rows: { color: string; label: string; value: string }[] };

function Tooltip({ tip, width }: { tip: Tip; width: number }) {
  // Flip to the left of the crosshair once it would run off the card.
  const flip = tip.x > width - 170;
  return (
    <div
      className="pointer-events-none absolute z-10 min-w-[150px] rounded-xl border border-warm-neutral bg-white/95 px-3 py-2.5 text-xs shadow-lg backdrop-blur"
      style={{
        left: tip.x,
        top: tip.y,
        transform: `translate(${flip ? "calc(-100% - 12px)" : "12px"}, -50%)`,
      }}
    >
      <p className="font-medium text-forest-dark/60">{tip.title}</p>
      {tip.rows.map((r) => (
        <div key={r.label} className="mt-1.5 flex items-center gap-2">
          <span className="h-0.5 w-3 rounded-full" style={{ background: r.color }} />
          <span className="font-display text-sm font-bold text-forest-dark">{r.value}</span>
          <span className="ml-auto pl-3 text-forest-dark/50">{r.label}</span>
        </div>
      ))}
    </div>
  );
}

export type SeriesPoint = { label: string; values: number[] };
export type Series = { name: string; color: string };

/**
 * Smooth area chart with a crosshair tooltip. Every series shares one y-axis.
 * Arrow keys move the crosshair when the chart has focus.
 */
export function AreaChart({
  data,
  series,
  format,
  formatAxis,
  height = 240,
}: {
  data: SeriesPoint[];
  series: Series[];
  format: (n: number) => string;
  formatAxis: (n: number) => string;
  height?: number;
}) {
  const [ref, width] = useWidth<HTMLDivElement>();
  const [active, setActive] = useState<number | null>(null);

  const pad = { top: 12, right: 12, bottom: 28, left: 56 };
  const innerW = Math.max(0, width - pad.left - pad.right);
  const innerH = height - pad.top - pad.bottom;
  const max = Math.max(0, ...data.flatMap((d) => d.values));
  const ticks = niceTicks(max);
  const top = ticks[ticks.length - 1] || 1;
  const n = data.length;
  const xAt = (i: number) => pad.left + (n <= 1 ? innerW / 2 : (i / (n - 1)) * innerW);
  const yAt = (v: number) => pad.top + innerH - (v / top) * innerH;
  // On narrow screens every other month label is dropped so they never collide.
  const labelEvery = innerW / Math.max(1, n) < 44 ? 2 : 1;

  function onMove(e: PointerEvent<SVGRectElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const i = n <= 1 ? 0 : Math.round((x / rect.width) * (n - 1));
    setActive(Math.max(0, Math.min(n - 1, i)));
  }

  function onKey(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    e.preventDefault();
    const cur = active ?? (e.key === "ArrowLeft" ? n : -1);
    setActive(Math.max(0, Math.min(n - 1, cur + (e.key === "ArrowRight" ? 1 : -1))));
  }

  const tip: Tip | null =
    active !== null && data[active]
      ? {
          x: xAt(active),
          y: pad.top + innerH / 2,
          title: data[active].label,
          rows: series.map((s, si) => ({
            color: s.color,
            label: s.name,
            value: format(data[active].values[si] ?? 0),
          })),
        }
      : null;

  return (
    <div
      ref={ref}
      className="relative outline-none focus-visible:ring-2 focus-visible:ring-sea-foam/40 rounded-xl"
      style={{ height }}
      tabIndex={0}
      role="img"
      aria-label={`Grafik ${series.map((s) => s.name).join(" dan ")} per bulan. Gunakan panah kiri kanan untuk melihat nilai.`}
      onKeyDown={onKey}
      onBlur={() => setActive(null)}
    >
      {width > 0 && (
        <svg width={width} height={height} className="block overflow-visible">
          <defs>
            {series.map((s, si) => (
              <linearGradient key={s.name} id={`area-fill-${si}`} x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor={s.color} stopOpacity={0.22} />
                <stop offset="100%" stopColor={s.color} stopOpacity={0} />
              </linearGradient>
            ))}
          </defs>

          {ticks.map((t) => (
            <g key={t}>
              <line x1={pad.left} x2={pad.left + innerW} y1={yAt(t)} y2={yAt(t)} stroke={GRID_INK} />
              <text x={pad.left - 10} y={yAt(t)} dy="0.32em" textAnchor="end" fontSize={11} fill={AXIS_INK}>
                {formatAxis(t)}
              </text>
            </g>
          ))}

          {data.map((d, i) =>
            i % labelEvery === (n - 1) % labelEvery ? (
              <text key={d.label} x={xAt(i)} y={height - 8} textAnchor="middle" fontSize={11} fill={AXIS_INK}>
                {d.label}
              </text>
            ) : null
          )}

          {series.map((s, si) => {
            const pts = data.map((d, i) => [xAt(i), yAt(d.values[si] ?? 0)] as [number, number]);
            const line = smoothPath(pts);
            const area = pts.length
              ? `${line} L${pts[pts.length - 1][0]},${yAt(0)} L${pts[0][0]},${yAt(0)} Z`
              : "";
            return (
              <g key={s.name}>
                <path d={area} fill={`url(#area-fill-${si})`} className="dash-fade" />
                <path
                  d={line}
                  fill="none"
                  stroke={s.color}
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  pathLength={1}
                  className="dash-draw"
                />
              </g>
            );
          })}

          {active !== null && (
            <g>
              <line
                x1={xAt(active)}
                x2={xAt(active)}
                y1={pad.top}
                y2={pad.top + innerH}
                stroke="rgba(19,42,34,0.25)"
                strokeDasharray="3 3"
              />
              {series.map((s, si) => (
                <circle
                  key={s.name}
                  cx={xAt(active)}
                  cy={yAt(data[active].values[si] ?? 0)}
                  r={4.5}
                  fill={s.color}
                  stroke="#fff"
                  strokeWidth={2}
                />
              ))}
            </g>
          )}

          <rect
            x={pad.left - 8}
            y={pad.top}
            width={innerW + 16}
            height={innerH}
            fill="transparent"
            style={{ touchAction: "pan-y" }}
            onPointerMove={onMove}
            onPointerDown={onMove}
            onPointerLeave={() => setActive(null)}
          />
        </svg>
      )}
      {tip && <Tooltip tip={tip} width={width} />}
    </div>
  );
}

/** Single-series column chart. Each bar is its own hover target. */
export function ColumnChart({
  data,
  color,
  name,
  height = 200,
}: {
  data: { label: string; value: number }[];
  color: string;
  name: string;
  height?: number;
}) {
  const [ref, width] = useWidth<HTMLDivElement>();
  const [active, setActive] = useState<number | null>(null);

  const pad = { top: 18, right: 4, bottom: 28, left: 28 };
  const innerW = Math.max(0, width - pad.left - pad.right);
  const innerH = height - pad.top - pad.bottom;
  const max = Math.max(0, ...data.map((d) => d.value));
  // Counts are whole numbers, so the step is too. Filtering a 2.5 step down to
  // integers would drop the top tick and let the tallest bar poke past it.
  const step = Math.max(1, Math.ceil(Math.max(max, 3) / 3));
  const ticks = [0, step, step * 2, step * 3];
  const top = ticks[ticks.length - 1];
  const n = data.length;
  const slot = innerW / Math.max(1, n);
  const barW = Math.min(36, Math.max(6, slot - 8));
  const yAt = (v: number) => pad.top + innerH - (v / top) * innerH;
  const labelEvery = slot < 40 ? 2 : 1;

  return (
    <div ref={ref} className="relative" style={{ height }}>
      {width > 0 && (
        <svg width={width} height={height} className="block overflow-visible" role="img" aria-label={`Grafik ${name} per bulan`}>
          {ticks.map((t) => (
            <g key={t}>
              <line x1={pad.left} x2={pad.left + innerW} y1={yAt(t)} y2={yAt(t)} stroke={GRID_INK} />
              <text x={pad.left - 8} y={yAt(t)} dy="0.32em" textAnchor="end" fontSize={11} fill={AXIS_INK}>
                {t}
              </text>
            </g>
          ))}
          {data.map((d, i) => {
            const cx = pad.left + slot * i + slot / 2;
            const h = Math.max(0, yAt(0) - yAt(d.value));
            const r = Math.min(4, barW / 2, h);
            const x = cx - barW / 2;
            const y = yAt(d.value);
            const isActive = active === i;
            return (
              <g
                key={d.label}
                tabIndex={0}
                className="outline-none"
                onPointerEnter={() => setActive(i)}
                onPointerDown={() => setActive(i)}
                onPointerLeave={() => setActive(null)}
                onFocus={() => setActive(i)}
                onBlur={() => setActive(null)}
                aria-label={`${d.label}: ${d.value} ${name}`}
              >
                {/* Hit area is the whole column slot, not just the painted bar. */}
                <rect x={pad.left + slot * i} y={pad.top} width={slot} height={innerH} fill={isActive ? "rgba(19,42,34,0.04)" : "transparent"} />
                {h > 0 && (
                  <path
                    d={`M${x},${yAt(0)} V${y + r} Q${x},${y} ${x + r},${y} H${x + barW - r} Q${x + barW},${y} ${x + barW},${y + r} V${yAt(0)} Z`}
                    fill={color}
                    opacity={active === null || isActive ? 1 : 0.55}
                    className="dash-grow"
                    style={{ transformOrigin: `${cx}px ${yAt(0)}px`, transition: "opacity 150ms" }}
                  />
                )}
                {isActive && (
                  <text x={cx} y={y - 6} textAnchor="middle" fontSize={12} fontWeight={700} fill="#132A22">
                    {d.value}
                  </text>
                )}
                {i % labelEvery === (n - 1) % labelEvery && (
                  <text x={cx} y={height - 8} textAnchor="middle" fontSize={11} fill={AXIS_INK}>
                    {d.label}
                  </text>
                )}
              </g>
            );
          })}
          <line x1={pad.left} x2={pad.left + innerW} y1={yAt(0)} y2={yAt(0)} stroke="rgba(19,42,34,0.2)" />
        </svg>
      )}
    </div>
  );
}

/** Horizontal share bars, for "where did it come from / go to" breakdowns. */
export function ShareBars({
  items,
  color,
  format,
}: {
  items: { label: string; value: number }[];
  color: string;
  format: (n: number) => string;
}) {
  const total = items.reduce((a, b) => a + b.value, 0) || 1;
  const max = Math.max(1, ...items.map((i) => i.value));
  return (
    <ul className="space-y-3.5">
      {items.map((it) => (
        <li key={it.label}>
          <div className="flex items-baseline justify-between gap-3 text-sm">
            <span className="truncate text-forest-dark/80">{it.label}</span>
            <span className="shrink-0 font-medium text-forest-dark">
              {format(it.value)}
              <span className="ml-1.5 text-xs font-normal text-forest-dark/45">
                {Math.round((it.value / total) * 100)}%
              </span>
            </span>
          </div>
          <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-warm-neutral/70">
            <div
              className="dash-grow-x h-full rounded-full"
              style={{ width: `${(it.value / max) * 100}%`, background: color }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}

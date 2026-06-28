// Tiny zero-dependency SVG chart primitives, brand-coloured. Server-renderable.

const BLUE = "#2E6BFF";
const INK = "#0E1B2A";

export function Sparkline({ data, color = BLUE, width = 120, height = 34, strokeWidth = 2 }: { data: number[]; color?: string; width?: number; height?: number; strokeWidth?: number }) {
  if (data.length < 2) return null;
  const min = Math.min(...data, 0);
  const max = Math.max(...data, 0);
  const span = max - min || 1;
  const dx = width / (data.length - 1);
  const y = (v: number) => height - ((v - min) / span) * height;
  const pts = data.map((v, i) => `${(i * dx).toFixed(1)},${y(v).toFixed(1)}`).join(" ");
  const zeroY = y(0);
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
      {min < 0 && <line x1="0" y1={zeroY} x2={width} y2={zeroY} stroke="#E3E0D8" strokeWidth="1" strokeDasharray="2 2" />}
      <polyline points={pts} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={(data.length - 1) * dx} cy={y(data[data.length - 1])} r={2.5} fill={color} />
    </svg>
  );
}

// Grouped thin bars: spend (muted) vs revenue (blue) per day.
export function SpendRevenueBars({ series, height = 120 }: { series: { date: string; spend: number; revenue: number }[]; height?: number }) {
  const max = Math.max(...series.flatMap((d) => [d.spend, d.revenue]), 1);
  const n = series.length;
  const groupW = 100 / n;
  const barW = groupW * 0.32;
  return (
    <div>
      <svg width="100%" height={height} viewBox={`0 0 100 ${height}`} preserveAspectRatio="none" className="overflow-visible">
        {series.map((d, i) => {
          const gx = i * groupW + groupW / 2;
          const sh = (d.spend / max) * (height - 6);
          const rh = (d.revenue / max) * (height - 6);
          return (
            <g key={d.date}>
              <rect x={gx - barW - 0.4} y={height - sh} width={barW} height={sh} rx="0.6" fill="#C9D2DD" />
              <rect x={gx + 0.4} y={height - rh} width={barW} height={rh} rx="0.6" fill={BLUE} />
            </g>
          );
        })}
      </svg>
      <div className="mt-2 flex items-center gap-4 text-xs text-slate">
        <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm" style={{ background: "#C9D2DD" }} /> Spend</span>
        <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm" style={{ background: BLUE }} /> Revenue</span>
      </div>
    </div>
  );
}

export function ProgressRing({ value, size = 132, stroke = 12, color = BLUE, label, sublabel }: { value: number; size?: number; stroke?: number; color?: string; label: string; sublabel?: string }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(1, value));
  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#EAE7DE" strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - pct)} />
      </svg>
      <div className="absolute text-center">
        <p className="text-2xl font-bold tabular-nums text-ink">{label}</p>
        {sublabel && <p className="text-[11px] text-slate">{sublabel}</p>}
      </div>
    </div>
  );
}

export function ProgressBar({ value, color = BLUE }: { value: number; color?: string }) {
  const pct = Math.max(0, Math.min(1, value)) * 100;
  return (
    <div className="h-2.5 w-full overflow-hidden rounded-full bg-chalk">
      <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
    </div>
  );
}

// Horizontal labelled bar list (e.g. flow revenue, platform followers).
export function BarList({ items, color = INK, format }: { items: { label: string; value: number; hint?: string }[]; color?: string; format?: (n: number) => string }) {
  const max = Math.max(...items.map((i) => i.value), 1);
  return (
    <div className="space-y-3">
      {items.map((it) => (
        <div key={it.label}>
          <div className="mb-1 flex items-center justify-between text-sm">
            <span className="text-ink">{it.label}</span>
            <span className="tabular-nums text-slate">{format ? format(it.value) : it.value}{it.hint ? ` · ${it.hint}` : ""}</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-chalk">
            <div className="h-full rounded-full" style={{ width: `${(it.value / max) * 100}%`, background: color }} />
          </div>
        </div>
      ))}
    </div>
  );
}

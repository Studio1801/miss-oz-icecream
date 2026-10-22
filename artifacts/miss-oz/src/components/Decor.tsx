// Shared 1950s–60s soda-fountain decorations: pennant bunting + atomic starbursts.
// All decorative and aria-hidden; animations self-disable under prefers-reduced-motion (see index.css).

const BUNTING_COLORS = [
  'var(--berry)',
  'var(--gold-hi)',
  'var(--teal)',
  'var(--pink)',
  'var(--brick)',
];

export function Bunting({ className = '', count = 40 }: { className?: string; count?: number }) {
  return (
    <div className={`bunting ${className}`} aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <span
          key={i}
          className="pennant"
          style={{ color: BUNTING_COLORS[i % BUNTING_COLORS.length] }}
        />
      ))}
    </div>
  );
}

export function Starburst({
  size = 120,
  color = 'var(--gold)',
  spikes = 18,
  className = '',
}: {
  size?: number;
  color?: string;
  spikes?: number;
  className?: string;
}) {
  const pts: string[] = [];
  const cx = 50, cy = 50, rOuter = 49, rInner = 33;
  for (let i = 0; i < spikes * 2; i++) {
    const r = i % 2 ? rInner : rOuter;
    const a = (i / (spikes * 2)) * Math.PI * 2 - Math.PI / 2;
    pts.push(`${(cx + Math.cos(a) * r).toFixed(2)},${(cy + Math.sin(a) * r).toFixed(2)}`);
  }
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className={className} aria-hidden="true">
      <polygon points={pts.join(' ')} fill={color} />
      <circle cx="50" cy="50" r="20" fill="none" stroke={color} strokeWidth="2.5" opacity="0.55" />
    </svg>
  );
}

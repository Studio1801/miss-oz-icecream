import type { CSSProperties } from 'react';

/** Photo framing saved from the dashboard: "x y zoom" (percent, percent, 1 to 3). */
export function cropStyle(crop?: string | null): CSSProperties | null {
  const m = String(crop ?? '').trim().match(/^(-?[\d.]+)\s+(-?[\d.]+)(?:\s+([\d.]+))?$/);
  if (!m) return null;
  const x = Math.min(100, Math.max(0, Number(m[1])));
  const y = Math.min(100, Math.max(0, Number(m[2])));
  const z = Math.min(3, Math.max(1, Number(m[3] ?? 1)));
  if (![x, y, z].every(Number.isFinite)) return null;
  return {
    objectPosition: `${x}% ${y}%`,
    transform: z > 1 ? `scale(${z})` : undefined,
    transformOrigin: `${x}% ${y}%`,
  };
}

const norm = (s: string) => s.replace(/[’']/g, '').trim().toLowerCase();
/** Find the synced menu item a photo belongs to (photos are matched by name). */
export function cropFor(items: { name: string; crop?: string }[], caption: string) {
  return items.find((i) => norm(i.name) === norm(caption))?.crop;
}

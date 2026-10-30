import { useEffect, useState } from 'react';

/** Google Apps Script web app backed by the "Miss Oz Database" Google Sheet.
 * The owner dashboard edits the Menu tab; the site reads it here and drops every
 * form submission into the Submissions tab. */
export const SHEET_URL =
  'https://script.google.com/macros/s/AKfycbwnYVZG5SwY9K0mBQZVsnqAGU00QXDr1m7Pqri8qlPX6GIbKZh4Ru9UsrsSSlLVgFCt/exec';

/** Category names exactly as the dashboard writes them. */
export type SheetCategory = 'Ice cream flavors' | 'Sundaes' | 'Croffles' | 'Cookies & desserts' | 'Drinks';

export type SheetMenuRow = { category: string; name: string; description: string; price: string };

let menuRequest: Promise<SheetMenuRow[] | null> | null = null;

function loadMenu(): Promise<SheetMenuRow[] | null> {
  if (!menuRequest) {
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), 6000);
    menuRequest = fetch(`${SHEET_URL}?action=menu`, { signal: controller.signal })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => (data && data.ok && Array.isArray(data.menu) && data.menu.length ? (data.menu as SheetMenuRow[]) : null))
      .catch(() => null)
      .finally(() => window.clearTimeout(timer));
  }
  return menuRequest;
}

/** null until the Sheet answers (or if it is unreachable/empty): callers then keep the built-in menu. */
export function useSheetMenu(): SheetMenuRow[] | null {
  const [rows, setRows] = useState<SheetMenuRow[] | null>(null);
  useEffect(() => {
    let alive = true;
    loadMenu().then((r) => alive && setRows(r));
    return () => {
      alive = false;
    };
  }, []);
  return rows;
}

const norm = (s: string) => s.replace(/[’']/g, '').trim().toLowerCase();

type Named = { name: string; note?: string; price?: string; seasonalLabel?: string };

/** Apply the Sheet to one category: only dishes the owner has on the menu, in her order,
 * with her descriptions and prices. Dishes she added in the dashboard appear as new items. */
export function syncCategory<T extends Named>(
  base: T[],
  rows: SheetMenuRow[] | null,
  category: SheetCategory,
  makeNew: (row: SheetMenuRow) => T,
): T[] {
  if (!rows) return base;
  return rows
    .filter((row) => row.category === category && String(row.name).trim())
    .map((row) => {
      const match = base.find((item) => norm(item.name) === norm(String(row.name)));
      const description = String(row.description ?? '').trim();
      const price = String(row.price ?? '').trim() || undefined;
      if (!match) return makeNew(row);
      if (match.seasonalLabel && (!description || description === match.seasonalLabel)) return { ...match, price };
      return { ...match, note: description || match.note, price };
    });
}

export type SubmissionType = 'cake' | 'wholesale' | 'event' | 'contact' | 'vote';

/** Fire-and-forget copy of a form submission into the Sheet. Never blocks or breaks the form. */
export function sendToSheet(sub: {
  type: SubmissionType;
  name?: string;
  email?: string;
  phone?: string;
  detail: string;
  note?: string;
}) {
  try {
    void fetch(SHEET_URL, {
      method: 'POST',
      mode: 'no-cors',
      keepalive: true,
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ action: 'addSubmission', submission: { ...sub, source: 'website' } }),
    }).catch(() => {});
  } catch {
    /* ignore */
  }
}

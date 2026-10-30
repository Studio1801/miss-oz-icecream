import { useEffect, useState } from 'react';

/** Google Apps Script web app backed by the "Miss Oz Database" Google Sheet.
 * The owner dashboard edits the Menu tab; the site reads it here and drops every
 * form submission into the Submissions tab. */
export const SHEET_URL =
  'https://script.google.com/macros/s/AKfycbwnYVZG5SwY9K0mBQZVsnqAGU00QXDr1m7Pqri8qlPX6GIbKZh4Ru9UsrsSSlLVgFCt/exec';

/** Category names exactly as the dashboard writes them. */
export type SheetCategory = 'Ice cream flavors' | 'Sundaes' | 'Croffles' | 'Cookies & desserts' | 'Drinks';

export type SheetMenuRow = { category: string; name: string; description: string; price: string };

export type SiteData = { menu: SheetMenuRow[] | null; text: Record<string, string> };

/** One fresh read of the Sheet per page load: the live menu and all website text.
 * Never cached, so what the owner saved is what the next visitor sees. */
let siteRequest: Promise<SiteData | null> | null = null;
function loadSite(): Promise<SiteData | null> {
  if (!siteRequest) {
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), 6000);
    siteRequest = fetch(`${SHEET_URL}?action=site&_=${Date.now()}`, { signal: controller.signal, cache: 'no-store' })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!data || !data.ok) return null;
        const menu = Array.isArray(data.menu) && data.menu.length ? (data.menu as SheetMenuRow[]) : null;
        const text = data.text && typeof data.text === 'object' ? (data.text as Record<string, string>) : {};
        return { menu, text };
      })
      .catch(() => null)
      .finally(() => window.clearTimeout(timer));
  }
  return siteRequest;
}
// start the request as soon as the app loads, not when a section scrolls into view
if (typeof window !== 'undefined') void loadSite();

/** The Sheet's data once it arrives; null until then or if the Sheet can't be reached. */
export function useSiteData(): SiteData | null {
  const [data, setData] = useState<SiteData | null>(null);
  useEffect(() => {
    let alive = true;
    loadSite().then((d) => alive && setData(d));
    return () => {
      alive = false;
    };
  }, []);
  return data;
}

/** null until the Sheet answers (or if it is unreachable/empty): callers then keep the built-in menu. */
export function useSheetMenu(): SheetMenuRow[] | null {
  return useSiteData()?.menu ?? null;
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

/**
 * GET /api/site: the website's live menu and wording from the Google Sheet.
 *
 * The Apps Script behind the Sheet can take a second or two to answer, which made
 * the page show the built-in wording first and then swap. This function sits in
 * front of it and Vercel's edge keeps each answer for a few seconds, so visitors
 * get the Sheet's data in milliseconds. Changes in the dashboard reach the site
 * within about half a minute.
 */
import type { Req, Res } from "./_lib/mail";

const SHEET_URL =
  "https://script.google.com/macros/s/AKfycbwnYVZG5SwY9K0mBQZVsnqAGU00QXDr1m7Pqri8qlPX6GIbKZh4Ru9UsrsSSlLVgFCt/exec";

export default async function handler(_req: Req, res: Res) {
  try {
    const upstream = await fetch(`${SHEET_URL}?action=site`, { redirect: "follow" });
    const data = await upstream.json();
    if (!data || data.ok !== true) throw new Error("bad sheet answer");
    res.setHeader("Cache-Control", "public, s-maxage=5, stale-while-revalidate=25");
    res.status(200).json(data);
  } catch {
    res.setHeader("Cache-Control", "no-store");
    res.status(502).json({ ok: false });
  }
}

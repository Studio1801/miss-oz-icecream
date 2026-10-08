import { Router, type IRouter } from "express";
import { kv } from "@vercel/kv";
import { logger } from "../lib/logger";

const router: IRouter = Router();

const FLAVOR_NAMES = ["Earl Grey", "Vietnam Coffee", "Honey Lavender"];

/* Normalise a flavor name so minor casing/spacing differences still match */
function normalizeFlavor(name: string): string {
  return name.trim();
}

function kvKey(flavor: string): string {
  return `vote:${flavor}`;
}

/* In-memory fallback used when KV env vars are missing (local dev without KV) */
const memVotes = new Map<string, number>(
  FLAVOR_NAMES.map((f) => [f, 0]),
);

const kvUrl = process.env.KV_REST_API_URL ?? "";
const kvAvailable = Boolean(
  kvUrl.startsWith("https://") && process.env.KV_REST_API_TOKEN,
);

if (!kvAvailable) {
  logger.warn(
    { kvUrlPrefix: kvUrl.slice(0, 12) || "(empty)" },
    "Vercel KV not configured — using in-memory vote counts (resets on restart)",
  );
}

/* ── GET /api/results ─────────────────────────────────────────────────────── */
router.get("/results", async (_req, res) => {
  try {
    const votes: Record<string, number> = {};

    if (kvAvailable) {
      const keys = FLAVOR_NAMES.map(kvKey);
      const values = await kv.mget<number[]>(...keys);
      FLAVOR_NAMES.forEach((name, i) => {
        votes[name] = Number(values[i] ?? 0);
      });
    } else {
      FLAVOR_NAMES.forEach((name) => {
        votes[name] = memVotes.get(name) ?? 0;
      });
    }

    res.json({ votes });
  } catch (err) {
    logger.error({ err }, "Failed to read vote results");
    res.status(500).json({ error: "Could not read results" });
  }
});

/* ── POST /api/vote ───────────────────────────────────────────────────────── */
router.post("/vote", async (req, res) => {
  const raw = req.body?.flavor;
  if (typeof raw !== "string" || !raw.trim()) {
    res.status(400).json({ error: "Missing flavor" });
    return;
  }

  const flavor = normalizeFlavor(raw);
  if (!FLAVOR_NAMES.includes(flavor)) {
    res.status(400).json({ error: "Unknown flavor" });
    return;
  }

  try {
    let newCount: number;

    if (kvAvailable) {
      newCount = await kv.incr(kvKey(flavor));
    } else {
      const prev = memVotes.get(flavor) ?? 0;
      newCount = prev + 1;
      memVotes.set(flavor, newCount);
    }

    res.json({ flavor, count: newCount });
  } catch (err) {
    logger.error({ err }, "Failed to record vote");
    res.status(500).json({ error: "Could not record vote" });
  }
});

export default router;

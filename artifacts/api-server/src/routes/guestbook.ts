import { Router, type IRouter } from "express";
import { kv } from "@vercel/kv";
import { Resend } from "resend";
import { logger } from "../lib/logger.js";
import { resolveContactEmail } from "../lib/contactEmail.js";
import { buildEmail } from "../lib/emailTemplates.js";

const router: IRouter = Router();

const TO_EMAIL = resolveContactEmail(process.env.CONTACT_EMAIL, "behappy@missozicecream.com");
const FROM_EMAIL = process.env.FROM_EMAIL ?? "Miss Oz Website <noreply@missozicecream.com>";

let resend: Resend | null = null;
if (process.env.RESEND_API_KEY) {
  resend = new Resend(process.env.RESEND_API_KEY);
} else {
  logger.warn("RESEND_API_KEY not set — guestbook entries will be logged only");
}

const KV_KEY = "guestbook:list";

const kvUrl = process.env.KV_REST_API_URL ?? "";
const kvAvailable = Boolean(
  kvUrl.startsWith("https://") && process.env.KV_REST_API_TOKEN,
);

if (!kvAvailable) {
  logger.warn(
    { kvUrlPrefix: kvUrl.slice(0, 12) || "(empty)" },
    "Vercel KV not configured — guestbook entries will not be persisted",
  );
}

/* ── GET /api/guestbook ───────────────────────────────────────────────────── */
router.get("/guestbook", async (_req, res) => {
  if (!kvAvailable) {
    res.json({ entries: [] });
    return;
  }

  try {
    // List — lpush prepends, so lrange 0..49 is already newest-first
    const raw = await kv.lrange<string>(KV_KEY, 0, 49);
    const entries = (raw ?? []).flatMap((item) => {
      try {
        const parsed = typeof item === "string" ? JSON.parse(item) : item;
        return [parsed];
      } catch {
        return [];
      }
    });
    res.json({ entries });
  } catch (err) {
    logger.error({ err }, "Failed to read guestbook entries");
    res.status(500).json({ error: "Could not read guestbook" });
  }
});

/* ── POST /api/guestbook ──────────────────────────────────────────────────── */
router.post("/guestbook", async (req, res) => {
  const { name, note } = req.body ?? {};

  if (typeof name !== "string" || !name.trim()) {
    res.status(400).json({ error: "Name is required" });
    return;
  }
  if (typeof note !== "string" || !note.trim()) {
    res.status(400).json({ error: "Note is required" });
    return;
  }

  const safeName = name.trim().slice(0, 40);
  const safeNote = note.trim().slice(0, 180);
  const now = Date.now();
  const when = new Date(now).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
    timeZone: "America/Los_Angeles",
  });
  const id = `gb-${now}-${Math.random().toString(36).slice(2, 8)}`;
  const entry = { id, name: safeName, note: safeNote, when };

  logger.info({ guestbook: { name: safeName } }, "Guestbook entry received");

  // Persist to Redis — lpush prepends (newest first), trim to 200
  if (kvAvailable) {
    try {
      await kv.lpush(KV_KEY, JSON.stringify(entry));
      await kv.ltrim(KV_KEY, 0, 199);
    } catch (err) {
      logger.warn({ err }, "Failed to persist guestbook entry to KV");
    }
  }

  // Send email notification
  if (!resend) {
    res.json({ ok: true, entry });
    return;
  }

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [TO_EMAIL],
      subject: `✒️ Guestbook: ${safeName} signed the book`,
      html: buildEmail({
        purpose: "guestbook",
        rows: [
          {
            label: "Signed",
            value: when,
          },
        ],
        quote: { text: safeNote, attribution: safeName },
        replyHint: false,
      }),
    });

    if (error) {
      logger.error({ resendError: error }, "Resend rejected the email");
      // Still return ok — the entry was saved to KV
      res.json({ ok: true, entry });
      return;
    }

    logger.info({ emailId: data?.id }, "Notification email sent");
    res.json({ ok: true, entry });
  } catch (err) {
    logger.error({ err }, "Failed to send guestbook notification email");
    // Entry is already in KV — don't fail the whole request
    res.json({ ok: true, entry });
  }
});

export default router;

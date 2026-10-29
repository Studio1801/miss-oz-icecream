import { Router, type IRouter } from "express";
import { Resend } from "resend";
import { logger } from "../lib/logger";
import { resolveContactEmail } from "../lib/contactEmail";
import { buildEmail } from "../lib/emailTemplates";

const router: IRouter = Router();

const TO_EMAIL = resolveContactEmail(process.env.CONTACT_EMAIL, "behappy@missozicecream.com");
const FROM_EMAIL = process.env.FROM_EMAIL ?? "Miss Oz Website <noreply@missozicecream.com>";

let resend: Resend | null = null;
if (process.env.RESEND_API_KEY) {
  resend = new Resend(process.env.RESEND_API_KEY);
} else {
  logger.warn("RESEND_API_KEY not set — mailing list signups will be logged only");
}

/* ── POST /api/subscribe ──────────────────────────────────────────────────── */
router.post("/subscribe", async (req, res) => {
  const { email } = req.body ?? {};

  if (typeof email !== "string" || !email.includes("@")) {
    res.status(400).json({ error: "Valid email is required" });
    return;
  }

  const safeEmail = email.trim().slice(0, 120);

  logger.info({ email: "[redacted]" }, "Mailing list signup received");

  if (!resend) {
    res.json({ ok: true, note: "Email not sent (RESEND_API_KEY not configured)" });
    return;
  }

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [TO_EMAIL],
      replyTo: safeEmail,
      subject: "💌 New Mailing List Signup — Miss Oz Website",
      html: buildEmail({
        purpose: "mailing",
        rows: [
          { label: "Email", value: safeEmail, isEmail: true },
          { label: "Signed up", value: new Date().toLocaleDateString("en-US", { dateStyle: "long", timeZone: "America/Los_Angeles" }) },
        ],
      }),
    });

    if (error) {
      logger.error({ resendError: error }, "Resend rejected the email");
      res.status(502).json({ error: "Email service rejected the message" });
      return;
    }

    logger.info({ emailId: data?.id }, "Notification email sent");
    res.json({ ok: true });
  } catch (err) {
    logger.error({ err }, "Failed to send signup notification email");
    res.status(500).json({ error: "Could not send signup notification" });
  }
});

export default router;

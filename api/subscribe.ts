/**
 * POST /api/subscribe: newsletter sign-ups from the footer, emailed to Millie.
 * Mirrors artifacts/api-server/src/routes/subscribe.ts (the local dev server).
 */
import { buildEmail, sendEmail, readBody, hasResend, TO_EMAIL, type Req, type Res } from "./_lib/mail";

export default async function handler(req: Req, res: Res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { email } = readBody(req);
  if (typeof email !== "string" || !email.includes("@")) {
    res.status(400).json({ error: "Valid email is required" });
    return;
  }
  const safeEmail = email.trim().slice(0, 120);

  if (!hasResend()) {
    res.json({ ok: true, note: "Email not sent (RESEND_API_KEY not configured)" });
    return;
  }

  const sent = await sendEmail({
    to: TO_EMAIL,
    replyTo: safeEmail,
    subject: "💌 New Mailing List Signup, Miss Oz Website",
    html: buildEmail({
      purpose: "mailing",
      rows: [
        { label: "Email", value: safeEmail, isEmail: true },
        { label: "Signed up", value: new Date().toLocaleDateString("en-US", { dateStyle: "long", timeZone: "America/Los_Angeles" }) },
      ],
    }),
  });
  if (sent.error) {
    console.error(`Signup notification failed: ${sent.error}`);
    res.status(502).json({ error: "Email service rejected the message" });
    return;
  }
  res.json({ ok: true });
}

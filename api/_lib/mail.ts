/**
 * Email helpers for the Vercel functions in /api.
 *
 * Why this lives here and not in artifacts/api-server: that package is an ES
 * module, while Vercel builds these functions as CommonJS. A function that
 * imports from it crashes on load with ERR_REQUIRE_ESM before it can send
 * anything, which is why the order and inquiry emails never arrived. Files in
 * /api/_lib are not routes, so this is shared code only, with no packages to
 * install: email goes to Resend over plain fetch.
 *
 * The template below is a copy of artifacts/api-server/src/lib/emailTemplates.ts
 * (used by the local dev server). Keep the two in step if the design changes.
 */

/**
 * Branded HTML email templates for Miss Oz notification emails.
 * Each purpose gets its own accent palette + header treatment, all sharing
 * one vintage soda-fountain layout (Georgia serif, cream paper, ticket footer).
 */

export type EmailPurpose = "wholesale" | "wholesaleConfirmation" | "event" | "general" | "order" | "orderConfirmation" | "guestbook" | "mailing";

type Theme = {
  accent: string;      // header background
  accentSoft: string;  // header subtitle color
  ribbon: string;      // thin stripe under the header
  badge: string;       // emoji-style badge
  title: string;
  subtitle: string;
};

const THEMES: Record<EmailPurpose, Theme> = {
  wholesale: {
    accent: "#1E4D3F",
    accentSoft: "rgba(247,236,210,0.72)",
    ribbon: "#C9A227",
    badge: "🥛",
    title: "Wholesale Inquiry",
    subtitle: "A shop wants Miss Oz in their case",
  },
  wholesaleConfirmation: {
    accent: "#1E4D3F",
    accentSoft: "rgba(247,236,210,0.72)",
    ribbon: "#C9A227",
    badge: "🥛",
    title: "Wholesale Inquiry Received",
    subtitle: "Thank you for your interest in Miss Oz",
  },
  event: {
    accent: "#B24E79",
    accentSoft: "rgba(255,244,235,0.85)",
    ribbon: "#F7ECD2",
    badge: "🎉",
    title: "Parties & Weddings Inquiry",
    subtitle: "Someone wants scoops at their celebration",
  },
  general: {
    accent: "#3E2723",
    accentSoft: "rgba(247,236,210,0.7)",
    ribbon: "#C9A227",
    badge: "🍨",
    title: "General Inquiry",
    subtitle: "A message from the website",
  },
  order: {
    accent: "#630F39",
    accentSoft: "rgba(247,236,210,0.75)",
    ribbon: "#F4A9C7",
    badge: "🎂",
    title: "New Cake Order",
    subtitle: "Someone ordered a whole cake",
  },
  orderConfirmation: {
    accent: "#630F39",
    accentSoft: "rgba(247,236,210,0.75)",
    ribbon: "#F4A9C7",
    badge: "🎂",
    title: "We Got Your Order",
    subtitle: "Thank you for ordering from Miss Oz",
  },
  guestbook: {
    accent: "#C9862A",
    accentSoft: "rgba(52,26,10,0.65)",
    ribbon: "#630F39",
    badge: "✒️",
    title: "New Guestbook Entry",
    subtitle: "Someone signed the book",
  },
  mailing: {
    accent: "#630F39",
    accentSoft: "rgba(247,236,210,0.7)",
    ribbon: "#B24E79",
    badge: "💌",
    title: "New Mailing List Signup",
    subtitle: "A new friend of the shop",
  },
};

export function escHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export type FieldRow = { label: string; value: string; isEmail?: boolean; multiline?: boolean };

function renderRows(rows: FieldRow[]): string {
  return rows
    .map((r) => {
      const value = r.isEmail
        ? `<a href="mailto:${escHtml(r.value)}" style="color:#630f39;text-decoration:underline">${escHtml(r.value)}</a>`
        : escHtml(r.value);
      return `
      <tr>
        <td style="padding:${r.multiline ? "14px" : "8px"} 0 4px;font-size:11px;text-transform:uppercase;letter-spacing:2px;color:#8a6a45;font-family:Arial,sans-serif;width:110px;vertical-align:top">${escHtml(r.label)}</td>
        <td style="padding:${r.multiline ? "14px" : "8px"} 0 4px;font-size:16px;color:#2a1710;line-height:1.6;${r.multiline ? "white-space:pre-wrap;" : ""}">${value}</td>
      </tr>`;
    })
    .join("");
}

/**
 * Build a complete branded notification email.
 * `quote` renders the message/note as a big scripty pull-quote instead of a table row
 * (used for guestbook entries).
 */
export function buildEmail(opts: {
  purpose: EmailPurpose;
  rows: FieldRow[];
  quote?: { text: string; attribution?: string };
  replyHint?: boolean; // default true; omit when there's no reply-to address
}): string {
  const t = THEMES[opts.purpose];
  const quoteHtml = opts.quote
    ? `
    <tr><td style="padding:6px 0 2px">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse">
        <tr><td style="background:#fbf3df;border-left:4px solid ${t.accent};border-radius:0 8px 8px 0;padding:18px 22px">
          <p style="margin:0;font-family:Georgia,serif;font-style:italic;font-size:19px;line-height:1.55;color:#3a2115">&ldquo;${escHtml(opts.quote.text)}&rdquo;</p>
          ${opts.quote.attribution ? `<p style="margin:10px 0 0;font-family:Arial,sans-serif;font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#8a6a45">${escHtml(opts.quote.attribution)}</p>` : ""}
        </td></tr>
      </table>
    </td></tr>`
    : "";

  return `<!DOCTYPE html>
<html lang="en">
<body style="margin:0;padding:0;background:#efe4c9">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#efe4c9;padding:28px 12px">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:580px;border-collapse:collapse;background:#fdf6e3;border-radius:12px;overflow:hidden;box-shadow:0 6px 24px rgba(60,25,15,0.18)">

        <!-- Header -->
        <tr><td style="background:${t.accent};padding:28px 32px 24px;text-align:center">
          <p style="margin:0 0 6px;font-size:26px;line-height:1">${t.badge}</p>
          <h1 style="margin:0;font-family:Georgia,serif;font-weight:400;font-size:24px;letter-spacing:1px;color:#f7ecd2">${t.title}</h1>
          <p style="margin:6px 0 0;font-family:Georgia,serif;font-style:italic;font-size:14px;color:${t.accentSoft}">${t.subtitle}</p>
        </td></tr>

        <!-- Ribbon stripe -->
        <tr><td style="height:5px;background:repeating-linear-gradient(45deg,${t.ribbon},${t.ribbon} 12px,${t.accent} 12px,${t.accent} 24px);font-size:0;line-height:0">&nbsp;</td></tr>

        <!-- Body -->
        <tr><td style="padding:26px 32px 22px">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;font-family:Georgia,serif">
            ${renderRows(opts.rows)}
            ${quoteHtml}
          </table>
        </td></tr>

        <!-- Reply hint -->
        ${opts.replyHint === false ? "" : `<tr><td style="padding:0 32px 26px">
          <p style="margin:0;font-family:Arial,sans-serif;font-size:12px;color:#8a6a45;border-top:1px dashed #d9c493;padding-top:14px">
            Hit <strong>reply</strong> to answer them directly. The reply-to is set to their address.
          </p>
        </td></tr>`}

        <!-- Footer ticket -->
        <tr><td style="background:#630f39;padding:16px 32px;text-align:center">
          <p style="margin:0;font-family:Georgia,serif;font-size:13px;letter-spacing:2px;color:#f7ecd2">MISS OZ ICE CREAM &amp; DESSERT CAFE</p>
          <p style="margin:4px 0 0;font-family:Arial,sans-serif;font-size:11px;letter-spacing:1px;color:rgba(247,236,210,0.6)">Pearl District · Portland, Oregon · est. 2007 · via missozicecream.com</p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** A pasted address may carry quotes, spaces or a "Name <email>" wrapper. */
export function resolveContactEmail(raw: string | undefined, fallback: string): string {
  if (!raw) return fallback;
  let v = raw.trim().replace(/^["'`]+|["'`]+$/g, "").trim();
  const angle = v.match(/<([^<>]+)>/);
  if (angle) v = angle[1].trim();
  if (EMAIL_RE.test(v)) return v;
  console.warn("CONTACT_EMAIL does not look like a valid email, using the default");
  return fallback;
}

export const TO_EMAIL = resolveContactEmail(process.env.CONTACT_EMAIL, "behappy@missozicecream.com");
export const FROM_EMAIL = process.env.FROM_EMAIL ?? "Miss Oz Website <noreply@missozicecream.com>";
export const hasResend = (): boolean => Boolean(process.env.RESEND_API_KEY);

/** Send one email through Resend. Returns its id, or the reason it failed. */
export async function sendEmail(msg: {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}): Promise<{ id?: string; error?: string }> {
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [msg.to],
        subject: msg.subject,
        html: msg.html,
        ...(msg.replyTo ? { reply_to: msg.replyTo } : {}),
      }),
    });
    const body = (await res.json().catch(() => ({}))) as { id?: string; message?: string };
    if (!res.ok) return { error: `${res.status} ${body.message ?? "Resend rejected the email"}` };
    return { id: body.id };
  } catch (err) {
    return { error: err instanceof Error ? err.message : String(err) };
  }
}

/** The request body, whether Vercel parsed it already or not. */
export function readBody(req: { body?: unknown }): Record<string, unknown> {
  const b = req.body;
  if (b && typeof b === "object") return b as Record<string, unknown>;
  if (typeof b === "string") {
    try { return JSON.parse(b) as Record<string, unknown>; } catch { return {}; }
  }
  return {};
}

/** Minimal request and response shapes, so no extra packages are needed. */
export type Req = { method?: string; body?: unknown };
export type Res = {
  status: (code: number) => Res;
  json: (body: unknown) => void;
  setHeader: (name: string, value: string) => void;
};

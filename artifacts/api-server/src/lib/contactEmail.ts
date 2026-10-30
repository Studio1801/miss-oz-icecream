import { logger } from "./logger.js";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Normalize a pasted email value: trim whitespace/newlines, strip surrounding
 * quotes, and unwrap "Name <email>" down to the bare address.
 * Logs a masked diagnostic (never the value itself) when it still looks invalid.
 */
export function resolveContactEmail(raw: string | undefined, fallback: string): string {
  if (!raw) return fallback;
  let v = raw.trim().replace(/^["'`]+|["'`]+$/g, "").trim();
  const angle = v.match(/<([^<>]+)>/);
  if (angle) v = angle[1].trim();
  if (EMAIL_RE.test(v)) return v;
  logger.warn(
    {
      contactEmailDiagnostic: {
        length: raw.length,
        hasAt: raw.includes("@"),
        hasSpaces: /\s/.test(raw.trim()),
        startsWithLetter: /^[a-zA-Z0-9]/.test(raw.trim()),
      },
    },
    "CONTACT_EMAIL does not look like a valid email — falling back to default",
  );
  return fallback;
}

---
name: Resend email setup for Miss Oz
description: Current state and quirks of the Resend email pipeline (test mode, secrets hygiene)
---

- Resend SDK does NOT throw on API errors — it returns `{ data, error }`. Always check `error` or failures are silently swallowed (this hid weeks of non-delivery).
- **Test mode (current state as of July 2026):** domain missozicecream.com is NOT verified in Resend. FROM_EMAIL env var is set to `Miss Oz Website <onboarding@resend.dev>` and CONTACT_EMAIL to the Resend account owner's address — test mode only delivers to the account owner. Once the client verifies the domain at resend.com/domains, delete the FROM_EMAIL env var and set CONTACT_EMAIL to the shop's real inbox.
- **Why:** Resend refuses unverified-domain senders (403) and restricts resend.dev sends to the signup address.
- This user pastes sentences/placeholder text into secret forms (happened with KV_REST_API_URL and twice with CONTACT_EMAIL). Server code normalizes/validates CONTACT_EMAIL and logs a masked diagnostic; keep validating any user-entered secret before trusting it.

Mobile forms must not interpret a logging-only response as a successfully sent message.

**Why:** The existing email endpoints can return HTTP 200 with an explanatory `note` when email is not configured. That records a log, not a sent inquiry or signup notification.

**How to apply:** Require the endpoint's confirmed-send response before showing success. Retain entered values on failures and do not add a simulated-success fallback.

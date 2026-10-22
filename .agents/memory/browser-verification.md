---
name: Browser verification environment
description: Choose the right preview address for remote testing versus local browser checks.
---

Give the testing helper the public development preview URL, not the main container's localhost URL.

**Why:** The helper's browser runs outside the main container; localhost refused connections even while the managed app workflow and local screenshot browser were healthy.

**How to apply:** Use the development preview domain for remote browser testing. Local shell Chrome and the app-preview screenshot tool can use the local shared proxy. Keep development and published URLs distinct.

Responsive checks must cover both overlay-scrollbar mobile emulation and a browser with reserved scrollbar width.

**Why:** A 320px remote browser had only 305px of usable document width, while local mobile emulation kept the full 320px. A wordmark that passed the local geometry audit was visibly clipped in the remote browser.

**How to apply:** Measure against document client width and available content containers, not only viewport units. When narrow-screen checks disagree, reproduce with mobile emulation disabled at the same viewport width before concluding the issue is fixed.

---
name: Browser verification environment
description: Choose the right preview address for remote testing versus local browser checks.
---

Give the testing helper the public development preview URL, not the main container's localhost URL.

**Why:** The helper's browser runs outside the main container; localhost refused connections even while the managed app workflow and local screenshot browser were healthy.

**How to apply:** Use the development preview domain for remote browser testing. Local shell Chrome and the app-preview screenshot tool can use the local shared proxy. Keep development and published URLs distinct.

For reports of duplicated sections, verify navigation between pages as well as direct page loads.

**Why:** A direct Wholesale load showed one section while navigating from About or Events reproduced two complete sections. Fresh-load screenshots and source occurrence counts alone missed the reported behavior.

**How to apply:** Follow the header links into the affected page, wait for transitions to settle, and count rendered sections. Include browser back/forward when verifying a routing fix.

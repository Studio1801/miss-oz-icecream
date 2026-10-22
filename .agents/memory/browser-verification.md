---
name: Browser verification environment
description: Choose the right preview address for remote testing versus local browser checks.
---

Give the testing helper the public development preview URL, not the main container's localhost URL.

**Why:** The helper's browser runs outside the main container; localhost refused connections even while the managed app workflow and local screenshot browser were healthy.

**How to apply:** Use the development preview domain for remote browser testing. Local shell Chrome and the app-preview screenshot tool can use the local shared proxy. Keep development and published URLs distinct.

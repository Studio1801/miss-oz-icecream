---
name: Miss Oz visual verification
description: How to interpret immediate homepage screenshots without mistaking the intro splash for the page.
---

Instant screenshots can capture the brief full-screen Miss Oz intro instead of the homepage beneath it. A splash-only capture is not proof that the page failed to render. Full-page captures do not scroll through the page, so lower Framer Motion `whileInView` sections can remain hidden; use a tall viewport that includes the target section when checking them.

**Why:** The capture tool takes its picture immediately after navigation, while the site displays its intro first. Its full-page mode captures lower sections without entering their viewport, which can leave scroll-triggered content in its initial hidden state.

**How to apply:** Prefer a browser capture that waits until the intro leaves before assessing layout. For lower animated sections, increase viewport height enough to bring them into view. Review reduced-motion behavior when changing hero animation.
---
name: Miss Oz mobile scope
description: Client constraints for mobile spacing and preserving the fixed bulb frame and desktop appearance.
---

Mobile layout changes are restricted to widths at or below 767px. Preserve desktop appearance, colors, font families, copy, photos, and the bulb frame itself.

**Why:** The client explicitly identified content clearance around the fixed frame as the problem, not the frame's design.

**How to apply:** Give content clearance from the existing frame, apply the outer gutter only once, and remove duplicate inset padding in nested wrappers such as Story. Retain original desktop utility values at the desktop breakpoint.

Do not globally expose overflow on decorative cards to fix text clipping.

**Why:** Off-card decorative shapes can silently expand the document even when all text fits inside its gutter.

**How to apply:** Keep decorative card masks intact; constrain or wrap text in the specific wrapper that needs it, and measure document scroll width against the layout viewport rather than window.innerWidth.

Mobile navigation uses one hamburger-to-X header toggle, not an additional close button inside the drawer. Hero content must remain visible without waiting for an image-load state or animation completion.

**Why:** The client explicitly required a single close control and a hero that never renders blank.

**How to apply:** Preserve the toggle when opening the drawer, include it in keyboard focus handling, and keep hero visibility independent from loading and animation state.

Mobile menu category changes must preserve the page's vertical position, not merely avoid explicit scroll commands.

**Why:** Native browser scroll anchoring moved the page when swapping panels of different heights, even with the menu section itself excluded from anchoring. The client explicitly requested no jump.

**How to apply:** Preserve the mobile anchoring opt-out and verify actual scroll position across short and tall panel changes. Keep the existing desktop scroll-to-menu behavior.

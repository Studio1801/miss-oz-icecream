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

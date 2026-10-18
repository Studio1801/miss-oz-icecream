---
name: Miss Oz mobile scope
description: Client constraints for mobile spacing and preserving the fixed bulb frame and desktop appearance.
---

Miss Oz mobile is the 1440px desktop adapted for phones, not a redesign. Preserve the same brand, fonts, colors, copy, photos, section order, and decorative language. Mobile-only changes are limited to sizing, stacking, tap/read comfort, and collapsing desktop navigation with its existing fonts, colors, and link names. Keep decorations; shrink or move them to resolve collisions, and remove one only if it still collides after that. Do not add mobile-only components, sections, copy, colors, or fonts, or remove desktop content, photos, buttons, or features. All mobile rules stop at 767px; do not change 768px and up.

**Why:** The client made desktop-at-1440 the source of truth and explicitly said the rule applies to past and future mobile work.

**How to apply:** Before each mobile edit, compare the corresponding desktop element. Audit Home, Events, Wholesale, About, and Contact at 1440px and 390px, including sections, tabs, navigation, and footer. Keep and report only differences justified by the allowed mobile adaptations; verify widths 320–430 and the 768px boundary. Claim pixel identity only against a trustworthy pre-change baseline.

Give content clearance from the existing frame, apply the outer gutter only once, and remove duplicate inset padding in nested wrappers such as Story. Retain original desktop utility values at the desktop breakpoint.

**Why:** The client explicitly identified content clearance around the fixed frame as the problem, not the frame's design.

**How to apply:** Preserve the bulb frame itself and keep the content gutter separate from its fixed overlay.

Do not globally expose overflow on decorative cards to fix text clipping.

**Why:** Off-card decorative shapes can silently expand the document even when all text fits inside its gutter.

**How to apply:** Keep decorative card masks intact; constrain or wrap text in the specific wrapper that needs it, and measure document scroll width against the layout viewport rather than window.innerWidth.

Mobile navigation uses one hamburger-to-X header toggle, not an additional close button inside the drawer. Hero content must remain visible without waiting for an image-load state or animation completion.

**Why:** The client explicitly required a single close control and a hero that never renders blank.

**How to apply:** Preserve the toggle when opening the drawer, include it in keyboard focus handling, and keep hero visibility independent from loading and animation state.

Mobile menu category changes must preserve the page's vertical position, not merely avoid explicit scroll commands.

**Why:** Native browser scroll anchoring moved the page when swapping panels of different heights, even with the menu section itself excluded from anchoring. The client explicitly requested no jump.

**How to apply:** Preserve the mobile anchoring opt-out and verify actual scroll position across short and tall panel changes. Keep the existing desktop scroll-to-menu behavior.

Touch press feedback must not rely solely on native CSS `:active`.

**Why:** Held-touch verification produced pointer events and working final taps without a native active state. CSS-only feedback was therefore absent during the actual hold.

**How to apply:** Track press/release/cancellation explicitly, clear feedback when a gesture becomes a scroll or drag, and preserve resting geometry.

Reduced-motion preferences must stop running autoplay timers when the preference changes, not just on initial page load.

**Why:** CSS responded to a live preference change while the animation library's initial reduced-motion snapshot left the carousel interval running.

**How to apply:** Subscribe to media-query changes for timer-driven behavior, cancel active intervals when reduced motion is enabled, and check the current preference before imperative smooth scrolling.

Restrict text-audit exemptions to actual marquees and intentional horizontal scrollers, never ordinary content sections.

**Why:** A scrolling-content exemption on an entire hero hides its ordinary headlines and copy from gutter and font-size checks.

**How to apply:** Annotate only the moving strip or scrolling control itself; keep surrounding content in the audit.

An empty gutter/font-size audit does not establish that the page looks correct.

**Why:** Overlapping photo captions and headings split mid-word can pass every geometry check.

**How to apply:** Pair the console audit with full-page visual inspection, including widths on either side of layout breakpoints.

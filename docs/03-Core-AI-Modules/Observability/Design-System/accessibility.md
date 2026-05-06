# Observability Dashboard — Accessibility

> **Module:** Observability Dashboard  
> **Version:** 1.0  
> **Standard:** WCAG 2.1 AA

## 1. Keyboard Access

- All chart controls, filters, and refresh actions must be keyboard reachable.
- Focus order should follow the visual hierarchy.

## 2. Screen Reader Support

- Live updates should be announced in a controlled way so they do not flood assistive technologies.
- Health changes and stale warnings must be announced clearly.
- Numeric summaries should include labels and units.

## 3. Visual Accessibility

- Color status must be paired with icons or text.
- Contrast must remain readable on dark surfaces.
- The UI must not rely on color alone to differentiate healthy, degraded, and down states.

## 4. Motion Accessibility

- Respect reduced-motion preferences.
- Keep live pulse animation subtle and optional.
- Avoid flashing indicators or rapid chart animation.

## 5. Testing Checklist

- [ ] Summary metrics are understandable without color.
- [ ] Health changes are announced to screen readers.
- [ ] Focus can reach all interactive controls.
- [ ] Reduced motion disables decorative animation.
- [ ] Stale and degraded states are distinguishable by text and icon.
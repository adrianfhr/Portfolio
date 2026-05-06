# Live Logs Viewer — Accessibility

> **Module:** Live Logs Viewer  
> **Version:** 1.0  
> **Standard:** WCAG 2.1 AA

## 1. Keyboard Access

- Filters, clear, export, and collapse controls must be reachable by keyboard.
- The terminal viewport should allow focus and scrolling without traps.

## 2. Screen Reader Support

- Connection state should be announced.
- Log line updates should not flood the screen reader output.
- Important warnings and errors should be readable as text.

## 3. Visual Accessibility

- Severity color must be paired with labels or icons.
- The text must remain readable against the dark background.
- Truncation should preserve a way to inspect the full message.

## 4. Motion Accessibility

- Respect reduced-motion preferences.
- Keep pulsing status indicators subtle or disabled when needed.

## 5. Testing Checklist

- [ ] Keyboard users can operate all terminal controls.
- [ ] Screen readers receive connection and error updates appropriately.
- [ ] Severity levels remain distinguishable without color alone.
- [ ] Reduced motion disables decorative animation.
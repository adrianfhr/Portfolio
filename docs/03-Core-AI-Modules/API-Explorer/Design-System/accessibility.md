# API Explorer — Accessibility

> **Module:** API Explorer  
> **Version:** 1.0  
> **Standard:** WCAG 2.1 AA

## 1. Keyboard Access

- Endpoint navigation, request fields, and execute controls must be keyboard accessible.
- The docs page must not create keyboard traps.

## 2. Screen Reader Support

- Request and response states must be announced.
- Auth and validation errors must be readable.
- Code blocks should remain accessible as text.

## 3. Visual Accessibility

- Use strong contrast for code, labels, and status badges.
- Do not rely on color alone to communicate status or authorization.

## 4. Motion Accessibility

- Respect reduced-motion preferences.
- Keep loading transitions brief and non-essential.

## 5. Testing Checklist

- [ ] Keyboard users can navigate and execute requests.
- [ ] Screen readers understand status and error updates.
- [ ] Contrast supports dark-mode reading.
- [ ] Reduced motion does not break the explorer.
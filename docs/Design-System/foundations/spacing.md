# Spacing

> **Scope:** Layout spacing system  
> **Version:** 1.0  
> **Status:** Draft

## 1. Overview

Spacing should follow a stable, low-friction grid so the interface feels deliberate rather than crowded. The system should support dense dashboards without becoming visually noisy.

## 2. Grid

- Base unit: 4px.
- Common increments: 4, 8, 12, 16, 24, 32, 48, 64.
- Use multiples of the base grid for most padding and gaps.

## 3. Layout Rules

- Panels should have consistent internal padding.
- Section separation should be clear but not oversized.
- Dense tooling views may reduce spacing slightly, but never to the point of ambiguity.

## 4. Responsive Guidance

- Reduce horizontal density on small screens by stacking panels.
- Preserve touch-friendly spacing for interactive controls.

## 5. Cross-References

- [Typography](typography.md)
- [Cards](../components/cards.md)
- [Dashboard](../components/dashboard.md)
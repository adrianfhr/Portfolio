# Motion

> **Scope:** Global motion tokens and guidance  
> **Version:** 1.0  
> **Status:** Draft

## 1. Overview

Motion should explain state changes, not distract from them. This system favors short, informative transitions and avoids large decorative movement.

## 2. Durations

- Fast: hover and button feedback.
- Normal: panel transitions and small reveals.
- Smooth: modal or drawer movement.
- Slow: page-level transitions when absolutely necessary.

## 3. Principles

- Animate opacity and transform before layout.
- Keep streaming and live states readable with minimal motion.
- Respect reduced-motion preferences everywhere.

## 4. Cross-References

- [Shadows](shadows.md)
- [Animations](../patterns/streaming-ui.md)
- [Realtime UI](../patterns/realtime-ui.md)
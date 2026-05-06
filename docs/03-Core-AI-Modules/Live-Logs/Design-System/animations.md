# Live Logs Viewer — Animations

> **Module:** Live Logs Viewer  
> **Version:** 1.0

## 1. Overview

Animations should make the terminal feel alive while staying practical and readable.

## 2. Key Animations

### 2.1 Connection Indicator
- A subtle pulse can signal an active live stream.

### 2.2 New Line Arrival
- New log rows can fade in quickly without shifting the entire terminal.

### 2.3 Auto-Scroll Hint
- The scroll-to-bottom button can slide or fade into view when the user leaves the bottom.

### 2.4 Collapse and Expand
- The terminal can expand and collapse with a short, smooth transition.

## 3. Reduced Motion

- Respect reduced-motion preferences.
- Remove pulse effects if the user prefers minimal motion.
- Keep the terminal understandable through color and text alone.
# Observability Dashboard — Animations

> **Module:** Observability Dashboard  
> **Version:** 1.0

## 1. Overview

Animation should reinforce freshness and change without making the dashboard look gimmicky.

## 2. Key Animations

### 2.1 Live Pulse
- The LIVE indicator can pulse subtly to show the stream is active.
- Keep the pulse restrained and slow.

### 2.2 Value Update
- Summary card values can cross-fade or count up gently when they change.
- Avoid large motion for small numerical updates.

### 2.3 Chart Refresh
- Lines and bars should transition smoothly when new snapshots arrive.
- Do not animate full-axis reflows unnecessarily.

### 2.4 Status Change
- Health cards can fade between states with a short duration.
- Use color transition and text updates together.

### 2.5 Stale Warning
- The stale warning can fade in once the stream exceeds the timeout.
- The warning should not flash or bounce.

## 3. Reduced Motion

- Respect reduced-motion preferences.
- Remove value pulsing and live badge motion when requested.
- Keep state transitions immediate and readable.
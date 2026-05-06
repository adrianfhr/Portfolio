# Live Logs Viewer — Component Behavior

> **Module:** Live Logs Viewer  
> **Version:** 1.0

## 1. Overview

The terminal should behave like a live feed with stable ordering and predictable filtering.

## 2. Terminal Behavior

- Append new lines at the bottom.
- Keep the latest messages in view when auto-scroll is active.
- Pause auto-scroll when the user scrolls upward.

## 3. Filtering Behavior

- Apply level and module filters without reloading the page.
- Preserve the current buffer view while filters are being changed.
- Search should operate on visible content and not affect the backend stream.

## 4. Buffer Behavior

- Retain only the most recent 100 DOM rows.
- Discard older lines using FIFO behavior.
- Do not lose the current connection when the panel collapses.

## 5. Export and Clear

- Export should reflect the currently visible filtered rows.
- Clear should empty the viewport without corrupting the stream state.

## 6. Error Behavior

- Connection failures should show a visible status change and reconnect attempt.
- Redaction must occur before any line is rendered.
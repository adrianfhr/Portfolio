# Live Logs Viewer — UI Specification

> **Module:** Live Logs Viewer  
> **Version:** 1.0  
> **Layout Philosophy:** A terminal-like interface that feels operational and immediate. The component should look like a live production console, not a decorative panel.

## 1. Overview

The log viewer should behave like a docked terminal with visible activity, a clear header, and simple filtering controls. It must support both quick glances and deep inspection.

## 2. Layout

### 2.1 Desktop
- Docked panel at the bottom or side of the screen.
- Header with connection status, filters, and action buttons.
- Scrollable log viewport with monospace text.

### 2.2 Mobile
- Collapse into a compact drawer or tab.
- Preserve readability and touch target sizes.

## 3. Visual Hierarchy

- Timestamp first, then severity, then module, then message.
- Status and severity should stand out more than raw metadata.
- Long lines should remain readable without creating layout overflow.

## 4. Controls

- Level filter.
- Module filter.
- Keyword search.
- Clear button.
- Export button.

## 5. Tone

- Dark background.
- Strong contrast for readable lines.
- Utility-first appearance with minimal decoration.
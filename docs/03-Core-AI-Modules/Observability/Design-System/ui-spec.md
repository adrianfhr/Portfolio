# Observability Dashboard — UI Specification

> **Module:** Observability Dashboard  
> **Version:** 1.0  
> **Layout Philosophy:** Dense, credible, and control-room oriented. The interface should resemble a modern production telemetry console rather than a marketing dashboard.

## 1. Overview

The UI should make operational state visible instantly: summary metrics first, charts next, and dependency health last. It should feel live, precise, and continuously updated.

## 2. Overall Layout

### 2.1 Desktop
- Top row: summary cards.
- Middle rows: trend charts and cost breakdown.
- Side or lower row: service health grid and queue indicators.

### 2.2 Tablet
- Reduce the number of columns but preserve the order of importance.
- Keep the summary cards visible without scrolling too far.

### 2.3 Mobile
- Stack the cards into a compact grid.
- Prioritize summary status over dense charts.

## 3. Core Visual Blocks

### 3.1 Summary Cards
- Display total cost, average latency, uptime, and total requests.
- Include small sparklines when space allows.

### 3.2 Trend Charts
- Line chart for latency percentiles.
- Area chart for request volume.
- Bar chart for token usage by model.
- Gauge or ring chart for cache hit ratio.

### 3.3 Health Grid
- One card per dependency.
- Color-coded status dot, label, and last-checked time.

### 3.4 Live Badge
- A visible LIVE indicator should confirm the stream is active.
- If the stream stalls, replace it with a stale-data warning.

## 4. Data Presentation Rules

- Always label units clearly.
- Avoid unlabeled charts or ambiguous scales.
- Present estimates with clear text that they are estimates.

## 5. Visual Tone

- Use dark surfaces with bright status accents.
- Keep the palette restrained: green for healthy, amber for degraded, red for failure.
- Reserve bright accent colors for the most important live status elements.
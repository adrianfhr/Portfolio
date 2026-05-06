# Face Recognition System — UI Specification

> **Module:** Face Recognition & Computer Vision  
> **Version:** 1.0  
> **Layout Philosophy:** Clear, analytical, and evidence-first. The interface should feel like a computer vision workbench rather than a generic upload form.

## 1. Overview

The UI must make the detection pipeline legible: input on the left, annotated result on the right, and raw JSON below or beside the preview. The user should always know whether the system is waiting, processing, or completed.

## 2. Overall Layout

### 2.1 Desktop
- Two-column layout with controls on the left and results on the right.
- Maintain a fixed workspace height where possible so the canvas and metadata do not jump while processing.
- Keep the most important action, the upload or capture control, above the fold.

### 2.2 Tablet
- Collapse controls into a top or side drawer.
- Keep the result canvas visible immediately after submission.

### 2.3 Mobile
- Stack controls above results.
- Keep camera capture and upload actions within thumb reach.

## 3. Input Area

### 3.1 Upload Control
- Large drop zone with dashed border and camera icon.
- Clear hover and drag-over states.
- Preview thumbnail after file selection.

### 3.2 Webcam Control
- Primary button to start camera capture.
- Secondary button to switch camera when supported.
- Capture button should feel like a shutter action, not a generic submit button.

## 4. Result Area

### 4.1 Annotated Canvas
- Render the original image to canvas and overlay bounding boxes.
- Use labels above each box with identity and confidence.
- Keep unknown faces visually distinct from recognized ones.

### 4.2 JSON Inspector
- Show the raw response in a code-styled panel.
- Allow sections to collapse when the response is large.
- Highlight request ID, timings, and summary metadata.

### 4.3 Status Indicators
- Use explicit labels for uploading, queued, processing, completed, and failed.
- Show queue position when the job is waiting.

## 5. Visual Language

- Prefer dark, technical surfaces with high-contrast annotation colors.
- Use green for known matches, amber for unknown or low-confidence states, and red only for errors.
- Keep borders and overlays crisp so the face boxes remain readable even on busy photos.

## 6. Example States

- Empty: no image selected.
- Uploading: file is being transferred.
- Queued: position and estimated wait are visible.
- Processing: the canvas area shows a skeleton or shimmer.
- Complete: annotated canvas and JSON output are visible.
- Failed: error card with retry action.# UI Specification — Face Recognition Module

**Module ID:** FACE-001-DS  
**Version:** 1.0.0  
**Status:** Draft

---

## 1. Design Principles

The Vision Playground must feel like a **professional ML demo environment** — split-pane, data-dense, and visually informative. The left side is for input and control; the right side is for results and transparency. Every pixel should reinforce the idea that this is a production inference pipeline, not a toy.

### Visual Language
- **Density:** High information density; monospace for metrics, sans-serif for labels.
- **Color Semantics:** Green = success/match, Yellow = unknown, Red = error/low-confidence, Blue = action.
- **Contrast:** Dark canvas background makes annotated bounding boxes pop.

---

## 2. Layout Architecture

### Desktop (>1024px): Split Pane
```
┌──────────────────────────────┬──────────────────────────────┐
│                              │                              │
│   Input Panel (40%)          │   Result Panel (60%)         │
│                              │                              │
│   [Drop Zone / Webcam]       │   [Annotated Canvas]         │
│   [Controls]                 │   [JSON Output]              │
│   [Upload Progress]          │   [Metrics]                  │
│                              │                              │
└──────────────────────────────┴──────────────────────────────┘
```

### Tablet (768–1024px): Stacked
```
┌──────────────────────────────┐
│   Input Panel                │
│   [Drop Zone / Webcam]       │
├──────────────────────────────┤
│   Result Panel               │
│   [Annotated Canvas]         │
│   [JSON Output - Collapsed]  │
└──────────────────────────────┘
```

### Mobile (<768px): Stacked Single Column
```
┌──────────────────────────────┐
│   Input Panel                │
│   [Drop Zone / Webcam]       │
├──────────────────────────────┤
│   Result Panel               │
│   [Annotated Canvas]         │
│   [JSON Output - Drawer]     │
└──────────────────────────────┘
```
- JSON output accessible via bottom sheet or FAB toggle.

---

## 3. Input Panel

### 3.1 Drop Zone

#### Default State
- **Size:** Full width of left panel, min-height 320px.
- **Background:** `bg-slate-800`, border 2px dashed `slate-600`, radius 12px.
- **Content:**
  - Icon: Cloud upload, 48px, `text-slate-500`.
  - Text: "Drag & drop an image here" (`text-sm text-slate-400`).
  - Subtext: "or click to browse" (`text-xs text-slate-500`).
  - Format hint: "JPEG, PNG, WebP • Max 4MB" (`text-[10px] text-slate-600`).

#### Drag-Over State
- **Border:** `border-blue-500` (solid).
- **Background:** `bg-blue-500/10`.
- **Icon:** Scale 1.1 (100ms transition).

#### Uploading State
- **Overlay:** Semi-transparent `bg-slate-900/80`.
- **Progress:** Linear progress bar, `bg-blue-600`, height 4px, animated.
- **Text:** "Uploading... 45%" (`text-sm text-slate-300`).

#### Webcam Mode
- **Video Element:** Full drop zone area, `object-fit: cover`, mirrored.
- **Overlay Controls:**
  - "Capture" button: bottom-center, 48px circle, `bg-blue-600`, white camera icon.
  - "Switch Camera" button: bottom-right, 32px circle, `bg-slate-700`.
- **Captured State:** Frozen frame displayed; "Retake" and "Analyze" buttons below.

### 3.2 Controls Row

```
[ Upload File ] [ Use Webcam ] [ Gallery Toggle ]
```

- **Upload File:** Standard button, triggers hidden file input.
- **Use Webcam:** Toggles between drop zone and webcam preview.
- **Gallery Toggle:** Shows/hides gallery thumbnail strip (admin/seed data).

### 3.3 Status Bar

Below controls, a compact status row:
```
[ Status Icon ] [ State Label ] [ Spinner/Check ]
```

| State | Icon | Color | Text |
|---|---|---|---|
| Idle | Circle | Slate | "Ready to analyze" |
| Queued | Clock | Amber | "Queued (#3)" |
| Processing | Spinner | Blue | "Processing..." |
| Completed | Check | Green | "Analysis complete" |
| Failed | X | Rose | "Analysis failed" |

---

## 4. Result Panel

### 4.1 Annotated Canvas

#### Container
- **Background:** `bg-slate-950` (near black).
- **Border:** 1px solid `slate-800`, radius 8px.
- **Overflow:** Scrollable if image exceeds container.

#### Image Display
- Original image scaled to fit width while preserving aspect ratio.
- Max display width: 100% of panel.

#### Bounding Boxes
- **Stroke Width:** 3px (desktop), 4px (mobile for visibility).
- **Colors:**
  - Known: `stroke-emerald-500`, `fill-emerald-500/10`.
  - Unknown: `stroke-amber-500`, `fill-amber-500/10`.
  - Low confidence: `stroke-rose-500`, `fill-rose-500/10`.
- **Label:**
  - Positioned 4px above box top-left.
  - Background: `bg-black/70`, padding 2px 6px, radius 4px.
  - Text: `text-[11px] font-mono text-white`.
  - Content: `{Identity} • {confidence%}` or `Unknown • {confidence%}`.

#### Hover / Active State
- Hovered box: stroke width 5px, fill opacity increases to 20%.
- Cursor changes to `pointer`.
- On mobile: tap to highlight; bottom sheet shows face details.

### 4.2 Face Detail Cards (Below Canvas or in Drawer)

One card per detected face:
```
┌─────────────────────────────────┐
│ [1] Adrian • 0.91 similarity    │
│ ┌────────┐  Gender: Male (97%)  │
│ │ Thumb  │  Age: 28 (85%)       │
│ │ (crop) │  Expression: Neutral │
│ └────────┘  Glasses: No (99%)   │
└─────────────────────────────────┘
```

- **Thumbnail:** 64×64px crop of face region, radius 6px.
- **Header:** Face number, identity, similarity score bar.
- **Attributes:** Two-column grid of key-value pairs.
- **Border:** 1px `slate-700`, radius 8px.
- **Hover:** `bg-slate-800`.

### 4.3 JSON Output Panel

#### Header
- Title: "Inference Details" (`text-sm font-semibold text-slate-300`).
- Actions: "Copy JSON", "Collapse All / Expand All".

#### Content
- Syntax-highlighted JSON (dark theme).
- Collapsible sections via chevron icons.
- Monospace font, `text-xs`, `leading-relaxed`.
- Keys: `text-slate-400`; Strings: `text-emerald-400`; Numbers: `text-amber-400`; Booleans: `text-blue-400`.

#### Scroll
- Max-height: 400px; overflow-y auto with custom scrollbar (`w-2`, `bg-slate-800`, thumb `slate-600`).

---

## 5. Skeleton Loaders

### Upload Analysis Skeleton
Shown while processing:
```
┌─────────────────────────────────┐
│ [ Gray box shimmer ]            │
│   (canvas placeholder)          │
├─────────────────────────────────┤
│ [ Shimmer line ]                │
│ [ Shimmer line ]                │
│ [ Shimmer line ]                │
└─────────────────────────────────┘
```
- Canvas area: `bg-slate-800` with animated shimmer gradient.
- JSON area: 5 shimmering lines of varying widths.
- Animation: `shimmer` translateX over 1.2s infinite.

---

## 6. Empty & Error States

### Empty State (No Analysis Yet)
- Canvas area shows placeholder graphic (abstract face outline, `text-slate-700`).
- Text: "Upload an image to begin face analysis" (`text-sm text-slate-500`).

### Error State
- Canvas area shows error icon (alert triangle, `text-rose-500`, 48px).
- Heading: "Analysis Failed" (`text-base font-semibold text-rose-400`).
- Message: Specific error text (`text-sm text-slate-400`).
- CTA: "Try Again" button resets to input state.

---

## 7. Color Tokens

| Token | Value | Usage |
|---|---|---|
| Known Box | `#22c55e` (emerald-500) | Matched faces |
| Unknown Box | `#eab308` (amber-500) | Unknown faces |
| Low Confidence Box | `#ef4444` (rose-500) | Detection < 0.5 |
| Canvas BG | `#020617` (slate-950) | Result canvas background |
| Panel BG | `#1e293b` (slate-800) | Input/result panels |
| Label BG | `rgba(0,0,0,0.7)` | Bounding box labels |
| Progress Bar | `#2563eb` (blue-600) | Upload progress |
| Shimmer | `linear-gradient(...slate-700...slate-600...)` | Skeleton loader |

---

## 8. Typography Scale

| Usage | Size | Weight | Family | Color |
|---|---|---|---|---|
| Drop zone heading | 14px | 400 | Sans | slate-400 |
| Drop zone hint | 10px | 400 | Sans | slate-600 |
| Status label | 12px | 500 | Sans | dynamic |
| Box label | 11px | 400 | Mono | white |
| Face card header | 13px | 600 | Sans | slate-200 |
| Attribute key | 11px | 400 | Sans | slate-500 |
| Attribute value | 11px | 500 | Sans | slate-300 |
| JSON key | 12px | 400 | Mono | slate-400 |
| JSON string | 12px | 400 | Mono | emerald-400 |
| JSON number | 12px | 400 | Mono | amber-400 |

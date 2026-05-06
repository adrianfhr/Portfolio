# Animations — Face Recognition Module

**Module ID:** FACE-001-DS  
**Version:** 1.0.0  
**Status:** Draft

---

## 1. Animation Principles

Vision Playground animations should feel **technical and responsive** — reinforcing the sense of a live ML pipeline. Transitions are snappy; loading states are informative; result reveals are satisfying.

### Timing Tokens
| Token | Duration | Usage |
|---|---|---|
| `instant` | 0ms | Color changes, border changes |
| `fast` | 100ms | Hover states, button feedback |
| `normal` | 200ms | State changes, panel transitions |
| `smooth` | 300ms | Result reveals, modal entrances |
| `slow` | 500ms | Page-level transitions |

### Easing Tokens
| Token | Curve | Usage |
|---|---|---|
| `ease-out` | `cubic-bezier(0, 0, 0.2, 1)` | Elements entering |
| `ease-in-out` | `cubic-bezier(0.4, 0, 0.2, 1)` | Symmetric transitions |
| `spring` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Bouncy reveals |

---

## 2. Drop Zone Animations

### 2.1 Drag Over
- **Trigger:** File dragged over drop zone.
- **Animation:**
  - Border: dashed → solid (instant).
  - Border color: `slate-600` → `blue-500` (150ms).
  - Background: transparent → `blue-500/10` (150ms).
  - Icon: scale 1.0 → 1.1 (150ms `ease-out`).

### 2.2 Drag Leave
- **Trigger:** File dragged away.
- **Animation:** Reverse of drag over (150ms).

### 2.3 Upload Progress
- **Trigger:** Upload begins.
- **Animation:** Progress bar width 0% → N% (linear, tied to actual progress).
- **Overlay:** Opacity 0 → 1 (100ms).

### 2.4 Validation Error (Shake)
- **Trigger:** Invalid file dropped.
- **Animation:** Horizontal shake.
  - TranslateX: 0 → -8px → 8px → -6px → 6px → 0 (300ms total).
- **Border:** Flashes red for 1 second, then returns to default.

---

## 3. Webcam Animations

### 3.1 Preview Start
- **Trigger:** Camera permission granted.
- **Animation:** Video element fades in (opacity 0 → 1, 200ms).
- **Controls:** Fade in with 100ms delay.

### 3.2 Capture Flash
- **Trigger:** Capture button clicked.
- **Animation:** White overlay flashes (opacity 0 → 0.3 → 0, 150ms).
- **Sound:** Optional shutter sound (muted by default; enabled via user gesture).

### 3.3 Retake Transition
- **Trigger:** Retake button clicked.
- **Animation:**
  - Captured image fades out (100ms).
  - Video preview fades in (150ms).

---

## 4. Result Panel Animations

### 4.1 Skeleton Loader
- **Trigger:** Processing begins.
- **Animation:**
  - Canvas area: Shimmer gradient sweeps left-to-right (1.2s loop).
  - JSON lines: Each line pulses opacity 0.4 → 0.8 (1s loop, 100ms stagger).

### 4.2 Result Reveal
- **Trigger:** Results received (`completed` state).
- **Animation:**
  - Skeleton fades out (150ms).
  - Canvas image fades in (200ms).
  - Bounding boxes draw in with 100ms stagger per face.
    - Stroke animation: `stroke-dashoffset` from full to 0 (300ms per box).
    - Label fades in after box completes (100ms).
  - Face cards slide up from below with 80ms stagger.
    - TranslateY: 16px → 0, opacity 0 → 1 (200ms `ease-out`).
  - JSON panel content fades in (150ms).

### 4.3 Bounding Box Hover
- **Trigger:** Mouse enters box.
- **Animation:**
  - Stroke width: 3px → 5px (100ms).
  - Fill opacity: 0.1 → 0.2 (100ms).
  - Box shadow: subtle glow appears (100ms).

### 4.4 Bounding Box Highlight (from Card Click)
- **Trigger:** User clicks face detail card.
- **Animation:**
  - Corresponding box pulses: scale 1.0 → 1.02 → 1.0 (200ms `spring`).
  - Ring highlight: `ring-2 ring-white` fades in (100ms), holds 2s, fades out (300ms).

---

## 5. Status Indicator Animations

### 5.1 Queued
- **Trigger:** Task enters queue.
- **Animation:** Clock icon subtle bounce (translateY 0 → -2px → 0, 1s loop).

### 5.2 Processing
- **Trigger:** Worker begins inference.
- **Animation:** Spinner rotates 360° linear infinite (800ms per rotation).

### 5.3 Completed
- **Trigger:** Results ready.
- **Animation:**
  - Checkmark icon scales from 0 → 1 (200ms `spring`).
  - Green color transition: `slate-500` → `emerald-500` (150ms).

### 5.4 Failed
- **Trigger:** Error occurs.
- **Animation:**
  - X icon shakes (rotate -5° → 5°, 200ms).
  - Red color transition: `slate-500` → `rose-500` (150ms).

---

## 6. JSON Panel Animations

### 6.1 Expand/Collapse
- **Trigger:** Click section header.
- **Animation:**
  - Chevron rotates 0° → 90° (150ms `ease-in-out`).
  - Content height: 0 → auto (200ms `ease-out`).
  - Opacity: 0 → 1 (150ms, 50ms delay).

### 6.2 Copy Feedback
- **Trigger:** Click "Copy JSON".
- **Animation:** Button text changes to "Copied!" with green flash; returns to "Copy JSON" after 2s.

---

## 7. Rate Limit Countdown

### 7.1 Button Disabled
- **Trigger:** Rate limit hit.
- **Animation:**
  - Button opacity: 1 → 0.5 (100ms).
  - Overlay countdown fades in (100ms).

### 7.2 Re-enable
- **Trigger:** Countdown reaches 0.
- **Animation:**
  - Overlay fades out (100ms).
  - Button opacity: 0.5 → 1 (100ms).
  - Subtle pulse: scale 1.0 → 1.02 → 1.0 (200ms `spring`).

---

## 8. Accessibility & Motion Preferences

### 8.1 Reduced Motion (`prefers-reduced-motion: reduce`)
- Drop zone drag feedback: instant color change (no scale).
- Webcam capture flash: removed.
- Skeleton loader: static gray blocks (no shimmer).
- Result reveal: instant (no stagger, no dash animation).
- Bounding box hover: instant width change.
- Spinner: replaced with static "Processing..." text.
- All opacity transitions: 50ms or removed.

### 8.2 Focus Management
- Focus ring appears instantly on all interactive elements.
- No animated focus movement.
- Drop zone receives focus on Tab; Enter triggers file picker.

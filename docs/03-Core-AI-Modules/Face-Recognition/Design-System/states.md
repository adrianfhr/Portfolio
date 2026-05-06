# States — Face Recognition Module

**Module ID:** FACE-001-DS  
**Version:** 1.0.0  
**Status:** Draft

---

## 1. Global Analysis States

### 1.1 Idle
- **Trigger:** Page loaded; no analysis in progress.
- **Visual:**
  - Input panel: Drop zone visible, webcam hidden.
  - Result panel: Empty state with placeholder graphic.
  - Controls: "Upload File" and "Use Webcam" buttons enabled.
- **Behavior:** User can interact with input methods.
- **Transitions:** → Uploading (file selected), → Webcam Active (webcam toggled).

### 1.2 Uploading
- **Trigger:** File selected or webcam capture confirmed.
- **Visual:**
  - Drop zone: progress overlay with bar and percentage.
  - Controls: disabled.
  - Result panel: empty state.
- **Behavior:** File transfers to server.
- **Transitions:** → Queued (upload complete, request_id received), → Error (upload fails).

### 1.3 Queued
- **Trigger:** Upload complete; task in Redis queue.
- **Visual:**
  - Status indicator: amber clock icon, "Queued (#N)" label.
  - Result panel: skeleton loader appears.
  - Controls: disabled.
- **Behavior:** Polling/WebSocket waiting for worker to pick up task.
- **Transitions:** → Processing (worker started), → Failed (queue timeout > 30s).

### 1.4 Processing
- **Trigger:** Celery worker begins inference.
- **Visual:**
  - Status indicator: blue spinner, "Processing..." label.
  - Result panel: skeleton loader active.
  - Live process panel shows active steps.
- **Behavior:** Detection, embedding, matching, attribute extraction executing.
- **Transitions:** → Completed (results available), → Failed (inference error or timeout > 10s).

### 1.5 Completed
- **Trigger:** Results returned from worker.
- **Visual:**
  - Status indicator: green checkmark, "Analysis complete" label.
  - Result panel: annotated canvas + face detail cards + JSON output.
  - Controls: re-enabled.
- **Behavior:** User can interact with results, copy JSON, hover boxes.
- **Transitions:** → Idle (new upload initiated), → Uploading (drag new file).

### 1.6 Failed
- **Trigger:** Upload error, validation failure, queue timeout, inference timeout, or model crash.
- **Visual:**
  - Status indicator: red X, "Analysis failed" label.
  - Result panel: error state with icon, message, and "Try Again" CTA.
  - Controls: re-enabled.
- **Behavior:** User can retry with new image or same image.
- **Transitions:** → Idle (click Try Again), → Uploading (new file selected).

### 1.7 Rate Limited
- **Trigger:** User submits second request within 5 seconds.
- **Visual:**
  - Submit button disabled with countdown overlay.
  - Toast notification: "Please wait X seconds."
- **Behavior:** No new request sent to server.
- **Transitions:** → Idle (countdown expires).

---

## 2. Component States

### 2.1 DropZone

| State | Visual | Interaction |
|---|---|---|
| **Idle** | Dashed border, upload icon | Drag, drop, click |
| **Drag Over** | Blue solid border, lighter bg | Drop |
| **Uploading** | Progress overlay, percentage | None |
| **Error** | Red border, shake animation | Click to dismiss error |
| **Disabled** | Opacity 0.5 | None |

### 2.2 WebcamCapture

| State | Visual | Interaction |
|---|---|---|
| **Loading** | Spinner, "Requesting camera..." | None |
| **Preview** | Live video, capture button | Capture, switch camera |
| **Captured** | Frozen frame, retake/analyze buttons | Retake, analyze |
| **Denied** | Warning icon, instructions | Link to settings |
| **Error** | Error icon, message | Retry |

### 2.3 AnnotatedCanvas

| State | Visual | Interaction |
|---|---|---|
| **Empty** | Placeholder graphic | None |
| **Loading** | Skeleton shimmer | None |
| **Rendered** | Image + bounding boxes | Hover, tap, click |
| **Highlighted** | One box thicker/brighter | Click card to highlight |
| **Zoomed** | Full-resolution new tab | Click to open |

### 2.4 JsonOutputPanel

| State | Visual | Interaction |
|---|---|---|
| **Collapsed** | Header only, chevron right | Click to expand |
| **Expanded** | Full JSON, syntax highlighted | Copy, collapse sections |
| **Loading** | Skeleton lines | None |
| **Empty** | "No results yet" message | None |

### 2.5 StatusIndicator

| State | Visual | Interaction |
|---|---|---|
| **Idle** | Gray dot, "Ready" | None |
| **Queued** | Amber clock, position | None |
| **Processing** | Blue spinner, animated | None |
| **Complete** | Green check, pulse | None |
| **Failed** | Red X, static | Hover for error detail |

---

## 3. Webcam Permission States

| State | Trigger | Visual | Resolution |
|---|---|---|---|
| **Unknown** | Initial load | Loading spinner | — |
| **Granted** | User allows | Live preview | Proceed |
| **Denied** | User blocks | Instructions + CTA | Manual enable |
| **Dismissed** | User dismisses prompt | Instructions + CTA | Re-prompt |
| **Not Supported** | No getUserMedia | Fallback message | File upload only |

---

## 4. Bounding Box States

| State | Visual | Trigger |
|---|---|---|
| **Default** | 3px stroke, 10% fill | Canvas rendered |
| **Hover** | 5px stroke, 20% fill | Mouse over box |
| **Active** | 5px stroke, 30% fill, glow | Click or card select |
| **Hidden** | Not drawn | Filter toggled off |

---

## 5. State Transition Diagram (Summary)

```
Idle
  │
  ├─► Uploading ──► Queued ──► Processing ──► Completed
  │       │              │            │              │
  │       ▼              ▼            ▼              ▼
  │     Error          Failed      Failed         Idle (new)
  │
  └─► Webcam Active ──► Captured ──► Uploading
```

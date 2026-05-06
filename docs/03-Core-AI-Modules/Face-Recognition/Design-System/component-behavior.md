# Component Behavior — Face Recognition Module

**Module ID:** FACE-001-DS  
**Version:** 1.0.0  
**Status:** Draft

---

## 1. VisionPlaygroundContainer

### Overview
Root layout component managing the split-pane input/result layout, responsive behavior, and global analysis state.

### Behaviors

#### 1.1 Initialization
- Render input panel in default state (drop zone visible).
- Result panel shows empty state.
- Fetch gallery info (count, last updated) for display.

#### 1.2 Responsive Switching
- On resize crossing 1024px breakpoint, switch between split-pane and stacked layouts.
- Panel widths stored in `localStorage` (user-adjustable splitter in future release).
- Mobile: JSON output collapsed by default; accessible via FAB.

#### 1.3 State Orchestration
- Maintains top-level state: `idle | uploading | queued | processing | completed | failed`.
- Passes state down to child components via props/context.

---

## 2. DropZone

### Overview
The primary image input area supporting drag-and-drop and click-to-browse.

### Behaviors

#### 2.1 Drag Events
- `dragenter`: Add `drag-over` class (blue border, lighter background).
- `dragover`: Prevent default to allow drop.
- `dragleave`: Remove `drag-over` class (with 50ms debounce to prevent flicker).
- `drop`: Prevent default; extract `dataTransfer.files[0]`; validate and proceed to upload.

#### 2.2 Click to Browse
- Click anywhere on drop zone triggers hidden `<input type="file">`.
- After file selection, same validation and upload flow as drag-and-drop.

#### 2.3 Validation
- File size <= 4MB.
- MIME type in allow-list.
- Image dimensions 100×100 to 4096×4096 (decoded via `FileReader` + `Image`).
- On validation failure: shake animation + error tooltip (3s duration).

#### 2.4 Upload
- Valid file appended to `FormData` and sent via `POST /api/v1/vision/analyze`.
- Upload progress tracked via `axios onUploadProgress`.
- Progress bar width updated in real time.
- On success: receive `request_id`; transition to `queued` state.
- On error: display error toast; return to `idle`.

#### 2.5 Webcam Toggle
- Clicking "Use Webcam" hides drop zone, shows WebcamCapture component.
- Captured image from webcam is treated as a File object and follows same upload flow.

---

## 3. WebcamCapture

### Overview
Live camera interface for capturing photos without file upload.

### Behaviors

#### 3.1 Initialization
- Call `navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } })`.
- Stream assigned to `<video>` element.
- Mirror video via CSS `transform: scaleX(-1)` for natural selfie feel.

#### 3.2 Permission Handling
- **Granted:** Stream plays; controls enabled.
- **Denied:** Show permission denied message with browser-specific instructions.
- **Not Supported:** Show fallback message; hide webcam option.

#### 3.3 Capture
- Click capture button: draw current video frame to `<canvas>`.
- Convert canvas to Blob (`canvas.toBlob`) as `image/jpeg`, quality 0.9.
- Stop video stream tracks to release camera.
- Show captured frame as static image with "Retake" and "Analyze" buttons.

#### 3.4 Retake
- Dispose of captured blob.
- Re-request camera stream.
- Show live preview again.

#### 3.5 Analyze
- Treat captured blob as file; upload via same flow as DropZone.
- Show upload progress.

---

## 4. AnnotatedCanvas

### Overview
Renders the analyzed image with overlaid bounding boxes, labels, and interactive highlights.

### Behaviors

#### 4.1 Image Loading
- Load original image into `<img>` for natural sizing.
- On load, get natural dimensions.
- Draw onto `<canvas>` at display resolution (scaled to fit container).

#### 4.2 Bounding Box Drawing
- For each face in results:
  - Scale bbox coordinates from original to display resolution.
  - Draw rectangle stroke (3px) in appropriate color.
  - Fill rectangle with semi-transparent color (10% opacity).
  - Draw label background rectangle above box.
  - Draw label text (identity + confidence).

#### 4.3 Smart Label Placement
- If label would overflow top edge, place below box.
- If multiple labels would overlap, offset vertically by 16px increments.

#### 4.4 Hover Interaction (Desktop)
- Mouse move tracked over canvas.
- Hit-test: check if cursor is inside any bounding box.
- Hovered box: stroke width 5px, fill 20% opacity, cursor pointer.
- Corresponding face card in JSON panel scrolls into view and highlights.

#### 4.5 Tap Interaction (Mobile)
- Tap on canvas detects which box was tapped (closest center).
- Highlight tapped box.
- Bottom sheet opens with face details.

#### 4.6 Zoom & Pan (Future)
- Pinch-to-zoom on mobile (not in v1.0).
- Scroll to zoom on desktop (not in v1.0).
- v1.0: click to open full-resolution image in new tab.

---

## 5. JsonOutputPanel

### Overview
Collapsible panel displaying structured inference results.

### Behaviors

#### 5.1 Data Reception
- Receives result JSON on `completed` state.
- Parses and formats for display.
- Updates syntax-highlighted content.

#### 5.2 Collapsible Sections
- Top-level keys are collapsible (chevron toggle).
- Default state: `faces` array expanded; other sections collapsed.
- Chevron rotates 90° when expanded (150ms transition).

#### 5.3 Copy to Clipboard
- Click "Copy JSON" button.
- Serialize result object to formatted JSON string.
- Copy to clipboard via `navigator.clipboard.writeText`.
- Show "Copied!" tooltip for 2 seconds.

#### 5.4 Face Entry Navigation
- Clicking a face entry in JSON panel scrolls canvas to corresponding bounding box.
- Entry highlights with `bg-slate-700` for 2 seconds.

---

## 6. StatusIndicator

### Overview
Compact component showing current pipeline status.

### Behaviors
- Polls `GET /api/v1/vision/status/{request_id}` every 1 second while `queued` or `processing`.
- WebSocket alternative: listens for `vision_status` events.
- Updates icon, color, and label based on status.
- Shows queue position if `queued` (e.g., "Queued (#3)").
- Animates spinner during `processing`.

---

## 7. FaceDetailCards

### Overview
List of cards below the canvas, one per detected face.

### Behaviors
- Rendered from `faces` array in result JSON.
- Cards ordered by face ID (left-to-right, top-to-bottom visual order).
- Each card contains: thumbnail crop, identity, similarity bar, attributes grid.
- Similarity bar: width = similarity × 100%, color = `emerald-500` (>=0.6) or `amber-500`.
- Click card → highlight corresponding bbox on canvas.
- Hover card → subtle `bg-slate-800` transition (150ms).

---

## 8. LiveProcessPanel

### Overview
Right-side or overlay panel showing real-time pipeline steps.

### Behaviors
- Subscribes to WebSocket `ws://host/ws/logs`.
- Filters for `request_id` matching current analysis.
- Steps appear in order: Upload → Validation → Detection → Embedding → Matching → Attributes.
- Each step: status icon, name, latency, detail text.
- Active step shows spinner; completed shows checkmark; failed shows red X.
- Steps animate in with 100ms stagger.

---

## 9. RateLimitCountdown

### Overview
Shown when user hits the 1-request-per-5-seconds limit.

### Behaviors
- Disabled submit button with overlay.
- Countdown timer: "Wait 4.2s".
- Updates every 100ms for smooth display.
- When reaching 0, button re-enables with pulse animation.
- Tooltip on hover: "Rate limit: 1 analysis per 5 seconds."

# Face Recognition System — Acceptance Criteria

> **Module:** Face Recognition & Computer Vision  
> **Version:** 1.0

## AC-FR-001: Upload and Validation

- [ ] The UI accepts JPEG, PNG, and WebP images.
- [ ] Files larger than 4 MB are rejected before inference.
- [ ] Corrupted or invalid images are rejected with a friendly error message.

## AC-FR-002: Webcam Capture

- [ ] The browser can open the camera on supported desktop and mobile devices.
- [ ] Users can capture an image without leaving the page.
- [ ] Permission denial falls back to upload mode.

## AC-FR-003: Face Detection Output

- [ ] All detected faces are rendered with bounding boxes.
- [ ] The response includes coordinates for every detected face.
- [ ] Images without faces return an empty face list rather than an error.

## AC-FR-004: Recognition Behavior

- [ ] Known faces are matched only when the configured threshold is reached.
- [ ] Unknown faces are labeled explicitly as `Unknown`.
- [ ] Attribute data is shown only when confidence is sufficient.

## AC-FR-005: Async Processing

- [ ] Queued jobs return `202 Accepted` with a request ID.
- [ ] Polling the status endpoint eventually returns the final result.
- [ ] Queue saturation does not block the request path.

## AC-FR-006: Performance and Observability

- [ ] GPU inference for a single face completes within the target demo budget.
- [ ] The UI shows processing time and queue duration.
- [ ] Structured logs include the request ID for analysis and debugging.

## AC-FR-007: Security

- [ ] Temporary uploads are cleaned up automatically.
- [ ] The system does not persist user photos without explicit consent.
- [ ] Rate limiting prevents abuse of the inference endpoint.# Acceptance Criteria — Face Recognition Module

**Module ID:** FACE-001  
**Version:** 1.0.0  
**Status:** Draft

---

## AC-001: Image Upload

- [ ] Drag-and-drop accepts JPEG, PNG, WebP files.
- [ ] File picker accepts JPEG, PNG, WebP files.
- [ ] Visual feedback (blue border, background change) on drag-over.
- [ ] Upload progress bar shows 0–100% during transfer.
- [ ] Rejected files trigger shake animation and clear error tooltip.
- [ ] Client validates file size <= 4MB before upload.
- [ ] Client validates image dimensions (100×100 to 4096×4096).

## AC-002: Webcam Capture

- [ ] "Use Webcam" button requests camera permission.
- [ ] Live preview displays mirrored video stream.
- [ ] "Capture" button freezes frame and converts to image.
- [ ] "Retake" button resumes live preview and discards capture.
- [ ] Permission denial shows helpful instructions with browser-specific guidance.
- [ ] Front camera is default on mobile; rear camera selectable.
- [ ] Captured image is submitted for analysis on "Analyze" click.

## AC-003: Server-Side Validation

- [ ] Server re-validates MIME type against allow-list.
- [ ] `python-magic` verifies file signature matches declared type.
- [ ] Corrupted files return HTTP 400 with "Invalid image file."
- [ ] Oversized files (> 4MB) return HTTP 413.
- [ ] EXIF metadata is stripped before processing.
- [ ] Image dimensions re-verified server-side.

## AC-004: Face Detection

- [ ] Faces detected with bounding boxes [x, y, w, h] in original image coordinates.
- [ ] Confidence threshold = 0.5; detections below are discarded.
- [ ] Single-face images: 1 bounding box, labeled with confidence %.
- [ ] Multi-face images: up to 20 bounding boxes, each labeled.
- [ ] No faces detected returns empty array with user-friendly message.
- [ ] Detection completes in < 500ms (GPU) or < 2s (CPU).

## AC-005: Face Embedding & Matching

- [ ] 512-dim embedding extracted for each detected face.
- [ ] Embedding is L2-normalized.
- [ ] Cosine similarity computed against gallery vectors.
- [ ] Similarity >= 0.6 → labeled with gallery identity name.
- [ ] Similarity < 0.6 → labeled "Unknown".
- [ ] Gallery contains pre-populated owner photos.

## AC-006: Color-Coded Annotations

- [ ] Matched face (>= 0.6): green bounding box (`#22c55e`).
- [ ] Unknown face (< 0.6, detection >= 0.5): yellow bounding box (`#eab308`).
- [ ] Low confidence detection (< 0.5): red bounding box (`#ef4444`).
- [ ] Label text drawn above box with semi-transparent background.
- [ ] Hover/tap highlights box (thicker stroke, brighter fill).

## AC-007: Attribute Detection

- [ ] Gender predicted with confidence score.
- [ ] Age estimated as integer with confidence score.
- [ ] Expression classified into 7 categories with confidence.
- [ ] Glasses detection (yes/no) with confidence.
- [ ] Attributes displayed per-face in JSON panel.

## AC-008: Async Queue & Status Polling

- [ ] Upload returns `request_id` immediately (HTTP 202).
- [ ] Status endpoint `GET /api/v1/vision/status/{request_id}` returns current state.
- [ ] States: `queued`, `processing`, `completed`, `failed`.
- [ ] WebSocket provides real-time status updates (alternative to polling).
- [ ] Max queue wait: 30 seconds.
- [ ] Max inference time: 10 seconds.
- [ ] Results stored in Redis with 1-hour TTL.

## AC-009: JSON Output Panel

- [ ] Panel displays structured JSON response.
- [ ] Fields: request_id, status, image metadata, inference metrics, faces array.
- [ ] Inference metrics include: model_name, inference_time_ms, queue_duration_ms, device.
- [ ] Each face object includes: bbox, confidence, identity, similarity, attributes.
- [ ] JSON is syntax-highlighted and collapsible.
- [ ] "Copy JSON" button copies full response to clipboard.

## AC-010: Live Process Panel

- [ ] Right panel shows pipeline steps: Upload → Validation → Detection → Embedding → Matching.
- [ ] Each step shows status icon and latency.
- [ ] Logs stream via WebSocket with `[SHOWCASE_LOG]` tag.
- [ ] Panel is toggleable without losing results.
- [ ] Panel is collapsed by default on mobile.

## AC-011: Temp Storage Cleanup

- [ ] Uploaded images deleted automatically within 1 hour.
- [ ] Celery beat task runs cleanup every 10 minutes.
- [ ] Admin panel shows temp storage metrics (file count, total size).
- [ ] "Delete Now" button removes image and results immediately.
- [ ] No visitor image retained without explicit opt-in.

## AC-012: Rate Limiting

- [ ] 1 request per 5 seconds per identity.
- [ ] Submit button disabled during cooldown with countdown.
- [ ] HTTP 429 returned with `Retry-After` header if exceeded.
- [ ] IP-based limit: 10 requests per minute.

## AC-013: Mobile Experience

- [ ] Upload area supports mobile photo picker.
- [ ] Webcam uses front camera by default.
- [ ] Result canvas is zoomable and scrollable.
- [ ] JSON panel collapsible.
- [ ] Touch targets >= 44×44px.

## AC-014: Error Handling & Fallbacks

- [ ] InsightFace model failure falls back to OpenCV DNN detection.
- [ ] GPU OOM falls back to CPU inference.
- [ ] Queue depth > 20 returns HTTP 503 with `Retry-After`.
- [ ] Inference timeout (>10s) returns failed status with clear message.
- [ ] Gallery empty falls back to detection-only mode.
- [ ] All errors logged with `request_id` and `trace_id`.

## AC-015: Performance

- [ ] Single-face GPU inference < 500ms.
- [ ] Single-face CPU inference < 2s.
- [ ] End-to-end (upload → results) < 3s (queue=0, GPU).
- [ ] Canvas render < 100ms.
- [ ] 4 concurrent tasks without >25% latency degradation.

# Face Recognition System — Edge Cases

> **Module:** Face Recognition & Computer Vision  
> **Version:** 1.0

## 1. Edge Cases

| Scenario | Expected Handling |
|---|---|
| Multiple faces in a group photo | Detect and annotate every face independently. |
| No face in the image | Return success with an empty `faces` array. |
| Very low light image | Still attempt detection and surface low-confidence warnings. |
| Face partially occluded | Return partial detection if enough features are visible. |
| Corrupted image payload | Reject with a friendly validation error before inference. |
| Unsupported file type | Reject with a clear media type error. |
| File larger than 4 MB | Reject at the API boundary and client boundary. |
| Queue backlog spike | Accept the request and return a queued status rather than timing out the request thread. |
| Camera permission denied | Fall back to upload mode without losing the current session. |
| No known match above threshold | Return `Unknown` instead of the nearest identity. |
| GPU unavailable | Fall back to CPU inference and reflect the device in the response. |
| Cleanup job delayed | Keep the result usable while logging the stale artifact for retry. |

## 2. Handling Principles

- Prefer graceful degradation over hard failure when the user can still learn something useful.
- Never guess a face identity when the confidence threshold is not met.
- Keep the response schema stable even when optional signals are missing.# Edge Cases — Face Recognition Module

**Module ID:** FACE-001  
**Version:** 1.0.0  
**Status:** Draft

---

## EC-001: Multiple Faces in Image

### Scenario
User uploads a group photo containing 8 faces.

### Impact
Longer inference time; potential memory spike; crowded canvas annotation.

### Mitigation
1. Process up to 20 faces; log warning if more detected.
2. Batch embedding extraction (batch size 8) to optimize GPU utilization.
3. Canvas labels offset vertically to prevent text overlap; smart label placement algorithm.
4. JSON panel lists all faces with scrollable container.

---

## EC-002: Corrupted or Non-Image File

### Scenario
User renames a `.exe` file to `.jpg` and uploads it.

### Impact
Server crash, security vulnerability, or confusing error message.

### Mitigation
1. Client-side MIME check blocks obviously wrong files.
2. Server-side `python-magic` detects actual file type; rejects if not image.
3. Pillow / OpenCV attempt to decode; catch `UnidentifiedImageError` and return HTTP 400.
4. Log security event: `{ "event": "invalid_upload", "declared_mime": "image/jpeg", "actual_mime": "application/x-dosexec" }`.

---

## EC-003: Low-Light or Blurry Image

### Scenario
User uploads a dark, grainy, or motion-blurred photo.

### Impact
Face detection fails or produces low-confidence bounding boxes.

### Mitigation
1. Detection confidence threshold (0.5) filters out uncertain detections.
2. If no faces detected (empty array), return clear message: "No faces detected. Try a clearer, well-lit photo."
3. If confidence is borderline (0.4–0.5), show warning: "Low confidence detection. Results may be inaccurate."
4. No attempt to "enhance" image via preprocessing (avoids false positives).

---

## EC-004: Face Occlusion

### Scenario
Face is partially covered by mask, sunglasses, hand, or hair.

### Impact
Detection may fail; embedding quality degraded; matching accuracy drops.

### Mitigation
1. InsightFace's `buffalo_l` is trained on occluded faces; may still detect.
2. If detected but confidence < 0.5, mark as low-confidence (red box).
3. Attribute detection (glasses, expression) may be inaccurate; show lower confidence scores.
4. Matching threshold remains 0.6; occluded faces may correctly return "Unknown" rather than false match.

---

## EC-005: No Face Detected

### Scenario
User uploads a landscape photo with no human faces.

### Impact
Empty result set; user confused why nothing happened.

### Mitigation
1. Return HTTP 200 with `{ "faces": [] }`.
2. Canvas shows original image with overlay message: "No faces detected in this image."
3. Suggestion: "Try uploading a photo with a clearly visible face."
4. JSON panel still shows image metadata and inference timing.

---

## EC-006: Oversized Upload

### Scenario
User attempts to upload a 20MB RAW image.

### Impact
Server memory pressure; slow upload; poor UX.

### Mitigation
1. Client-side validation rejects files > 4MB before upload begins.
2. Server-side validation double-checks `Content-Length`.
3. If bypassed, nginx reverse proxy limits request body to 5MB; returns HTTP 413.
4. Helpful error message: "Image too large. Maximum size is 4MB. Try compressing or resizing."

---

## EC-007: Inference Timeout

### Scenario
GPU is overloaded or model inference hangs on a peculiar image.

### Impact
User waits indefinitely; worker thread blocked.

### Mitigation
1. Celery task hard timeout: 10 seconds.
2. After 10s, worker kills task and returns `{ "status": "failed", "error": "Inference timeout. Please try again with a different image." }`.
3. Task result stored in Redis with `status=failed` and error details.
4. Monitoring alert triggered if timeout rate > 1% over 10 minutes.

---

## EC-008: Concurrent Request Spike

### Scenario
Reddit or Hacker News traffic spike sends 100 simultaneous upload requests.

### Impact
Queue backlog; GPU OOM; Redis memory exhaustion.

### Mitigation
1. Rate limiting (1 req/5s per identity) blocks most rapid repeat requests.
2. Queue depth limit: if > 20 queued, return HTTP 503 with `Retry-After`.
3. Celery worker concurrency capped at 4; excess tasks remain in Redis queue.
4. Auto-scaling rule: if queue depth > 10 for > 2 minutes, spawn additional worker (if configured).
5. GPU memory monitoring: if usage > 90%, switch new tasks to CPU.

---

## EC-009: Webcam Permission Denied

### Scenario
User clicks "Use Webcam" but denies browser permission.

### Impact
Webcam interface fails silently; user confused.

### Mitigation
1. Catch `NotAllowedError` from `getUserMedia`.
2. Show helpful message: "Camera access was denied. Please allow camera access in your browser settings and try again."
3. Provide link to browser-specific instructions (Chrome, Safari, Firefox).
4. Fallback CTA: "Or upload a photo instead" scrolls to drop zone.

---

## EC-010: Gallery Empty or Missing

### Scenario
Admin accidentally deletes all gallery embeddings from Qdrant.

### Impact
All faces match as "Unknown"; demonstration value lost.

### Mitigation
1. Startup health check verifies gallery collection has > 0 vectors.
2. If gallery is empty, show admin alert and fallback to detection-only mode.
3. Detection-only mode: bounding boxes drawn, but all labeled "Unknown (gallery unavailable)".
4. Admin panel provides one-click "Restore Default Gallery" from seed data.

---

## EC-011: Embedding Extraction Failure

### Scenario
Model successfully detects face but crashes during embedding extraction (rare alignment failure).

### Impact
Partial results: detection works but no identity or attributes.

### Mitigation
1. Wrap embedding extraction in try/except block.
2. On failure, return face with `embedding: null`, `identity: "Unknown"`, `attributes: null`.
3. Log error with image hash and bounding box for debugging.
4. Other faces in the same image continue processing normally.

---

## EC-012: Browser Canvas Memory Limit

### Scenario
User uploads a 4096×4096 image on a low-memory mobile device.

### Impact
Canvas crashes or browser tab killed by OS.

### Mitigation
1. Client-side downscaling: if image > 2048px on any dimension, resize to max 2048px before upload.
2. Display annotated result at 1024px max width; full-resolution download available via link.
3. Warn user: "Large image detected. Displaying at reduced resolution for performance."

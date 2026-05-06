# Face Recognition System — Non-Functional Requirements

> **Module:** Face Recognition & Computer Vision  
> **Version:** 1.0

## 1. Performance

- GPU inference for a single face should typically complete within 500 ms.
- CPU inference for a single face should typically complete within 2 seconds.
- Queue wait time should remain within a user-friendly demo range under expected traffic.
- UI updates should remain responsive while the analysis job is in progress.

## 2. Reliability

- Temporary failures must return actionable messages and a retry path.
- Queue saturation must not block the API thread.
- Cleanup jobs must remove temporary objects automatically.
- Results should not disappear unexpectedly while the page session is active.

## 3. Security

- Uploaded images must be validated server-side before processing.
- Permanent storage of user photos is forbidden without explicit consent.
- Sensitive data must not appear in logs or analytics payloads.
- Request abuse must be throttled by tier-aware rate limiting.

## 4. Usability

- The interface must make it obvious when the system is uploading, processing, or finished.
- Unknown and low-confidence results must be visually distinct.
- Raw JSON should be readable without requiring developer tools.

## 5. Compatibility

- The experience must work in current desktop browsers and mobile browsers with camera access.
- The module should degrade gracefully when GPU acceleration is unavailable.

## 6. Accessibility

- Controls must be fully operable with keyboard input.
- Result messages and validation errors must be announced to assistive technologies.
- Color-only distinctions must be supplemented with labels or icons.

## 7. Maintainability

- Thresholds and model identifiers should be configurable.
- The API schema should stay stable across frontend revisions.
- Inference, queueing, and rendering concerns should remain separated.# Non-Functional Requirements — Face Recognition Module

**Module ID:** FACE-001  
**Version:** 1.0.0  
**Status:** Draft

---

## NFR-001: Performance & Latency

### Description
The face recognition pipeline must deliver near-real-time results for a compelling demo experience.

### Requirements
1. **Upload Time:** < 2 seconds for a 4MB image on a 10Mbps connection.
2. **Queue Wait Time:** < 5 seconds when queue depth <= 2; < 30 seconds maximum.
3. **Inference Latency (GPU):** < 500ms for single-face detection + embedding + attributes.
4. **Inference Latency (CPU):** < 2 seconds for single-face detection + embedding + attributes.
5. **Multi-Face Scaling:** Add < 200ms per additional face (batched embedding).
6. **End-to-End Latency:** < 3 seconds from upload click to rendered results (queue depth=0, GPU).
7. **Canvas Render Time:** < 100ms to draw annotated image in browser.
8. **Concurrent Inference:** Support 4 concurrent tasks per worker without latency degradation > 25%.

---

## NFR-002: Security

### Description
The module must prevent abuse, protect user privacy, and resist malicious uploads.

### Requirements
1. **File Upload Security:**
   - Strict MIME type allow-list: `image/jpeg`, `image/png`, `image/webp`.
   - `python-magic` validation prevents polyglot / renamed executable uploads.
   - Image decoding verification rejects corrupted or non-image files.
   - Max file size: 4MB (enforced client and server).

2. **Rate Limiting:**
   - 1 request per 5 seconds per identity (enforced by Auth module).
   - Additional IP-based rate limit: 10 requests per minute.

3. **Data Privacy:**
   - No permanent storage of user-uploaded images without explicit opt-in.
   - Temp images deleted within 1 hour (or immediately after processing).
   - EXIF metadata stripped before storage to prevent GPS leakage.
   - Face embeddings of visitors are NOT stored (only computed transiently).

4. **Model Security:**
   - ONNX model files stored in read-only volume.
   - Model download URLs not exposed to client.
   - No model inversion or embedding extraction API exposed directly.

5. **Input Sanitization:**
   - Bounding box coordinates validated (no negative, no overflow).
   - Max 20 faces processed; excess faces logged and ignored.

---

## NFR-003: Scalability

### Description
The inference pipeline must scale with increased load and gallery size.

### Requirements
1. **Gallery Size:** Support up to 100 enrolled identities with 5 photos each (500 gallery vectors) without Qdrant latency degradation.
2. **Queue Depth:** Redis queue must handle 100 pending tasks without message loss.
3. **Worker Scaling:** Celery workers can be scaled horizontally (stateless; model loaded per worker).
4. **GPU Memory:** Model footprint < 2GB VRAM; 4 concurrent tasks fit within 8GB GPU.
5. **CPU Fallback:** System functions correctly without GPU (slower but available).

---

## NFR-004: Availability & Reliability

### Description
The vision playground must remain functional during partial infrastructure failures.

### Requirements
1. **Model Load Failure:**
   - If InsightFace ONNX model fails to load, fallback to OpenCV DNN detection.
   - If fallback also fails, return HTTP 503 with "Vision service temporarily unavailable."
   - Health check endpoint reports model status.

2. **GPU Failure:**
   - If GPU is unavailable or OOM, automatically switch to CPU inference.
   - Log `WARN` event and notify monitoring dashboard.

3. **Queue Backpressure:**
   - If queue depth > 20, return HTTP 503 with `Retry-After: 60`.
   - Client implements exponential backoff (2s, 4s, 8s max).

4. **Worker Crash:**
   - Celery worker crashes are detected by supervisor/systemd; auto-restart within 10 seconds.
   - In-flight tasks are requeued (acks_late=True).

---

## NFR-005: Maintainability

### Description
The computer vision pipeline must be comprehensible and modifiable.

### Requirements
1. **Modular Design:** Detection, alignment, embedding, matching, and attribute models are separate service classes.
2. **Model Versioning:** Model files versioned in object storage; API exposes active model version in response.
3. **Configuration:** All thresholds (confidence, similarity, max faces) in Pydantic Settings.
4. **Testability:** Each stage unit-testable with synthetic images (no camera required).
5. **Observability:** Every inference emits structured log with `request_id`, `model_version`, `device`, `timings`.

---

## NFR-006: Browser Compatibility

### Description
The vision playground must work across modern browsers.

### Requirements
1. **Supported Browsers:** Chrome 90+, Firefox 88+, Safari 14+, Edge 90+.
2. **WebRTC:** `getUserMedia` supported in all target browsers; graceful fallback if unavailable.
3. **File API:** `FileReader`, `Blob`, `FormData` supported.
4. **Canvas:** 2D context supported for annotated result rendering.
5. **Mobile Safari:** File picker and camera access functional; canvas performance acceptable on iPhone 11+.

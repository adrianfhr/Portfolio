# Face Recognition System — Functional Requirements

> **Module:** Face Recognition & Computer Vision  
> **Version:** 1.0

## 1. Ingestion and Input Handling

- Accept image upload via drag-and-drop, file picker, and webcam capture.
- Support JPEG, PNG, and WebP input formats.
- Reject files that exceed 4 MB before they reach inference.
- Normalize orientation using EXIF metadata when present.

## 2. Validation and Safety

- Validate file extension, MIME type, and decoded image content.
- Reject files that are renamed non-images or contain corrupted image data.
- Reject overly large images or extreme dimensions that could cause memory pressure.
- Ensure the server re-validates every file even if the client already accepted it.

## 3. Face Detection

- Detect every visible face in the image.
- Return bounding boxes as `[x, y, width, height]` values.
- Track confidence per detected face.
- Preserve multi-face ordering in the response for deterministic rendering.

## 4. Face Recognition

- Convert each detected face into a normalized embedding.
- Compare embeddings against the indexed face gallery.
- Return the best match only when similarity exceeds the configured threshold.
- Label faces below the threshold as `Unknown`.

## 5. Attribute Estimation

- Optionally include age estimate, gender presentation, expression, and glasses detection.
- Hide uncertain attributes rather than guessing aggressively.
- Keep attribute estimation separate from identity matching so one failure does not block the other.

## 6. Asynchronous Execution

- Queue jobs when inference load exceeds the immediate response budget.
- Provide a request ID for every image analysis operation.
- Allow clients to poll status and retrieve completed results later.
- Maintain job state until the result is retrieved or expired.

## 7. Result Rendering

- Render detection overlays on top of the original image.
- Provide a JSON panel containing the raw response.
- Provide a download action for the annotated image.
- Render queue state and completion state clearly.

## 8. Observability

- Capture processing time, queue duration, face count, and device selection.
- Emit logs for request start, completion, and failure.
- Expose module metrics to the shared monitoring surface.

## 9. Error Handling

- Return descriptive errors for unsupported media, corruption, and size violations.
- Return retryable errors for transient inference failures.
- Never expose stack traces or internal filesystem paths to the UI.# Functional Requirements — Face Recognition Module

**Module ID:** FACE-001  
**Version:** 1.0.0  
**Status:** Draft

---

## FR-001: Image Input Methods

### Description
The system must accept images through three primary input methods: drag-and-drop, file picker, and live webcam capture.

### Specification
1. **Drag & Drop:**
   - Drop zone occupies the left panel (40% width on desktop).
   - Accepts files dragged from OS file manager.
   - Visual feedback on drag-over: border color changes to blue, background lightens.
   - Rejects non-image files with shake animation and tooltip.

2. **File Picker:**
   - Hidden `<input type="file" accept="image/jpeg,image/png,image/webp">`.
   - Triggered by "Browse Files" button or click on drop zone.
   - Multiple file selection disabled in v1.0.

3. **Webcam Capture:**
   - Uses `navigator.mediaDevices.getUserMedia({ video: true })`.
   - Video element shows live preview (mirrored horizontally for natural feel).
   - Resolution: 640×480 minimum, 1920×1080 preferred.
   - Capture button freezes current frame to `<canvas>` and converts to Blob.
   - Retake button discards capture and resumes preview.
   - Front camera default on mobile; rear camera selectable where available.

---

## FR-002: Client-Side Validation

### Description
Images must be validated in the browser before upload to reduce server load and provide immediate feedback.

### Specification
1. **File Size:** Maximum 4MB. Reject with message: "Image must be under 4MB."
2. **MIME Type:** Must be `image/jpeg`, `image/png`, or `image/webp`.
3. **Dimensions:**
   - Minimum: 100×100 pixels.
   - Maximum: 4096×4096 pixels.
   - Reject with message: "Image dimensions must be between 100×100 and 4096×4096."
4. **Image Decoding:** Load into `<img>` or `<canvas>` to verify the file is a valid image (not a renamed text file).
5. **Progress:** Upload progress shown via linear progress bar (0–100%).

---

## FR-003: Server-Side Validation

### Description
Server must re-validate all uploaded images to prevent malicious file uploads.

### Specification
1. **MIME Re-validation:** Check `Content-Type` header against allow-list.
2. **Magic Number Scan:** Use `python-magic` to verify file signatures match declared MIME type.
3. **Image Decoding:** Attempt to open with Pillow / OpenCV; reject if corrupted or unparseable.
4. **Dimension Re-check:** Verify parsed dimensions match client-reported values (±2px tolerance).
5. **Metadata Stripping:** Remove EXIF data to prevent GPS leakage and reduce file size.
6. **Temp Storage:** Save validated image to MinIO/S3 bucket `temp-vision/` with UUID filename.

---

## FR-004: Face Detection

### Description
Detect all human faces in the uploaded image and extract bounding boxes.

### Specification
1. **Primary Model:** InsightFace `buffalo_l` detection model (ONNX Runtime).
   - Input: RGB image, resized to model input size.
   - Output: Array of detections `{ bbox: [x, y, w, h], confidence: float }`.
   - Confidence threshold: 0.5. Detections below threshold are discarded.

2. **Fallback Model:** OpenCV DNN face detector (`res10_300x300_ssd_iter_140000.caffemodel`).
   - Used if InsightFace model fails to load or crashes.
   - Confidence threshold: 0.5.

3. **Bounding Box Format:**
   - `[x, y, width, height]` in pixel coordinates (original image resolution).
   - Clamped to image boundaries (no negative values or overflow).

4. **Max Faces:** Process up to 20 faces per image; if more detected, log warning and process top-20 by confidence.

---

## FR-005: Face Embedding Extraction

### Description
Generate a 512-dimensional facial embedding vector for each detected face.

### Specification
1. **Model:** InsightFace `buffalo_l` recognition model (ONNX Runtime).
2. **Preprocessing:**
   - Crop face region from original image using bounding box.
   - Align using 5 facial landmarks (eyes, nose, mouth corners).
   - Resize to 112×112.
   - Normalize pixel values to [-1, 1].
3. **Output:** 512-dim float32 vector.
4. **Normalization:** L2-normalize the embedding vector (unit length).
5. **Batching:** If multiple faces, process in batches of 8 for GPU efficiency.

---

## FR-006: Face Matching

### Description
Compare extracted face embeddings against a pre-populated gallery to identify known faces.

### Specification
1. **Gallery Storage:**
   - Qdrant collection `face_gallery`.
   - Vectors: 512-dim, distance metric = Cosine.
   - Payload per vector: `{ name: "Adrian Fahri Affandi", photo_id: "...", enrolled_at: "..." }`.

2. **Similarity Computation:**
   - Cosine similarity = dot product of normalized vectors.
   - Range: [-1, 1]; for normalized vectors, effectively [0, 1].

3. **Matching Logic:**
   - For each detected face, query Qdrant for Top-1 nearest neighbor.
   - If similarity >= 0.6 → label as gallery identity.
   - If similarity < 0.6 → label as "Unknown".

4. **Color Coding:**
   - Matched (>= 0.6): Green bounding box (`#22c55e`).
   - Unknown (< 0.6, confidence >= 0.5): Yellow bounding box (`#eab308`).
   - Low confidence (< 0.5): Red bounding box (`#ef4444`).

---

## FR-007: Attribute Detection

### Description
Predict demographic and appearance attributes for each detected face.

### Specification
1. **Model:** InsightFace `buffalo_l` attribute model.
2. **Attributes:**
   - `gender`: "Male" or "Female" (confidence score).
   - `age`: Integer estimate (e.g., 28) ± confidence interval.
   - `expression`: One of ["Neutral", "Happy", "Sad", "Angry", "Surprise", "Fear", "Disgust"].
   - `glasses`: "Yes" or "No".
3. **Output Format:** JSON object per face:
   ```json
   {
     "face_id": 1,
     "attributes": {
       "gender": { "label": "Male", "confidence": 0.97 },
       "age": { "estimated": 28, "confidence": 0.85 },
       "expression": { "label": "Neutral", "confidence": 0.92 },
       "glasses": { "label": "No", "confidence": 0.99 }
     }
   }
   ```

---

## FR-008: Async Inference Queue

### Description
Face recognition inference must be processed asynchronously via a task queue to prevent API blocking.

### Specification
1. **Queue:** Redis-backed Celery task queue.
2. **Task Flow:**
   - Client uploads image → server returns `request_id` immediately.
   - Celery worker picks up task, performs validation, detection, embedding, matching.
   - Results stored in Redis key `vision:result:{request_id}` with 1-hour TTL.
   - Client polls `GET /api/v1/vision/status/{request_id}` or listens via WebSocket.

3. **Status States:**
   - `queued`: Task in Redis queue.
   - `processing`: Worker actively running inference.
   - `completed`: Results available.
   - `failed`: Error occurred (details in response).

4. **Timeouts:**
   - Max queue wait: 30 seconds. If exceeded, task canceled and client receives HTTP 504.
   - Max inference time: 10 seconds. If exceeded, worker terminates task.

5. **Concurrency:** Max 4 concurrent inference tasks per worker to prevent GPU memory exhaustion.

---

## FR-009: Annotated Result Canvas

### Description
The processed image must be rendered with overlaid bounding boxes, labels, and confidence scores.

### Specification
1. **Canvas Rendering:**
   - Original image drawn as base layer.
   - Bounding boxes drawn as stroked rectangles (stroke width 3px).
   - Label text drawn above each box: `{identity} ({confidence%})` or `Unknown`.
   - Label background: semi-transparent black rectangle behind text for readability.

2. **Color Scheme:**
   - Known: `stroke=#22c55e`, `fill=rgba(34,197,94,0.1)`.
   - Unknown: `stroke=#eab308`, `fill=rgba(234,179,8,0.1)`.
   - Low confidence: `stroke=#ef4444`, `fill=rgba(239,68,68,0.1)`.

3. **Interactivity:**
   - Hovering a bounding box highlights it (stroke width 5px, brighter fill).
   - Clicking a face scrolls the JSON panel to the corresponding face entry.
   - On mobile, tap to highlight; long-press to view details in a bottom sheet.

---

## FR-010: JSON Output Panel

### Description
Display structured inference results in a readable JSON format.

### Specification
1. **Layout:** Right panel (60% on desktop) or collapsible drawer.
2. **Content:**
   - `request_id`: UUID.
   - `status`: completed / failed.
   - `image`: original dimensions, format, file size.
   - `inference`: model name, inference_time_ms, queue_duration_ms, device (cpu/gpu).
   - `faces`: array of face objects with bbox, confidence, identity, similarity, attributes.
3. **Formatting:** Syntax-highlighted JSON with collapsible sections (chevron toggle).
4. **Copy:** "Copy JSON" button copies full response to clipboard.

---

## FR-011: Temp Storage Cleanup

### Description
All temporary image files must be automatically deleted to protect user privacy.

### Specification
1. **Cleanup Trigger:**
   - Scheduled Celery beat task every 10 minutes.
   - Deletes all files in `temp-vision/` older than 1 hour.
2. **Immediate Cleanup:**
   - After successful inference, image MAY be deleted immediately (configurable via `IMMEDIATE_CLEANUP` env var).
3. **Audit:**
   - Log deletion events: `{ "event": "temp_cleanup", "file": "...", "age_seconds": 3600 }`.
   - Admin panel shows current temp storage size and file count.
4. **Manual Delete:**
   - "Delete Now" button in JSON panel triggers immediate deletion and clears results.

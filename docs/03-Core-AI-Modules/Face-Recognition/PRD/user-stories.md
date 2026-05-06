# Face Recognition System — User Stories

> **Module:** Face Recognition & Computer Vision  
> **Version:** 1.0  
> **Priority:** High

## 1. Overview

The Face Recognition module is a portfolio-facing computer vision demo that should feel fast, transparent, and trustworthy. The user stories below define the intended behavior from the perspectives of casual visitors, technical reviewers, and the portfolio owner.

## 2. User Stories

### US-1: Upload a Face Image
As a visitor, I want to upload a portrait or group photo so that the system can analyze every visible face.

### US-2: Capture with Camera
As a visitor, I want to use my device camera so that I can test the experience without preparing a file.

### US-3: View Recognition Results
As a visitor, I want to see recognized identities and confidence scores so that I understand what the model is actually doing.

### US-4: Inspect Raw Output
As a developer, I want to inspect the raw JSON payload so that I can verify the API contract and metadata.

### US-5: Compare Known and Unknown Faces
As a visitor, I want the system to separate known identities from unknown ones so that I can trust the output instead of seeing forced matches.

### US-6: Understand Performance
As a reviewer, I want to see queue duration and inference latency so that I can evaluate production readiness.

### US-7: Recover from Failures
As a user, I want friendly error messages when upload or inference fails so that I can try again without losing context.

## 3. Story Acceptance Notes

- Every user story should be testable through the browser UI.
- Results must remain understandable even when the system returns no faces.
- The UI should preserve the uploaded image and analysis state while the page remains open.
- Story outcomes should be consistent between synchronous and queued processing modes.# User Stories — Face Recognition Module

**Module ID:** FACE-001  
**Version:** 1.0.0  
**Status:** Draft

---

## US-001: Image Upload & Face Detection

**As a** Technical Recruiter,  
**I want** to upload a photo and see detected faces highlighted with bounding boxes,  
**So that** I can verify the system's computer vision capabilities on real-world images.

### Acceptance Criteria
- I can upload an image via drag-and-drop or file picker.
- Supported formats: JPEG, PNG, WebP.
- The system detects all faces in the image and draws bounding boxes.
- Each bounding box includes a confidence score label.
- The result is displayed within 3 seconds for a single-face image.

### Priority: Critical
### Story Points: 5

---

## US-002: Live Webcam Capture

**As a** Peer Engineer,  
**I want** to use my webcam to capture a photo directly in the browser,  
**So that** I can test face detection without finding and uploading an existing image file.

### Acceptance Criteria
- Clicking "Use Webcam" requests camera permission via `getUserMedia`.
- A live preview is shown in the upload area.
- Clicking "Capture" freezes the frame and submits it for analysis.
- I can retake the photo before submitting.
- If permission is denied, a helpful message explains how to enable it.

### Priority: High
### Story Points: 3

---

## US-003: Face Matching & Identity Recognition

**As a** CTO evaluating AI systems,  
**I want** the system to match detected faces against a known gallery and identify the portfolio owner,  
**So that** I can assess the accuracy and robustness of the recognition pipeline.

### Acceptance Criteria
- The system compares detected face embeddings against a pre-populated gallery.
- Gallery contains multiple photos of the portfolio owner.
- Matched faces are labeled with the identity name and similarity score.
- Unmatched faces (similarity < 0.6) are labeled "Unknown".
- Color coding: green = known/matched, yellow = unknown, red = low confidence (< 0.5).

### Priority: Critical
### Story Points: 5

---

## US-004: Inference Transparency & Metrics

**As a** systems engineer reviewing the portfolio,  
**I want** to see detailed metrics about the inference process,  
**So that** I can evaluate pipeline latency, model performance, and infrastructure choices.

### Acceptance Criteria
- A JSON output panel shows: inference_time_ms, queue_duration_ms, model_name, confidence_score.
- If GPU is used, gpu_utilization is displayed.
- The right panel shows live pipeline steps: Upload → Validation → Detection → Embedding → Matching.
- Each step displays timing and status.
- Logs are streamed via WebSocket with `[SHOWCASE_LOG]` tag.

### Priority: High
### Story Points: 3

---

## US-005: Attribute Detection

**As a** visitor curious about ML capabilities,  
**I want** to see predicted attributes for each detected face (age, gender, expression, glasses),  
**So that** I can appreciate the depth of the computer vision model beyond simple detection.

### Acceptance Criteria
- Each detected face includes attribute predictions in the JSON panel.
- Attributes: gender (male/female), age (approximate year), expression (neutral/happy/sad/angry/surprise/fear/disgust), glasses (yes/no).
- Confidence scores shown for each attribute.
- Attributes are displayed in a structured card per face.

### Priority: Medium
### Story Points: 2

---

## US-006: Multi-Face Image Handling

**As a** visitor testing edge cases,  
**I want** to upload a group photo and see all faces detected and analyzed individually,  
**So that** I can verify the system handles complex scenes.

### Acceptance Criteria
- All faces in a multi-face image are detected (up to 20 faces).
- Each face gets its own bounding box, color-coded by match status.
- JSON panel lists all faces as an array with individual metrics.
- Faces are numbered sequentially for easy reference.

### Priority: Medium
### Story Points: 3

---

## US-007: Mobile-Friendly Vision Playground

**As a** visitor on a mobile device,  
**I want** the vision playground to be fully functional on a small screen,  
**So that** I can test face detection from my phone camera.

### Acceptance Criteria
- Upload area is touch-friendly and supports mobile photo picker.
- Webcam interface works on mobile browsers (front camera default).
- Result canvas is scrollable and zoomable on mobile.
- JSON panel is collapsible to save screen space.
- Touch targets are at least 44×44px.

### Priority: Medium
### Story Points: 2

---

## US-008: Secure & Ephemeral Processing

**As a** privacy-conscious user,  
**I want** my uploaded photo to be deleted after analysis,  
**So that** my biometric data is not stored permanently.

### Acceptance Criteria
- Uploaded images are stored in temporary storage only.
- Automatic cleanup occurs within 1 hour of upload.
- No image is retained permanently without explicit user consent.
- The privacy policy clearly states this ephemeral processing policy.
- A "Delete Now" button allows immediate manual removal.

### Priority: High
### Story Points: 2

---

## US-009: Rate Limit Awareness

**As a** guest user,  
**I want** to know when I've hit the face recognition rate limit,  
**So that** I understand why I cannot submit another photo immediately.

### Acceptance Criteria
- Rate limit: 1 request per 5 seconds per identity.
- Submit button is disabled during cooldown with countdown timer.
- HTTP 429 returned with `Retry-After` header if limit exceeded.
- Clear message: "Please wait X seconds before analyzing another image."

### Priority: Medium
### Story Points: 2

---

## US-010: Gallery Management (Admin)

**As an** admin,  
**I want** to manage the pre-populated face gallery (add, remove, update owner photos),  
**So that** the recognition system stays accurate as the owner's appearance changes.

### Acceptance Criteria
- Admin panel provides gallery management interface.
- Add photo: upload + auto-extract embedding + store in Qdrant.
- Remove photo: delete from storage and Qdrant.
- Gallery stats: total enrolled faces, average embedding, last updated.
- Changes take effect immediately for new inference requests.

### Priority: Low
### Story Points: 3

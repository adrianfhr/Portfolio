# Accessibility — Face Recognition Module

**Module ID:** FACE-001-DS  
**Version:** 1.0.0  
**Status:** Draft

---

## 1. WCAG Target

This module aims for **WCAG 2.1 Level AA** compliance, with additional attention to non-text content (images, canvas annotations) which require descriptive alternatives.

---

## 2. Keyboard Navigation

### 2.1 Global Shortcuts
| Key | Action | Context |
|---|---|---|
| `Tab` / `Shift+Tab` | Navigate interactive elements | Global |
| `Enter` / `Space` | Activate button or trigger upload | Global |
| `Escape` | Cancel webcam / close panels | Webcam / Panel open |

### 2.2 Drop Zone
- **Focusable:** Yes (`tabIndex=0`).
- **Focus Ring:** `ring-2 ring-blue-500 ring-offset-2`.
- **Activation:** `Enter` or `Space` opens file picker.
- **ARIA:** `role="button"`, `aria-label="Upload image by drag and drop or press Enter to browse"`.

### 2.3 Webcam Controls
- **Capture Button:** Focusable; `Enter` triggers capture.
- **Retake Button:** Focusable; `Enter` resumes preview.
- **Analyze Button:** Focusable; `Enter` submits image.
- **ARIA:** `aria-label="Capture photo from webcam"`.

### 2.4 Annotated Canvas
- Canvas itself is NOT focusable (decorative).
- **Face Detail Cards:** Each card is focusable (`tabIndex=0`).
  - `Enter` scrolls canvas to corresponding face.
  - Arrow keys navigate between cards.
- **ARIA:** Cards have `role="region"`, `aria-label="Face 1: Adrian, similarity 0.91"`.

### 2.5 JSON Output Panel
- **Copy Button:** Focusable; `Enter` copies JSON.
- **Collapsible Sections:** `Enter` toggles expand/collapse.
- **ARIA:** `aria-expanded` attribute on section headers.

---

## 3. Screen Reader Support

### 3.1 Drop Zone
```
role="button"
aria-label="Upload image. Drag and drop a JPEG, PNG, or WebP file up to 4 megabytes, or press Enter to browse files."
aria-describedby="drop-zone-hint"
```

### 3.2 Upload Progress
```
role="progressbar"
aria-valuenow={percent}
aria-valuemin={0}
aria-valuemax={100}
aria-label="Uploading image, 45 percent complete"
```

### 3.3 Status Indicator
```
role="status"
aria-live="polite"
aria-label="Analysis status: Processing"
```
- Updates announced politely when status changes.

### 3.4 Annotated Canvas
Since canvas is not accessible to screen readers, all essential information is duplicated in the DOM:
- **Face List:** A visually hidden (`sr-only`) list describes each face:
  ```
  "Face 1: Bounding box at coordinates 120, 80, width 200, height 250. 
   Identity: Adrian. Confidence: 92 percent. Similarity: 0.91."
  ```
- **Empty State:** `"No faces detected in the uploaded image."`

### 3.5 Face Detail Cards
```
role="article"
aria-label="Face 1 details: Adrian, similarity 91 percent"
```
- All attributes read as description list:
  ```
  "Gender: Male, confidence 97 percent. Age: 28, confidence 85 percent."
  ```

### 3.6 Webcam
```
role="region"
aria-label="Webcam preview. Press capture button to take a photo."
```
- Permission denied:
  ```
  role="alert"
  aria-live="assertive"
  "Camera access denied. Please enable camera permissions in your browser settings."
  ```

---

## 4. Color & Contrast

### 4.1 Text Contrast
| Element | Foreground | Background | Ratio | Pass |
|---|---|---|---|---|
| Drop zone heading | slate-400 (#94a3b8) | slate-800 (#1e293b) | 7.5:1 | AAA |
| Drop zone hint | slate-600 (#475569) | slate-800 (#1e293b) | 4.6:1 | AA |
| Status label (complete) | emerald-400 (#34d399) | slate-900 (#0f172a) | 8.9:1 | AAA |
| Status label (failed) | rose-400 (#fb7185) | slate-900 (#0f172a) | 8.1:1 | AAA |
| Box label text | white (#fff) | black/70 | 16:1 | AAA |
| Face card header | slate-200 (#e2e8f0) | slate-800 (#1e293b) | 11.5:1 | AAA |
| Attribute key | slate-500 (#64748b) | slate-800 (#1e293b) | 4.8:1 | AA |
| JSON key | slate-400 (#94a3b8) | slate-900 (#0f172a) | 7.5:1 | AAA |

### 4.2 Non-Text Contrast (Bounding Boxes)
| Element | Requirement |
|---|---|
| Green box vs dark canvas | 3:1 (emerald-500 vs slate-950 = 8.5:1) |
| Yellow box vs dark canvas | 3:1 (amber-500 vs slate-950 = 7.2:1) |
| Red box vs dark canvas | 3:1 (rose-500 vs slate-950 = 7.8:1) |
| Progress bar fill vs track | 3:1 (blue-600 vs slate-700 = 3.1:1) |

### 4.3 Color Independence
- Face match status is communicated by label text ("Adrian" vs "Unknown"), not just box color.
- Confidence is shown as percentage text, not just color.
- Error states include icon + text + border.

---

## 5. Motion & Vestibular Disorders

### 5.1 Reduced Motion Support
All animations respect `prefers-reduced-motion: reduce`:
- Drop zone drag feedback: instant.
- Webcam flash: removed.
- Skeleton loader: static.
- Result reveal: instant.
- Bounding box draw animation: removed; boxes appear instantly.
- Spinner: static text.
- Shake animation: replaced with static red border.

### 5.2 No Auto-Playing Video
- Webcam preview only plays after explicit user action (clicking "Use Webcam").
- No auto-start on page load.

---

## 6. Cognitive Accessibility

### 6.1 Clear Feedback
- Each state change (queued → processing → completed) is explicit and announced.
- Error messages explain what happened and how to fix it ("Try a clearer photo" not just "Error").
- Progress indicators show time remaining or steps completed.

### 6.2 Consistent Patterns
- All buttons share the same hover/active feedback.
- All status indicators use the same iconography.
- All errors appear in the same location.

### 6.3 Input Assistance
- File type restrictions communicated before upload.
- Size limits communicated before upload.
- Webcam permission instructions are browser-specific.

---

## 7. Touch & Mobile Accessibility

### 7.1 Target Sizes
| Element | Minimum Size | Actual Size |
|---|---|---|
| Drop zone (entire) | 44×44px | Full panel, >320px height |
| Capture button | 44×44px | 48px circle |
| Retake/Analyze buttons | 44×44px | 44px height |
| Face card | 44×44px | ~80px height |
| Copy JSON button | 44×44px | 32px + padding = 44px |
| Collapsible chevron | 44×44px | 32px + padding |

### 7.2 Touch Feedback
- `:active` state on all buttons (scale 0.97, 50ms).
- Drop zone shows visual feedback on tap.
- Face cards highlight on tap.

---

## 8. Testing Checklist

- [ ] Drop zone is focusable and opens file picker via keyboard.
- [ ] Webcam controls are operable via keyboard.
- [ ] Face detail cards are navigable with arrow keys.
- [ ] Screen reader announces upload progress.
- [ ] Screen reader announces analysis status changes.
- [ ] Screen reader can access all face data (bbox, identity, attributes) without seeing canvas.
- [ ] Color contrast meets AA for all text and UI components.
- [ ] Bounding box colors have sufficient contrast against canvas background.
- [ ] Animations respect `prefers-reduced-motion`.
- [ ] Touch targets are >= 44×44px on mobile.
- [ ] Webcam does not auto-play on page load.
- [ ] Error states are announced assertively by screen reader.

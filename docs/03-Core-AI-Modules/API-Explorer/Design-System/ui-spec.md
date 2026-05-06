# API Explorer — UI Specification

> **Module:** API Explorer  
> **Version:** 1.0  
> **Layout Philosophy:** Developer-first, high-signal, and dark-mode native. The page should make the contract easy to inspect and test without leaving the portfolio shell.

## 1. Overview

The explorer should expose the same schema through readable and interactive views. It should feel like a polished developer tool, not a documentation afterthought.

## 2. Layout

### 2.1 Desktop
- Left sidebar for endpoint groups and search.
- Main content area for schema, examples, and try-it-out.

### 2.2 Mobile
- Sidebar collapses into an inline navigation drawer.
- Core content remains visible and scrollable.

## 3. Main Surfaces

### 3.1 Endpoint Navigation
- Searchable list grouped by tags.
- Quick access to frequently used endpoints.

### 3.2 Request Panel
- Show method, path, auth requirements, and parameters.
- Make request editing and execution obvious.

### 3.3 Response Panel
- Show JSON responses, validation errors, and status codes.
- Keep examples visually separated from live responses.

## 4. Visual Tone

- Dark theme with sharp contrast.
- Minimal branding clutter.
- Strong readability for code and schema blocks.
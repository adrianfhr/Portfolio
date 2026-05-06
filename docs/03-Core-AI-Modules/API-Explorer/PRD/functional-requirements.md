# API Explorer — Functional Requirements

> **Module:** API Explorer  
> **Version:** 1.0

## 1. Schema Generation

- Generate OpenAPI from the live FastAPI application.
- Require docstrings for every route.
- Expose explicit request and response models.

## 2. Documentation Views

- Provide Swagger UI for interactive testing.
- Provide ReDoc for a cleaner reading experience.
- Provide a custom explorer page in the portfolio shell.

## 3. Authentication Support

- Accept JWT input in the docs UI.
- Allow testing of protected routes after authorization.
- Leave public routes accessible without auth.

## 4. Endpoint Organization

- Group routes by module and tag.
- Provide quick navigation and search.
- Keep related endpoints visible together.

## 5. Examples and Validation

- Show sample payloads and sample responses.
- Display validation errors clearly.
- Surface rate limit and authorization outcomes.

## 6. Theme and Branding

- Match the portfolio’s dark visual identity.
- Keep the docs readable and consistent across views.

## 7. Rate Limit Awareness

- Show a notice that explorer traffic counts against the quota.
- Apply the same rate limiting rules as normal API traffic.
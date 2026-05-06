# API Explorer — Acceptance Criteria

> **Module:** API Explorer  
> **Version:** 1.0

## AC-API-001: Documentation Views

- [ ] Swagger UI loads correctly.
- [ ] ReDoc loads correctly.
- [ ] The custom explorer page uses the live OpenAPI schema.

## AC-API-002: Interactive Testing

- [ ] Users can execute public endpoints from the UI.
- [ ] Users can authorize with JWT and test protected endpoints.
- [ ] Validation errors are shown clearly in the response view.

## AC-API-003: Organization and Examples

- [ ] Endpoints are grouped by module tags.
- [ ] Request and response examples are visible.
- [ ] Quick navigation makes related endpoints easy to find.

## AC-API-004: Security and Limits

- [ ] All explorer traffic is rate limited.
- [ ] Tokens entered in the UI are not persisted on the server.
- [ ] Production can hide internal schema if required.

## AC-API-005: Usability

- [ ] The explorer works on mobile.
- [ ] Dark mode loads without a white flash.
- [ ] The docs remain readable and accessible.
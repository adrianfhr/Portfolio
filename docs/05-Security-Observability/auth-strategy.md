# Authentication Strategy

> **Scope:** Authentication, authorization, sessions, and quota identity  
> **Version:** 1.0  
> **Status:** Draft

## 1. Overview

The portfolio uses a guest-first authentication model with optional GitHub OAuth login. The goal is to keep the demo frictionless while still demonstrating secure session handling, role-based access control, and quota-aware identity management.

## 2. Identity Model

### 2.1 Guest Identity

- Generate a guest identity from IP and user-agent fingerprinting.
- Sign the guest identifier server-side so it cannot be forged client-side.
- Keep the identity stable for the configured guest window.

### 2.2 Logged-In User

- Use GitHub OAuth with PKCE or a similarly secure redirect flow.
- Exchange the authorization code for a server-issued JWT session token.
- Store the session in HttpOnly cookies and a server-side backup store.

### 2.3 Roles

- `guest`: limited demo access.
- `developer`: extended quota and broader module access.
- `admin`: internal tools and elevated controls.

## 3. Session Handling

- Keep JWTs short-lived and refresh them server-side if needed.
- Use Redis as a session backup and revocation store.
- Rotate or invalidate sessions on logout and suspicious activity.

## 4. Authorization Rules

- Enforce role checks at the route or middleware layer.
- Apply resource-specific limits where needed, such as admin-only panels.
- Keep public demo modules accessible to guest users.

## 5. Security Controls

- HttpOnly, Secure, SameSite=Strict cookies for authenticated sessions.
- Random state parameter for OAuth.
- Server-side validation of all identity-bearing claims.

## 6. Cross-References

- [Rate Limiting](rate-limiting.md)
- [Abuse Prevention](abuse-prevention.md)
- [Logging Pipeline](logging-pipeline.md)
- [Incident Handling](incident-handling.md)
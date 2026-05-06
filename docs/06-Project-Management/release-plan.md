# Release Plan

> **Scope:** Release gating, versioning, and rollback strategy  
> **Version:** 1.0  
> **Status:** Draft

## 1. Overview

The release plan defines how the portfolio moves from internal progress to a public showcase. Releases should be gated by stability, documentation completeness, and a working demo path.

## 2. Release Criteria

- Critical flows are functional.
- Acceptance criteria for the scoped milestone are met.
- Security and rate limiting are in place.
- Observability surfaces are live enough to prove the system is active.

## 3. Versioning

- Use semantic versioning for the showcase release line where helpful.
- Keep milestone or phase numbers visible in the documentation.

## 4. Rollback Strategy

- Keep the previous stable deployment available.
- Revert configuration and environment changes first when possible.
- Preserve user-facing continuity by limiting visible downtime.

## 5. Feature Flags

- Use flags for risky or partially complete demos.
- Hide unfinished advanced behavior until it is stable.

## 6. Cross-References

- [Roadmap](roadmap.md)
- [Milestones](milestones.md)
- [Sprint Plan](sprint-plan.md)
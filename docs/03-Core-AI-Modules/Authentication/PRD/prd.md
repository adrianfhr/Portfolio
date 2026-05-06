# Product Requirements Document — Authentication & Access Control Module

**Module ID:** AUTH-001  
**Version:** 1.0.0  
**Status:** Draft  
**Last Updated:** 2026-05-06  
**Owner:** Senior Fullstack AI / Systems Engineer  
**Stakeholders:** CTO, VP of Engineering, Technical Recruiter, Peer Engineers, End Users (Guests & Developers)

---

## 1. Executive Summary

The Authentication & Access Control module is the security gateway for the Interactive AI Engineering Portfolio & Sandbox. It demonstrates production-grade infrastructure skills by implementing a multi-tier access control system that balances frictionless guest onboarding with robust rate limiting, session security, and role-based authorization. The module protects backend AI services from exploitation, abuse, and DDoS attacks while providing transparent quota visibility to every visitor.

---

## 2. Objective & Goal

**Primary Objective:** Protect backend AI services from exploitation, abuse, and distributed denial-of-service (DDoS) attacks while delivering a seamless, transparent user experience.

**Strategic Goal:** Demonstrate production infrastructure maturity through Redis-based quota management, cryptographically secure session handling, and OAuth 2.0 integration — serving as a live reference implementation for recruiters and peer engineers evaluating system design competence.

---

## 3. Scope

### 3.1 In-Scope
- Guest identity generation and persistence (fingerprinting + HMAC signing)
- Multi-tier quota management (Guest / Developer / Admin)
- Redis-backed sliding-window rate limiting
- GitHub OAuth 2.0 authentication flow (PKCE-aligned with state validation)
- JWT session management (HS256, 7-day expiry, HttpOnly cookies)
- Role-based access control (RBAC) middleware
- Rate limit transparency via HTTP response headers and UI indicators
- Session termination and logout flows
- Graceful degradation when Redis is unavailable

### 3.2 Out-of-Scope
- Multi-tenant organization management or team billing
- Email/password or username/password authentication
- Social login providers other than GitHub
- Biometric authentication
- Subscription tier management or payment processing
- Real-time anomaly detection dashboards (covered by Monitoring module)

---

## 4. Context & Background

The portfolio platform exposes live AI inference endpoints (LLM chatbot, face recognition, vector search) that incur direct API costs. Unprotected, these endpoints are vulnerable to scraping, brute-force attacks, and runaway usage. This module implements a defense-in-depth strategy:

1. **Network Edge:** HTTPS-only, strict CORS, DDoS protection
2. **Gateway Layer:** Redis sliding-window rate limiting, JWT validation
3. **Application Layer:** RBAC, input validation, abuse detection
4. **Session Layer:** Cryptographically signed guest IDs, secure cookie attributes

The module is designed to be observable — every rate limit decision, session creation, and auth event is logged in structured JSON format for real-time log streaming.

---

## 5. Dependencies

| Dependency | Purpose | Module Owner |
|---|---|---|
| Redis | Rate limit counters, session backup, guest ID store | Authentication |
| PostgreSQL | User profiles, audit logs, session metadata | Authentication |
| FastAPI | API gateway, OAuth callback handling, JWT issuance | System Architecture |
| GitHub OAuth App | Identity provider for developer/admin login | External |
| Monitoring Module | Metrics export (`api_requests_total`, `api_latency_seconds`) | Monitoring |

---

## 6. Success Metrics (KPIs)

| Metric | Target | Measurement Method |
|---|---|---|
| Guest onboarding friction | < 2 seconds to first API call | Synthetic monitoring |
| Rate limit accuracy | > 99.5% of requests correctly classified | Audit log sampling |
| False positive rate (legitimate users blocked) | < 0.1% | User feedback + logs |
| Session security score | 0 JWT secrets leaked, 0 cookie theft incidents | Security audit |
| OAuth login success rate | > 98% | GitHub callback telemetry |
| Redis failover recovery | < 500ms degradation to in-memory fallback | Load testing |

---

## 7. Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Redis outage | Medium | High | In-memory fallback with conservative limits |
| GitHub OAuth downtime | Low | Medium | Graceful fallback to guest-only mode |
| JWT secret compromise | Low | Critical | Rotate secrets via env vars; short expiry (7d) |
| Guest ID spoofing | Medium | High | HMAC-SHA256 signing server-side; validate on every request |
| Brute-force login attempts | Medium | Medium | Exponential backoff on OAuth endpoints |

---

## 8. Glossary

| Term | Definition |
|---|---|
| **Guest ID** | Anonymized identifier derived from IP address + User-Agent hash, HMAC-signed |
| **Sliding Window** | Rate limiting algorithm that counts requests within a rolling time window |
| **RBAC** | Role-Based Access Control — permissions derived from user roles |
| **TTFT** | Time to First Token — latency metric for streaming responses |
| **PKCE** | Proof Key for Code Exchange — OAuth 2.0 security extension |

---

## 9. Document References

- `docs/03-System-Architecture.md` — Full technical architecture
- `docs/15-Security-Observability.md` — Cross-cutting security standards
- `docs/16-Development-Roadmap.md` — Sprint timeline (Sprints 1–2)

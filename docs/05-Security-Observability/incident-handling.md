# Incident Handling

> **Scope:** Operational response and post-incident review  
> **Version:** 1.0  
> **Status:** Draft

## 1. Overview

When something fails, the portfolio should fail in a controlled and explainable way. This document defines severity levels, response expectations, and the minimum review workflow after an incident.

## 2. Severity Levels

| Severity | Meaning | Example |
|---|---|---|
| SEV-1 | Critical user-facing outage | API unavailable across the demo |
| SEV-2 | Major degradation | Live stream or inference path severely delayed |
| SEV-3 | Partial issue | One module or dependency unstable |
| SEV-4 | Minor issue | Cosmetic or low-impact failure |

## 3. Response Steps

- Acknowledge the incident.
- Preserve evidence in logs and metrics.
- Apply the smallest safe mitigation.
- Communicate the degraded state clearly.
- Recover and verify the system returns to normal.

## 4. Post-Mortem

- Record root cause, impact, detection method, and remediation.
- Capture preventive follow-up actions.
- Add follow-up work to the roadmap or backlog when needed.

## 5. Communication

- Keep status updates factual and brief.
- Avoid speculation in user-facing messages.
- Use a consistent template for internal review and external explanation.

## 6. Cross-References

- [Monitoring](monitoring.md)
- [Logging Pipeline](logging-pipeline.md)
- [Abuse Prevention](abuse-prevention.md)
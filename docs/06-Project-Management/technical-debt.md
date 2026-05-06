# Technical Debt

> **Scope:** Known debt items and remediation guidance  
> **Version:** 1.0  
> **Status:** Draft

## 1. Overview

Technical debt should be visible, prioritized, and bounded. The portfolio can tolerate some shortcuts during early phases, but those shortcuts must be documented and scheduled for remediation.

## 2. Debt Categories

- Architectural debt: shortcuts in service boundaries or layering.
- UX debt: incomplete interaction states or rough visuals.
- Observability debt: missing metrics, logs, or traces.
- Security debt: temporary controls that need stronger enforcement.
- Documentation debt: outdated or incomplete docs.

## 3. Remediation Principles

- Track debt in the backlog rather than hiding it.
- Tie remediation to a phase or sprint.
- Fix debt that affects trust, security, or demo stability first.

## 4. Prevention

- Keep requirements and implementation aligned.
- Review debt at the end of each milestone.
- Avoid accumulating untracked shortcuts in shared modules.

## 5. Cross-References

- [Roadmap](roadmap.md)
- [Backlog](backlog.md)
- [Release Plan](release-plan.md)
# Interactive AI Engineering Portfolio — Documentation Hub

> **Project:** Interactive AI Engineering Portfolio & Sandbox  
> **Version:** 1.0  
> **Owner:** Adrian Fahri Affandi  
> **Role:** Senior Fullstack AI / Systems Engineer

## Overview

This repository is organized as a documentation-first system. The new folder structure groups related content by product definition, architecture, core modules, real-time infrastructure, security, project management, appendix, and design system.

## Current Structure

### 01. Product Definition
- [Product Vision](01-Product-Definition/pvd.md)
- [Feature Requirements](01-Product-Definition/frd.md)
- [Product Goals](01-Product-Definition/product-goals.md)
- [User Personas](01-Product-Definition/user-personas.md)
- [Positioning](01-Product-Definition/positioning.md)
- [Success Metrics](01-Product-Definition/success-metrics.md)

### 02. Architecture Design
- [System Architecture](02-Architecture-Design/system-architecture.md)
- [Frontend Architecture](02-Architecture-Design/frontend-architecture.md)
- [Backend Architecture](02-Architecture-Design/backend-architecture.md)
- [AI Architecture](02-Architecture-Design/ai-architecture.md)
- [Event Flow](02-Architecture-Design/event-flow.md)
- [WebSocket Architecture](02-Architecture-Design/websocket-architecture.md)
- [Deployment Architecture](02-Architecture-Design/deployment-architecture.md)
- [Infrastructure Topology](02-Architecture-Design/infrastructure-topology.md)

### 03. Core AI Modules
- [Authentication](03-Core-AI-Modules/Authentication)
- [RAG Chatbot](03-Core-AI-Modules/RAG-Chatbot)
- [Face Recognition](03-Core-AI-Modules/Face-Recognition)
- [AI Playground](03-Core-AI-Modules/AI-Playground)
- [Multi-Agent System](03-Core-AI-Modules/Multi-Agent-System)
- [Observability](03-Core-AI-Modules/Observability)
- [Live Logs](03-Core-AI-Modules/Live-Logs)
- [API Explorer](03-Core-AI-Modules/API-Explorer)

### 04. Real-Time Infrastructure
- [WebSocket Events](04-Real-Time-Infrastructure/websocket-events.md)
- [Streaming Strategy](04-Real-Time-Infrastructure/streaming-strategy.md)
- [Queue Architecture](04-Real-Time-Infrastructure/queue-architecture.md)
- [Caching Strategy](04-Real-Time-Infrastructure/caching-strategy.md)
- [Scaling Strategy](04-Real-Time-Infrastructure/scaling-strategy.md)
- [Failover Strategy](04-Real-Time-Infrastructure/failover-strategy.md)

### 05. Security and Observability
- [Authentication Strategy](05-Security-Observability/auth-strategy.md)
- [Rate Limiting](05-Security-Observability/rate-limiting.md)
- [Abuse Prevention](05-Security-Observability/abuse-prevention.md)
- [Monitoring](05-Security-Observability/monitoring.md)
- [Logging Pipeline](05-Security-Observability/logging-pipeline.md)
- [Metrics Catalog](05-Security-Observability/metrics.md)
- [Incident Handling](05-Security-Observability/incident-handling.md)

### 06. Project Management
- [Roadmap](06-Project-Management/roadmap.md)
- [Milestones](06-Project-Management/milestones.md)
- [Backlog](06-Project-Management/backlog.md)
- [Release Plan](06-Project-Management/release-plan.md)
- [Sprint Plan](06-Project-Management/sprint-plan.md)
- [Technical Debt](06-Project-Management/technical-debt.md)

### 07. Appendix
- [Glossary](07-Appendix/glossary.md)
- [API Reference](07-Appendix/api-reference.md)
- [Prompt Library](07-Appendix/prompt-library.md)
- [Sequence Diagrams](07-Appendix/sequence-diagrams.md)
- [Architecture Decisions](07-Appendix/architecture-decisions.md)
- [References](07-Appendix/references.md)

### Design System
- [Foundations](Design-System/foundations)
- [Components](Design-System/components)
- [Patterns](Design-System/patterns)
- [Branding](Design-System/branding)

## Reading Guide

### For Stakeholders
Start with Product Definition, then review Architecture Design and the relevant module pages. The roadmap gives the delivery sequence, and the appendix provides shared terminology.

### For Developers
Read Architecture Design first, then the module folder that matches your current work. Use Real-Time Infrastructure and Security and Observability for cross-cutting behavior.

### For Reviewers
Review Product Definition, Architecture Design, Security and Observability, and the relevant module PRDs before validating implementation claims.

## Conventions

| Symbol | Meaning |
|---|---|
| 🎯 | Objective / Goal |
| 👤 | User Story |
| ⚙️ | Functional Requirement |
| 🎨 | UI/UX Requirement |
| 🔌 | API Contract |
| ✅ | Acceptance Criteria |
| ⚠️ | Edge Case |
| 🔒 | Security Concern |
| 📊 | Metric / KPI |

## Migration Note

The folder-based structure in this hub is now the active documentation source of truth. The legacy flat root documents have been removed after migration.

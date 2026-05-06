# Interactive AI Engineering Portfolio & Sandbox

This repository now contains the first runnable implementation slice for the portfolio platform:

- `apps/web`: an Astro shell that renders the public landing experience and proxies API calls.
- `apps/api`: a FastAPI gateway with health endpoints.
- `docker-compose.yml`: local container orchestration for the two services.
- `.github/workflows/ci.yml`: build and container publish pipeline.

## Quick Start

1. Copy `.env.example` to `.env` and adjust values if needed.
2. Install the web dependencies with `npm install`.
3. Run the services locally:
   - `npm run dev:web`
   - `npm run dev:api`

Or start the container stack with `docker compose up --build`.

## Repository Shape

- `docs/` remains the canonical documentation hub.
- `apps/web` is the user-facing shell.
- `apps/api` is the gateway layer and current implementation anchor.
from __future__ import annotations

import time
from datetime import datetime, timezone

from fastapi import APIRouter

from app.core.config import settings

router = APIRouter(tags=['health'])
started_at = time.monotonic()


def build_timestamp() -> str:
    return datetime.now(timezone.utc).isoformat()


@router.get('/health')
async def health_check() -> dict[str, object]:
    return {
        'status': 'ok',
        'service': settings.app_name,
        'version': settings.app_version,
        'environment': settings.app_env,
        'timestamp': build_timestamp(),
    }


@router.get('/health/ready')
async def readiness_check() -> dict[str, object]:
    return {
        'status': 'ready',
        'service': settings.app_name,
        'environment': settings.app_env,
        'checks': {
            'configuration_loaded': True,
            'cors_configured': bool(settings.cors_origins),
            'api_router_registered': True,
        },
        'timestamp': build_timestamp(),
    }


@router.get('/health/live')
async def liveness_check() -> dict[str, object]:
    return {
        'status': 'alive',
        'service': settings.app_name,
        'uptime_seconds': round(time.monotonic() - started_at, 3),
        'timestamp': build_timestamp(),
    }
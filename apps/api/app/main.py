from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.core.config import settings
from app.core.exceptions import AppException
from app.core.middleware import LoggingMiddleware, RateLimitMiddleware
from app.infra.db import close_db_pool, get_db_pool
from app.infra.redis_client import close_redis, get_redis
from app.routers.auth import router as auth_router
from app.routers.health import router as health_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    try:
        await get_redis()
        print("Redis connected")
    except Exception as exc:
        print(f"Redis unavailable: {exc}")

    try:
        await get_db_pool()
        print("Database connected")
    except Exception as exc:
        print(f"Database unavailable: {exc}")

    yield

    # Shutdown
    await close_redis()
    await close_db_pool()


def create_app() -> FastAPI:
    app = FastAPI(
        title=settings.app_name,
        version=settings.app_version,
        docs_url='/docs',
        redoc_url=None,
        lifespan=lifespan,
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=True,
        allow_methods=['*'],
        allow_headers=['*'],
    )

    app.add_middleware(LoggingMiddleware)
    app.add_middleware(RateLimitMiddleware)

    @app.exception_handler(AppException)
    async def app_exception_handler(request, exc: AppException):
        trace_id = getattr(request.state, "trace_id", "unknown")
        return JSONResponse(
            status_code=exc.status_code,
            content={
                "error": {
                    "code": exc.code,
                    "message": exc.message,
                    "details": exc.details,
                    "trace_id": trace_id,
                }
            },
        )

    @app.get('/')
    async def root() -> dict[str, object]:
        return {
            'service': settings.app_name,
            'version': settings.app_version,
            'status': 'ok',
            'health': '/health',
            'ready': '/health/ready',
            'live': '/health/live',
            'docs': '/docs',
        }

    # Include routers
    app.include_router(health_router)
    app.include_router(auth_router, prefix='/api/v1')

    return app


app = create_app()

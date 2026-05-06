from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.routers.health import router as health_router


def create_app() -> FastAPI:
    app = FastAPI(
        title=settings.app_name,
        version=settings.app_version,
        docs_url='/docs',
        redoc_url=None,
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=True,
        allow_methods=['*'],
        allow_headers=['*'],
    )

    app.include_router(health_router)

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

    return app


app = create_app()
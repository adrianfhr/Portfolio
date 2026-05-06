from functools import lru_cache

from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file='.env', env_file_encoding='utf-8', extra='ignore')

    app_name: str = 'Interactive AI Engineering Portfolio API'
    app_version: str = '0.1.0'
    app_env: str = 'development'
    cors_origins: list[str] = Field(default_factory=lambda: ['http://localhost:3000', 'http://127.0.0.1:3000'])

    # Security
    jwt_secret: str = Field(default='change-me-in-production-min-32-bytes-long!!')
    cookie_secure: bool = False
    cookie_samesite: str = 'strict'
    cookie_domain: str | None = None

    # Infrastructure
    redis_url: str = 'redis://localhost:6379/0'
    database_url: str = 'postgresql://postgres:postgres@localhost:5432/portfolio'

    # GitHub OAuth
    github_client_id: str = ''
    github_client_secret: str = ''
    github_redirect_uri: str = 'http://localhost:3000/api/v1/auth/github/callback'

    @field_validator('cors_origins', mode='before')
    @classmethod
    def parse_cors_origins(cls, value: object) -> list[str]:
        if isinstance(value, str):
            return [origin.strip() for origin in value.split(',') if origin.strip()]

        if isinstance(value, list):
            return [str(origin).strip() for origin in value if str(origin).strip()]

        return ['http://localhost:3000', 'http://127.0.0.1:3000']


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    return Settings()


settings = get_settings()

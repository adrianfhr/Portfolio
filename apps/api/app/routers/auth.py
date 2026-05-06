import time
from typing import Any

import httpx
from fastapi import APIRouter, Request, Response
from fastapi.responses import JSONResponse, RedirectResponse

from app.core.config import settings
from app.core.exceptions import AuthException, ValidationError
from app.core.security import (
    create_jwt,
    generate_guest_id,
    generate_oauth_state,
    sign_guest_id,
    verify_guest_id,
    verify_jwt,
)
from app.dependencies import get_current_user_or_guest
from app.infra.db import get_db_pool
from app.infra.redis_client import get_redis

router = APIRouter(prefix="/auth", tags=["Authentication"])


def _set_cookie(response: Response, name: str, value: str, max_age: int = 604800) -> None:
    response.set_cookie(
        key=name,
        value=value,
        httponly=True,
        secure=settings.cookie_secure,
        samesite=settings.cookie_samesite.lower(),
        max_age=max_age,
        domain=settings.cookie_domain,
    )


def _clear_cookie(response: Response, name: str) -> None:
    response.set_cookie(
        key=name,
        value="",
        httponly=True,
        secure=settings.cookie_secure,
        samesite=settings.cookie_samesite.lower(),
        max_age=0,
        domain=settings.cookie_domain,
    )


@router.get("/guest")
async def create_guest(request: Request, response: Response) -> dict[str, str]:
    """Generate a new signed guest identity."""
    ip = request.client.host if request.client else "unknown"
    user_agent = request.headers.get("user-agent", "")
    guest_id = generate_guest_id(ip, user_agent)
    signature = sign_guest_id(guest_id)

    _set_cookie(response, "guest_id", guest_id, max_age=86400)
    _set_cookie(response, "guest_sig", signature, max_age=86400)

    return {"guest_id": guest_id, "signature": signature}


@router.get("/github/initiate")
async def github_initiate(response: Response) -> RedirectResponse:
    """Redirect to GitHub OAuth authorization page."""
    if not settings.github_client_id or not settings.github_client_secret:
        raise AuthException("GitHub OAuth is not configured")

    state = generate_oauth_state()
    redis_client = await get_redis()
    await redis_client.setex(f"oauth_state:{state}", 600, "1")

    github_url = (
        "https://github.com/login/oauth/authorize"
        f"?client_id={settings.github_client_id}"
        f"&redirect_uri={settings.github_redirect_uri}"
        f"&scope=user:email"
        f"&state={state}"
    )
    return RedirectResponse(url=github_url)


@router.get("/github/callback")
async def github_callback(code: str, state: str, response: Response) -> JSONResponse:
    """Handle GitHub OAuth callback and issue JWT session."""
    if not settings.github_client_id or not settings.github_client_secret:
        raise AuthException("GitHub OAuth is not configured")

    # Validate state
    redis_client = await get_redis()
    state_key = f"oauth_state:{state}"
    state_valid = await redis_client.get(state_key)
    if not state_valid:
        raise ValidationError("Invalid or expired OAuth state")
    await redis_client.delete(state_key)

    # Exchange code for access token
    token_response = await httpx.AsyncClient().post(
        "https://github.com/login/oauth/access_token",
        headers={"Accept": "application/json"},
        data={
            "client_id": settings.github_client_id,
            "client_secret": settings.github_client_secret,
            "code": code,
            "redirect_uri": settings.github_redirect_uri,
            "state": state,
        },
    )
    token_data = token_response.json()
    access_token = token_data.get("access_token")
    if not access_token:
        raise AuthException("Failed to exchange OAuth code for token")

    # Fetch user profile
    headers = {"Authorization": f"Bearer {access_token}", "Accept": "application/json"}
    user_response = await httpx.AsyncClient().get("https://api.github.com/user", headers=headers)
    user_data = user_response.json()

    emails_response = await httpx.AsyncClient().get("https://api.github.com/user/emails", headers=headers)
    emails_data = emails_response.json()
    primary_email = next((e["email"] for e in emails_data if e.get("primary")), None)

    github_id = user_data.get("id")
    login = user_data.get("login")
    avatar_url = user_data.get("avatar_url")

    # Upsert user in database
    pool = await get_db_pool()
    async with pool.acquire() as conn:
        row = await conn.fetchrow("SELECT id, role FROM users WHERE github_id = $1", github_id)
        if row:
            user_id = row["id"]
            role = row["role"]
            await conn.execute(
                "UPDATE users SET last_login_at = NOW(), avatar_url = $1, email = $2 WHERE id = $3",
                avatar_url,
                primary_email,
                user_id,
            )
        else:
            user_id = await conn.fetchval(
                "INSERT INTO users (github_id, login, avatar_url, email, role) VALUES ($1, $2, $3, $4, $5) RETURNING id",
                github_id,
                login,
                avatar_url,
                primary_email,
                "developer",
            )
            role = "developer"

    # Create JWT
    payload = {
        "sub": user_id,
        "github_id": github_id,
        "login": login,
        "avatar_url": avatar_url,
        "role": role,
    }
    jwt_token = create_jwt(payload)

    _set_cookie(response, "access_token", jwt_token)
    _clear_cookie(response, "guest_id")
    _clear_cookie(response, "guest_sig")

    return JSONResponse({
        "status": "authenticated",
        "token": jwt_token,
        "user": {
            "id": user_id,
            "github_id": github_id,
            "login": login,
            "avatar_url": avatar_url,
            "role": role,
        },
    })


@router.get("/me")
async def get_me(request: Request) -> dict[str, Any]:
    """Return current authentication state and quota info."""
    user = await get_current_user_or_guest(request)

    if user["type"] == "user":
        return {
            "authenticated": True,
            "user": {
                "id": user["id"],
                "login": user.get("login"),
                "avatar_url": user.get("avatar_url"),
                "role": user["role"],
            },
            "tier": user["role"],
        }

    if user["type"] == "guest":
        return {
            "authenticated": False,
            "guest_id": user["guest_id"],
            "tier": "guest",
        }

    return {
        "authenticated": False,
        "guest_id": None,
        "tier": "guest",
    }


@router.post("/logout")
async def logout(request: Request, response: Response) -> dict[str, str]:
    """Terminate session and denylist JWT."""
    user = await get_current_user_or_guest(request)

    if user["type"] == "user" and user.get("jti"):
        try:
            redis_client = await get_redis()
            # Denylist JWT for remaining lifetime (up to 7 days)
            await redis_client.setex(f"jwt_denylist:{user['jti']}", 604800, "1")
        except Exception:
            pass

    _clear_cookie(response, "access_token")
    _clear_cookie(response, "guest_id")
    _clear_cookie(response, "guest_sig")

    return {"status": "logged_out"}

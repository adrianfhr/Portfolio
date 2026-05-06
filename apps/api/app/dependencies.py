from typing import Any

from fastapi import Request

from app.core.config import settings
from app.core.exceptions import AuthException, PermissionDenied
from app.core.security import verify_guest_id, verify_jwt


def _get_cookie_value(request: Request, name: str) -> str | None:
    return request.cookies.get(name)


def _get_bearer_token(request: Request) -> str | None:
    auth = request.headers.get("Authorization", "")
    if auth.startswith("Bearer "):
        return auth[7:]
    return None


async def get_current_user_or_guest(request: Request) -> dict[str, Any]:
    """Extract and validate either a JWT session or a signed guest identity."""
    # Try JWT first
    token = _get_cookie_value(request, "access_token") or _get_bearer_token(request)
    if token:
        try:
            payload = verify_jwt(token)
            return {
                "type": "user",
                "id": payload.get("sub"),
                "github_id": payload.get("github_id"),
                "role": payload.get("role", "developer"),
                "login": payload.get("login"),
                "avatar_url": payload.get("avatar_url"),
                "token": token,
                "jti": payload.get("jti"),
            }
        except AuthException:
            pass

    # Fall back to guest identity
    guest_id = _get_cookie_value(request, "guest_id")
    guest_sig = _get_cookie_value(request, "guest_sig")

    if guest_id and guest_sig:
        if verify_guest_id(guest_id, guest_sig):
            return {
                "type": "guest",
                "guest_id": guest_id,
                "role": "guest",
            }

    # No valid identity — return anonymous context
    return {
        "type": "anonymous",
        "role": "guest",
    }


def require_role(roles: list[str]):
    async def checker(request: Request) -> dict[str, Any]:
        user = await get_current_user_or_guest(request)
        if user["role"] not in roles:
            raise PermissionDenied(f"Requires one of roles: {roles}")
        return user
    return checker

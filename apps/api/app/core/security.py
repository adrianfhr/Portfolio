import base64
import hashlib
import hmac
import secrets
import time
from typing import Any

import jwt

from app.core.config import settings


def generate_guest_id(ip: str, user_agent: str) -> str:
    """Generate a deterministic guest ID from IP + UA, then sign it."""
    raw = f"{ip}|{user_agent}"
    digest = hashlib.sha256(raw.encode()).hexdigest()[:32]
    return digest


def sign_guest_id(guest_id: str) -> str:
    """HMAC-SHA256 sign a guest ID using the JWT secret."""
    secret = settings.jwt_secret.encode()
    return hmac.new(secret, guest_id.encode(), hashlib.sha256).hexdigest()


def verify_guest_id(guest_id: str, signature: str) -> bool:
    """Verify a guest ID signature."""
    expected = sign_guest_id(guest_id)
    return hmac.compare_digest(expected, signature)


def create_jwt(payload: dict[str, Any]) -> str:
    """Create a JWT with HS256."""
    to_encode = payload.copy()
    now = int(time.time())
    to_encode.setdefault("iat", now)
    to_encode.setdefault("exp", now + 604800)  # 7 days
    to_encode.setdefault("jti", secrets.token_urlsafe(16))
    # Ensure sub is string for JWT compliance
    if "sub" in to_encode and not isinstance(to_encode["sub"], str):
        to_encode["sub"] = str(to_encode["sub"])
    return jwt.encode(to_encode, settings.jwt_secret, algorithm="HS256")


def verify_jwt(token: str) -> dict[str, Any]:
    """Verify and decode a JWT."""
    try:
        return jwt.decode(token, settings.jwt_secret, algorithms=["HS256"])
    except jwt.ExpiredSignatureError as exc:
        from app.core.exceptions import TokenExpired

        raise TokenExpired() from exc
    except jwt.InvalidTokenError as exc:
        from app.core.exceptions import AuthException

        raise AuthException("Invalid token") from exc


def generate_oauth_state() -> str:
    """Generate a cryptographically random OAuth state parameter."""
    return base64.urlsafe_b64encode(secrets.token_bytes(32)).rstrip(b"=").decode("ascii")

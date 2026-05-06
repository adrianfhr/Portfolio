from typing import Any


class AppException(Exception):
    def __init__(
        self,
        code: str,
        message: str,
        status_code: int = 500,
        details: dict[str, Any] | None = None,
    ) -> None:
        self.code = code
        self.message = message
        self.status_code = status_code
        self.details = details or {}
        super().__init__(message)


class ValidationError(AppException):
    def __init__(self, message: str = "Validation failed", details: dict[str, Any] | None = None) -> None:
        super().__init__("VALIDATION_ERROR", message, 400, details)


class AuthException(AppException):
    def __init__(self, message: str = "Authentication failed", code: str = "AUTH_ERROR") -> None:
        super().__init__(code, message, 401)


class TokenExpired(AuthException):
    def __init__(self, message: str = "Token has expired") -> None:
        super().__init__(message, "TOKEN_EXPIRED")
        self.status_code = 401


class PermissionDenied(AuthException):
    def __init__(self, message: str = "Permission denied") -> None:
        super().__init__(message, "PERMISSION_DENIED")
        self.status_code = 403


class RateLimitExceeded(AppException):
    def __init__(self, message: str = "Rate limit exceeded", retry_after: int = 3600) -> None:
        super().__init__("RATE_LIMIT_EXCEEDED", message, 429, {"retry_after": retry_after})
        self.retry_after = retry_after


class NotFoundException(AppException):
    def __init__(self, message: str = "Resource not found") -> None:
        super().__init__("NOT_FOUND", message, 404)


class ConflictException(AppException):
    def __init__(self, message: str = "Conflict") -> None:
        super().__init__("CONFLICT", message, 409)

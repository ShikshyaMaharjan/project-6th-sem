"""
Login tokens and permission checks.

How it works
- /auth/login and /auth/register return a signed token.
- The frontend (src/config.js) sends it on every API call as
  "Authorization: Bearer <token>".
- Routes use the dependencies below to find out WHO is calling and
  WHAT role they have, instead of trusting user_id values sent by the browser.

Set a long random SECRET_KEY environment variable in real use, e.g.
    SECRET_KEY=<random text>
The default below is only for local development.
"""

import base64
import hashlib
import hmac
import json
import os
import time

from fastapi import Depends, Header, HTTPException
from sqlalchemy.orm import Session

from database import SessionLocal
from models.user import User


SECRET_KEY = os.getenv("SECRET_KEY", "dev-only-change-this-secret")
TOKEN_LIFETIME_SECONDS = 12 * 60 * 60  # 12 hours


# ---------------------------------------------------------
# TOKEN CREATE / READ (HMAC-SHA256 signed, no extra packages)
# ---------------------------------------------------------

def _b64(data: bytes) -> str:
    return base64.urlsafe_b64encode(data).decode().rstrip("=")


def _unb64(text: str) -> bytes:
    return base64.urlsafe_b64decode(text + "=" * (-len(text) % 4))


def _sign(body: str) -> str:
    return _b64(
        hmac.new(
            SECRET_KEY.encode(),
            body.encode(),
            hashlib.sha256
        ).digest()
    )


def create_token(user: User) -> str:
    payload = {
        "sub": user.id,
        "exp": int(time.time()) + TOKEN_LIFETIME_SECONDS
    }

    body = _b64(json.dumps(payload).encode())

    return f"{body}.{_sign(body)}"


def read_token(token: str) -> int | None:
    """Returns the user id inside a valid, unexpired token, else None."""
    try:
        body, signature = token.split(".")

        if not hmac.compare_digest(signature, _sign(body)):
            return None

        payload = json.loads(_unb64(body))

        if payload["exp"] < time.time():
            return None

        return int(payload["sub"])
    except Exception:
        return None


# ---------------------------------------------------------
# DEPENDENCIES
# ---------------------------------------------------------

def _get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


def get_optional_user(
    authorization: str | None = Header(default=None),
    db: Session = Depends(_get_db)
) -> User | None:
    """The logged-in user, or None for visitors."""
    if not authorization or not authorization.startswith("Bearer "):
        return None

    user_id = read_token(authorization[7:])

    if user_id is None:
        return None

    return db.query(User).filter(User.id == user_id).first()


def get_current_user(
    user: User | None = Depends(get_optional_user)
) -> User:
    if not user:
        raise HTTPException(
            status_code=401,
            detail="Please log in to continue."
        )

    return user


def require_admin(
    user: User = Depends(get_current_user)
) -> User:
    if user.role != "admin":
        raise HTTPException(
            status_code=403,
            detail="Administrator access required."
        )

    return user


def require_organization_or_admin(
    user: User = Depends(get_current_user)
) -> User:
    if user.role not in ("organization", "admin"):
        raise HTTPException(
            status_code=403,
            detail="Only organizations can do this."
        )

    return user


def ensure_self_or_admin(user: User, user_id: int) -> None:
    """Allows the action only for the same user or an admin."""
    if user.id != user_id and user.role != "admin":
        raise HTTPException(
            status_code=403,
            detail="You can only access your own data."
        )

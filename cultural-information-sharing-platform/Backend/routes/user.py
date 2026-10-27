from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import SessionLocal
from auth_utils import require_admin
from models.user import User
from schemas.user import UserResponse


# =========================================================
# ROUTER
# =========================================================

router = APIRouter(
    prefix="/users",
    tags=["Users"]
)


# =========================================================
# DATABASE DEPENDENCY
# =========================================================

def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


# =========================================================
# GET NORMAL USERS
# =========================================================

@router.get("/", response_model=list[UserResponse])
def get_users(
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin)
):

    users = (
        db.query(User)
        .filter(User.role == "user")
        .order_by(User.id.asc())
        .all()
    )

    return users
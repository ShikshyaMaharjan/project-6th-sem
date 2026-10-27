from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import SessionLocal
from auth_utils import require_admin
from models.user import User
from schemas.organization import OrganizationResponse


router = APIRouter(
    prefix="/organizations",
    tags=["Organizations"]
)


def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


@router.get("/", response_model=list[OrganizationResponse])
def get_organizations(
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin)
):
    organizations = (
        db.query(User)
        .filter(User.role == "organization")
        .order_by(User.id.desc())
        .all()
    )

    return organizations
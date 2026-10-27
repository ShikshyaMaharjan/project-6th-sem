import re
import uuid
from pathlib import Path

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from sqlalchemy.orm import Session

from database import SessionLocal
from auth_utils import (
    get_current_user,
    get_optional_user,
    require_admin,
    ensure_self_or_admin,
)
from models.contribution import Contribution
from models.cultural import CulturalContent
from models.notification import Notification
from models.user import User
from schemas.contribution import (
    ContributionCreate,
    ContributionResponse,
)


router = APIRouter(
    prefix="/contributions",
    tags=["Contributions"],
)


def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


# =========================================================
# IMAGE UPLOAD SETTINGS
# =========================================================

UPLOAD_DIR = (
    Path(__file__).resolve().parent.parent
    / "media"
    / "contributions"
)

ALLOWED_IMAGE_TYPES = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
}

MAX_UPLOAD_BYTES = 5 * 1024 * 1024


# =========================================================
# HELPERS
# =========================================================

def make_slug(text):
    slug = re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")
    return slug or "contribution"


def unique_slug(db, base):
    base = base[:140]
    slug = base
    number = 2

    while db.query(CulturalContent).filter(
        CulturalContent.slug == slug
    ).first():
        suffix = f"-{number}"
        slug = f"{base[:150 - len(suffix)]}{suffix}"
        number += 1

    return slug


def remove_published_content(db, contribution_id):
    """
    Remove only records published from this contribution.

    Approval generates slugs such as:
    contribution-12-pihru

    Independently added cultural records are not matched.
    """
    slug_prefix = f"contribution-{contribution_id}-"

    published_items = db.query(CulturalContent).filter(
        CulturalContent.slug.like(f"{slug_prefix}%")
    ).all()

    for item in published_items:
        db.delete(item)


# =========================================================
# UPLOAD A CONTRIBUTION IMAGE
# =========================================================

@router.post("/upload")
async def upload_contribution_image(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
):
    extension = ALLOWED_IMAGE_TYPES.get(file.content_type)

    if not extension:
        raise HTTPException(
            status_code=400,
            detail="Only JPG, PNG or WEBP images are allowed.",
        )

    content = await file.read(MAX_UPLOAD_BYTES + 1)

    if len(content) > MAX_UPLOAD_BYTES:
        raise HTTPException(
            status_code=400,
            detail="The image is too large. Maximum size is 5 MB.",
        )

    if not content:
        raise HTTPException(
            status_code=400,
            detail="The uploaded file is empty.",
        )

    UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

    file_name = f"{uuid.uuid4().hex}{extension}"
    (UPLOAD_DIR / file_name).write_bytes(content)

    return {"url": f"/media/contributions/{file_name}"}


# =========================================================
# GET ALL CONTRIBUTIONS
# =========================================================

@router.get("/", response_model=list[ContributionResponse])
def get_contributions(
    status: str | None = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_optional_user),
):
    query = db.query(Contribution)

    if not current_user or current_user.role != "admin":
        query = query.filter(Contribution.status == "approved")
    elif status:
        query = query.filter(Contribution.status == status)

    return query.all()


# =========================================================
# GET CONTRIBUTIONS BY USER
# =========================================================

@router.get(
    "/user/{user_id}",
    response_model=list[ContributionResponse],
)
def get_user_contributions(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    ensure_self_or_admin(current_user, user_id)

    return db.query(Contribution).filter(
        Contribution.user_id == user_id
    ).all()


# =========================================================
# CREATE CONTRIBUTION
# =========================================================

@router.post("/", response_model=ContributionResponse)
def create_contribution(
    contribution: ContributionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    ensure_self_or_admin(current_user, contribution.user_id)

    user = db.query(User).filter(
        User.id == contribution.user_id
    ).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found.",
        )

    new_contribution = Contribution(
        user_id=contribution.user_id,
        title=contribution.title,
        category=contribution.category,
        community=contribution.community,
        location=contribution.location,
        description=contribution.description,
        significance=contribution.significance,
        image=contribution.image,
        status="pending",
    )

    try:
        db.add(new_contribution)
        db.commit()
    except Exception:
        db.rollback()
        raise

    db.refresh(new_contribution)
    return new_contribution


# =========================================================
# APPROVE CONTRIBUTION
# =========================================================

@router.put(
    "/{contribution_id}/approve",
    response_model=ContributionResponse,
)
def approve_contribution(
    contribution_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    contribution = db.query(Contribution).filter(
        Contribution.id == contribution_id
    ).with_for_update().first()

    if not contribution:
        raise HTTPException(
            status_code=404,
            detail="Contribution not found.",
        )

    was_approved = contribution.status == "approved"
    slug_prefix = f"contribution-{contribution.id}-"

    try:
        already_published = db.query(CulturalContent).filter(
            CulturalContent.slug.like(f"{slug_prefix}%")
        ).first()

        if not already_published:
            db.add(
                CulturalContent(
                    title=contribution.title,
                    slug=unique_slug(
                        db,
                        f"{slug_prefix}{make_slug(contribution.title)}",
                    ),
                    category=contribution.category,
                    community=contribution.community,
                    location=contribution.location,
                    description=contribution.description,
                    significance=contribution.significance,
                    image=contribution.image,
                )
            )

        contribution.status = "approved"

        if not was_approved:
            db.add(
                Notification(
                    user_id=contribution.user_id,
                    title="Contribution Approved",
                    message=(
                        f'Your contribution "{contribution.title}" '
                        "was approved and is now visible in Explore."
                    ),
                )
            )

        db.commit()
    except Exception:
        db.rollback()
        raise

    db.refresh(contribution)
    return contribution


# =========================================================
# REJECT CONTRIBUTION
# =========================================================

@router.put(
    "/{contribution_id}/reject",
    response_model=ContributionResponse,
)
def reject_contribution(
    contribution_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    contribution = db.query(Contribution).filter(
        Contribution.id == contribution_id
    ).with_for_update().first()

    if not contribution:
        raise HTTPException(
            status_code=404,
            detail="Contribution not found.",
        )

    was_rejected = contribution.status == "rejected"

    try:
        remove_published_content(db, contribution.id)
        contribution.status = "rejected"

        if not was_rejected:
            db.add(
                Notification(
                    user_id=contribution.user_id,
                    title="Contribution Not Approved",
                    message=(
                        f'Your contribution "{contribution.title}" '
                        "was not approved by the administrator."
                    ),
                )
            )

        db.commit()
    except Exception:
        db.rollback()
        raise

    db.refresh(contribution)
    return contribution


# =========================================================
# DELETE CONTRIBUTION AND ITS PUBLISHED CONTENT
# =========================================================

@router.delete("/{contribution_id}")
def delete_contribution(
    contribution_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    contribution = db.query(Contribution).filter(
        Contribution.id == contribution_id
    ).with_for_update().first()

    if not contribution:
        raise HTTPException(
            status_code=404,
            detail="Contribution not found.",
        )

    try:
        remove_published_content(db, contribution.id)
        db.delete(contribution)
        db.commit()
    except Exception:
        db.rollback()
        raise

    return {
        "message": (
            "Contribution and its published content "
            "deleted successfully."
        )
    }
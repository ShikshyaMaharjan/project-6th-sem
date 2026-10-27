from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func
from sqlalchemy.orm import Session

from database import SessionLocal
from auth_utils import get_current_user, require_admin, ensure_self_or_admin
from models.cultural import CulturalContent
from models.favorite import Favorite
from models.user import User
from schemas.cultural import CulturalResponse
from schemas.favorite import FavoriteCreate


router = APIRouter(
    prefix="/favorites",
    tags=["Favorites"]
)


def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


# =========================================================
# ADMIN - MOST SAVED CULTURAL ITEMS
# =========================================================

@router.get("/stats")
def get_favorite_stats(
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin)
):
    rows = (
        db.query(
            CulturalContent.id,
            CulturalContent.title,
            CulturalContent.category,
            func.count(Favorite.id).label("saves")
        )
        .join(Favorite, Favorite.cultural_id == CulturalContent.id)
        .group_by(
            CulturalContent.id,
            CulturalContent.title,
            CulturalContent.category
        )
        .order_by(func.count(Favorite.id).desc())
        .all()
    )

    return [
        {
            "cultural_id": row.id,
            "title": row.title,
            "category": row.category,
            "saves": row.saves
        }
        for row in rows
    ]


# =========================================================
# GET A USER'S FAVORITE ITEMS (full cultural items)
# =========================================================

@router.get(
    "/user/{user_id}",
    response_model=list[CulturalResponse]
)
def get_user_favorites(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    ensure_self_or_admin(current_user, user_id)

    return (
        db.query(CulturalContent)
        .join(Favorite, Favorite.cultural_id == CulturalContent.id)
        .filter(Favorite.user_id == user_id)
        .order_by(Favorite.id.desc())
        .all()
    )


# =========================================================
# ADD FAVORITE (safe to call twice)
# =========================================================

@router.post("/")
def add_favorite(
    favorite: FavoriteCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    ensure_self_or_admin(current_user, favorite.user_id)

    user = db.query(User).filter(
        User.id == favorite.user_id
    ).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found."
        )

    item = db.query(CulturalContent).filter(
        CulturalContent.id == favorite.cultural_id
    ).first()

    if not item:
        raise HTTPException(
            status_code=404,
            detail="Cultural content not found."
        )

    existing = db.query(Favorite).filter(
        Favorite.user_id == favorite.user_id,
        Favorite.cultural_id == favorite.cultural_id
    ).first()

    if not existing:
        db.add(
            Favorite(
                user_id=favorite.user_id,
                cultural_id=favorite.cultural_id
            )
        )
        db.commit()

    return {"message": "Added to favorites."}


# =========================================================
# REMOVE FAVORITE
# =========================================================

@router.delete("/{user_id}/{cultural_id}")
def remove_favorite(
    user_id: int,
    cultural_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    ensure_self_or_admin(current_user, user_id)

    existing = db.query(Favorite).filter(
        Favorite.user_id == user_id,
        Favorite.cultural_id == cultural_id
    ).first()

    if existing:
        db.delete(existing)
        db.commit()

    return {"message": "Removed from favorites."}

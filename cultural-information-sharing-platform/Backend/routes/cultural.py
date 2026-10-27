from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import or_
from sqlalchemy.orm import Session

from database import SessionLocal
from models.user import User
from auth_utils import require_admin
from models.cultural import CulturalContent
from schemas.cultural import CulturalCreate, CulturalResponse


router = APIRouter(
    prefix="/cultural",
    tags=["Cultural Content"]
)


def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


# =========================================================
# GET ALL CULTURAL CONTENT
# Optional filters (all optional, so the Admin panel, which
# calls this with no parameters, keeps working unchanged):
#   ?category=Festivals
#   ?community=Tharu
#   ?q=search words
#   ?limit=20&offset=0
# =========================================================

@router.get("/", response_model=list[CulturalResponse])
def get_cultural_content(
    category: str | None = None,
    community: str | None = None,
    q: str | None = None,
    limit: int | None = Query(None, ge=1, le=500),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db)
):
    query = db.query(CulturalContent)

    if category:
        query = query.filter(CulturalContent.category == category)

    if community:
        query = query.filter(CulturalContent.community == community)

    if q and q.strip():
        pattern = f"%{q.strip()}%"

        query = query.filter(
            or_(
                CulturalContent.title.ilike(pattern),
                CulturalContent.category.ilike(pattern),
                CulturalContent.community.ilike(pattern),
                CulturalContent.location.ilike(pattern),
                CulturalContent.description.ilike(pattern)
            )
        )

    query = query.order_by(CulturalContent.id.asc()).offset(offset)

    if limit:
        query = query.limit(limit)

    return query.all()


# =========================================================
# DISTINCT CATEGORIES AND COMMUNITIES (for filter menus)
# =========================================================

@router.get("/meta/filters")
def get_cultural_filters(
    db: Session = Depends(get_db)
):
    categories = [
        row[0] for row in
        db.query(CulturalContent.category)
        .distinct()
        .order_by(CulturalContent.category)
        .all()
    ]

    communities = [
        row[0] for row in
        db.query(CulturalContent.community)
        .distinct()
        .order_by(CulturalContent.community)
        .all()
    ]

    return {
        "categories": categories,
        "communities": communities
    }


@router.get("/{slug}", response_model=CulturalResponse)
def get_cultural_item(
    slug: str,
    db: Session = Depends(get_db)
):
    cultural_item = db.query(CulturalContent).filter(
        CulturalContent.slug == slug
    ).first()

    if not cultural_item:
        raise HTTPException(
            status_code=404,
            detail="Cultural content not found."
        )

    return cultural_item


@router.post("/", response_model=CulturalResponse)
def create_cultural_content(
    cultural: CulturalCreate,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin)
):
    existing_item = db.query(CulturalContent).filter(
        CulturalContent.slug == cultural.slug
    ).first()

    if existing_item:
        raise HTTPException(
            status_code=400,
            detail="Cultural content with this slug already exists."
        )

    new_item = CulturalContent(
    title=cultural.title,
    slug=cultural.slug,
    category=cultural.category,
    community=cultural.community,
    location=cultural.location,
    description=cultural.description,
    significance=cultural.significance,
    image=cultural.image,
    is_rentable=cultural.is_rentable
)

    db.add(new_item)
    db.commit()
    db.refresh(new_item)

    return new_item

@router.put("/{cultural_id}", response_model=CulturalResponse)
def update_cultural_content(
    cultural_id: int,
    cultural: CulturalCreate,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin)
):
    cultural_item = db.query(CulturalContent).filter(
        CulturalContent.id == cultural_id
    ).first()

    if not cultural_item:
        raise HTTPException(
            status_code=404,
            detail="Cultural content not found."
        )

    # Check if another item already uses the same slug
    existing_item = db.query(CulturalContent).filter(
        CulturalContent.slug == cultural.slug,
        CulturalContent.id != cultural_id
    ).first()

    if existing_item:
        raise HTTPException(
            status_code=400,
            detail="Cultural content with this slug already exists."
        )

    # Update the existing information
    cultural_item.title = cultural.title
    cultural_item.slug = cultural.slug
    cultural_item.category = cultural.category
    cultural_item.community = cultural.community
    cultural_item.location = cultural.location
    cultural_item.description = cultural.description
    cultural_item.significance = cultural.significance
    cultural_item.image = cultural.image
    cultural_item.is_rentable = cultural.is_rentable

    db.commit()
    db.refresh(cultural_item)

    return cultural_item

@router.delete("/{cultural_id}")
def delete_cultural_content(
    cultural_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin)
):
    cultural_item = db.query(CulturalContent).filter(
        CulturalContent.id == cultural_id
    ).first()

    if not cultural_item:
        raise HTTPException(
            status_code=404,
            detail="Cultural content not found."
        )

    db.delete(cultural_item)
    db.commit()

    return {
        "message": "Cultural content deleted successfully."
    }
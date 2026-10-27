from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import SessionLocal
from auth_utils import get_current_user, ensure_self_or_admin
from models.cultural import CulturalContent
from models.review import Review
from models.user import User
from schemas.review import ReviewCreate, ReviewResponse


router = APIRouter(
    prefix="/reviews",
    tags=["Reviews"]
)


def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


def to_response(review, user_name):
    return ReviewResponse(
        id=review.id,
        user_id=review.user_id,
        user_name=user_name,
        cultural_id=review.cultural_id,
        rating=review.rating,
        comment=review.comment,
        created_at=review.created_at
    )


# =========================================================
# GET REVIEWS FOR ONE CULTURAL ITEM
# =========================================================

@router.get(
    "/cultural/{cultural_id}",
    response_model=list[ReviewResponse]
)
def get_reviews(
    cultural_id: int,
    db: Session = Depends(get_db)
):
    rows = (
        db.query(Review, User.name)
        .join(User, User.id == Review.user_id)
        .filter(Review.cultural_id == cultural_id)
        .order_by(Review.id.desc())
        .all()
    )

    return [to_response(review, name) for review, name in rows]


# =========================================================
# ADD OR UPDATE MY REVIEW (one review per user per item)
# =========================================================

@router.post("/", response_model=ReviewResponse)
def save_review(
    data: ReviewCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    ensure_self_or_admin(current_user, data.user_id)

    user = db.query(User).filter(
        User.id == data.user_id
    ).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found."
        )

    item = db.query(CulturalContent).filter(
        CulturalContent.id == data.cultural_id
    ).first()

    if not item:
        raise HTTPException(
            status_code=404,
            detail="Cultural content not found."
        )

    comment = (data.comment or "").strip() or None

    review = db.query(Review).filter(
        Review.user_id == data.user_id,
        Review.cultural_id == data.cultural_id
    ).first()

    if review:
        review.rating = data.rating
        review.comment = comment
    else:
        review = Review(
            user_id=data.user_id,
            cultural_id=data.cultural_id,
            rating=data.rating,
            comment=comment
        )
        db.add(review)

    db.commit()
    db.refresh(review)

    return to_response(review, user.name)


# =========================================================
# DELETE A REVIEW (its author or an admin)
# =========================================================

@router.delete("/{review_id}")
def delete_review(
    review_id: int,
    db: Session = Depends(get_db),
    requester: User = Depends(get_current_user),
    user_id: int | None = None  # kept so older calls with ?user_id= still work; ignored
):
    review = db.query(Review).filter(
        Review.id == review_id
    ).first()

    if not review:
        raise HTTPException(
            status_code=404,
            detail="Review not found."
        )

    if review.user_id != requester.id and requester.role != "admin":
        raise HTTPException(
            status_code=403,
            detail="You can only delete your own review."
        )

    db.delete(review)
    db.commit()

    return {"message": "Review deleted."}

from datetime import date

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import SessionLocal
from auth_utils import get_current_user, require_admin, ensure_self_or_admin
from models.cultural import CulturalContent
from models.notification import Notification
from models.rental import Rental
from models.user import User
from schemas.rental import RentalCreate, RentalResponse, RentalApproval


router = APIRouter(
    prefix="/rentals",
    tags=["Attire Rentals"]
)


# Both attire and jewelry can be rented
RENTABLE_CATEGORIES = {
    "Traditional Attire",
    "Jewelry"
}


def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


def to_response(rental, user_name, title):
    return RentalResponse(
        id=rental.id,
        user_id=rental.user_id,
        user_name=user_name,
        cultural_id=rental.cultural_id,
        cultural_title=title,
        start_date=rental.start_date,
        end_date=rental.end_date,
        phone=rental.phone,
        note=rental.note,
        status=rental.status,

        # Pickup information
        pickup_location=rental.pickup_location,
        pickup_instructions=rental.pickup_instructions,

        created_at=rental.created_at
    )


def query_rentals(db):
    return (
        db.query(Rental, User.name, CulturalContent.title)
        .join(User, User.id == Rental.user_id)
        .join(
            CulturalContent,
            CulturalContent.id == Rental.cultural_id
        )
    )


# =========================================================
# ADMIN - ALL RENTAL REQUESTS
# =========================================================

@router.get("/", response_model=list[RentalResponse])
def get_all_rentals(
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin)
):
    rows = query_rentals(db).order_by(Rental.id.desc()).all()

    return [to_response(r, n, t) for r, n, t in rows]


# =========================================================
# USER - MY RENTAL REQUESTS
# =========================================================

@router.get("/user/{user_id}", response_model=list[RentalResponse])
def get_user_rentals(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    ensure_self_or_admin(current_user, user_id)

    rows = (
        query_rentals(db)
        .filter(Rental.user_id == user_id)
        .order_by(Rental.id.desc())
        .all()
    )

    return [to_response(r, n, t) for r, n, t in rows]


# =========================================================
# USER - REQUEST A RENTAL
# =========================================================

@router.post("/", response_model=RentalResponse)
def create_rental(
    data: RentalCreate,
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

    # Only attire and jewelry are allowed
    if item.category not in RENTABLE_CATEGORIES:
        raise HTTPException(
            status_code=400,
            detail="Only Traditional Attire and Jewelry items can be rented."
        )

    # Item must also be enabled for rental by admin
    if not item.is_rentable:
        raise HTTPException(
            status_code=400,
            detail="This item is currently not available for rental."
        )

    try:
        start = date.fromisoformat(data.start_date)
        end = date.fromisoformat(data.end_date)

    except ValueError:
        raise HTTPException(
            status_code=400,
            detail="Dates must be in YYYY-MM-DD format."
        )

    if start < date.today():
        raise HTTPException(
            status_code=400,
            detail="The start date cannot be in the past."
        )

    if end < start:
        raise HTTPException(
            status_code=400,
            detail="The end date must be on or after the start date."
        )

    phone = data.phone.strip()

    if not phone:
        raise HTTPException(
            status_code=400,
            detail="Please enter a contact phone number."
        )

    rental = Rental(
        user_id=data.user_id,
        cultural_id=data.cultural_id,
        start_date=data.start_date,
        end_date=data.end_date,
        phone=phone,
        note=(data.note or "").strip() or None,
        status="pending"
    )

    db.add(rental)
    db.commit()
    db.refresh(rental)

    return to_response(
        rental,
        user.name,
        item.title
    )


# =========================================================
# ADMIN - RENTAL STATUS
# =========================================================

STATUS_MESSAGES = {
    "rejected": "was not approved.",
    "returned": "has been marked as returned. Thank you!"
}


def get_rental_row(rental_id, db):
    row = (
        query_rentals(db)
        .filter(Rental.id == rental_id)
        .first()
    )

    if not row:
        raise HTTPException(
            status_code=404,
            detail="Rental request not found."
        )

    return row


# =========================================================
# ADMIN - APPROVE RENTAL
# =========================================================

@router.put(
    "/{rental_id}/approve",
    response_model=RentalResponse
)
def approve_rental(
    rental_id: int,
    data: RentalApproval,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin)
):
    rental, user_name, title = get_rental_row(
        rental_id,
        db
    )

    pickup_location = data.pickup_location.strip()

    if not pickup_location:
        raise HTTPException(
            status_code=400,
            detail="Pickup location is required."
        )

    rental.status = "approved"
    rental.pickup_location = pickup_location
    rental.pickup_instructions = (
        (data.pickup_instructions or "").strip() or None
    )

    db.add(
        Notification(
            user_id=rental.user_id,
            title="Rental Approved",
            message=(
                f'Your rental request for "{title}" was approved. '
                f'Pickup location: {pickup_location}'
            )
        )
    )

    db.commit()
    db.refresh(rental)

    return to_response(
        rental,
        user_name,
        title
    )


# =========================================================
# ADMIN - REJECT / RETURN
# =========================================================

def change_status(rental_id, new_status, db):
    rental, user_name, title = get_rental_row(
        rental_id,
        db
    )

    rental.status = new_status

    db.add(
        Notification(
            user_id=rental.user_id,
            title=f"Rental {new_status.capitalize()}",
            message=(
                f'Your rental request for "{title}" '
                f"{STATUS_MESSAGES[new_status]}"
            )
        )
    )

    db.commit()
    db.refresh(rental)

    return to_response(
        rental,
        user_name,
        title
    )


@router.put(
    "/{rental_id}/reject",
    response_model=RentalResponse
)
def reject_rental(
    rental_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin)
):
    return change_status(
        rental_id,
        "rejected",
        db
    )


@router.put(
    "/{rental_id}/returned",
    response_model=RentalResponse
)
def return_rental(
    rental_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin)
):
    return change_status(
        rental_id,
        "returned",
        db
    )
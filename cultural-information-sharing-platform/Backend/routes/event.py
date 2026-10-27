from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import SessionLocal
from auth_utils import get_current_user, require_admin, require_organization_or_admin, ensure_self_or_admin
from models.event import Event
from models.user import User
from schemas.event import EventCreate, EventResponse
from models.notification import Notification

router = APIRouter(
    prefix="/events",
    tags=["Events"]
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# =========================================================
# PUBLIC - GET APPROVED EVENTS ONLY
# =========================================================

@router.get(
    "/",
    response_model=list[EventResponse]
)
def get_events(
    db: Session = Depends(get_db)
):
    return db.query(Event).filter(
        Event.status == "approved"
    ).all()


# =========================================================
# ADMIN - GET ALL EVENTS
# =========================================================

@router.get(
    "/admin/all",
    response_model=list[EventResponse]
)
def get_all_events_for_admin(
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin)
):
    return db.query(Event).order_by(
        Event.id.desc()
    ).all()


# =========================================================
# ORGANIZATION - GET OWN EVENTS
# =========================================================

@router.get(
    "/organization/{organization_id}",
    response_model=list[EventResponse]
)
def get_organization_events(
    organization_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    ensure_self_or_admin(current_user, organization_id)

    organization = db.query(User).filter(
        User.id == organization_id
    ).first()

    if not organization:
        raise HTTPException(
            status_code=404,
            detail="Organization not found."
        )

    if organization.role != "organization":
        raise HTTPException(
            status_code=403,
            detail="This account is not an organization."
        )

    return db.query(Event).filter(
        Event.organization_id == organization_id
    ).order_by(
        Event.id.desc()
    ).all()


# =========================================================
# GET ONE APPROVED EVENT BY SLUG
# =========================================================

@router.get(
    "/{slug}",
    response_model=EventResponse
)
def get_event(
    slug: str,
    db: Session = Depends(get_db)
):
    event = db.query(Event).filter(
        Event.slug == slug,
        Event.status == "approved"
    ).first()

    if not event:
        raise HTTPException(
            status_code=404,
            detail="Event not found."
        )

    return event


# =========================================================
# ORGANIZATION - CREATE EVENT
# =========================================================

@router.post(
    "/",
    response_model=EventResponse
)
def create_event(
    event: EventCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_organization_or_admin)
):
    ensure_self_or_admin(current_user, event.organization_id)

    organization = db.query(User).filter(
        User.id == event.organization_id
    ).first()

    if not organization:
        raise HTTPException(
            status_code=404,
            detail="Organization not found."
        )

    if organization.role != "organization":
        raise HTTPException(
            status_code=403,
            detail="Only organization accounts can create events."
        )

    existing_event = db.query(Event).filter(
        Event.slug == event.slug
    ).first()

    if existing_event:
        raise HTTPException(
            status_code=400,
            detail="Event with this slug already exists."
        )

    new_event = Event(
        organization_id=event.organization_id,
        slug=event.slug,
        title=event.title,
        type=event.type,
        date=event.date,
        time=event.time,
        location=event.location,
        description=event.description,
        about=event.about,
        image=event.image,

        # Organization events need admin approval
        status="pending"
    )

    db.add(new_event)
    db.commit()
    db.refresh(new_event)

    return new_event


# =========================================================
# ADMIN - CREATE OFFICIAL EVENT
# =========================================================

@router.post(
    "/admin",
    response_model=EventResponse
)
def create_admin_event(
    event: EventCreate,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin)
):
    existing_event = db.query(Event).filter(
        Event.slug == event.slug
    ).first()

    if existing_event:
        raise HTTPException(
            status_code=400,
            detail="Event with this slug already exists."
        )

    new_event = Event(
        organization_id=None,
        slug=event.slug,
        title=event.title,
        type=event.type,
        date=event.date,
        time=event.time,
        location=event.location,
        description=event.description,
        about=event.about,
        image=event.image,

        # Admin-created official events are automatically approved
        status="approved"
    )

    db.add(new_event)
    db.commit()
    db.refresh(new_event)

    return new_event


# =========================================================
# ADMIN - APPROVE EVENT
# =========================================================

@router.put(
    "/{event_id}/approve",
    response_model=EventResponse
)
def approve_event(
    event_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin)
):
    event = db.query(Event).filter(
        Event.id == event_id
    ).first()

    if not event:
        raise HTTPException(
            status_code=404,
            detail="Event not found."
        )

    event.status = "approved"

    db.commit()
    db.refresh(event)

    return event


# =========================================================
# ADMIN - REJECT EVENT
# =========================================================

@router.put("/{event_id}/reject", response_model=EventResponse)
def reject_event(
    event_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin)
):
    event = (
        db.query(Event)
        .filter(Event.id == event_id)
        .first()
    )

    if not event:
        raise HTTPException(
            status_code=404,
            detail="Event not found."
        )

    # Change event status to rejected
    event.status = "rejected"

    # Send notification to the organization that submitted the event
    if event.organization_id:
        notification = Notification(
            user_id=event.organization_id,
            title="Event Rejected",
            message=(
                f'Your event "{event.title}" '
                f'was rejected by the administrator.'
            )
        )

        db.add(notification)

    db.commit()
    db.refresh(event)

    return event


# =========================================================
# DELETE EVENT
# =========================================================

@router.delete(
    "/{event_id}"
)
def delete_event(
    event_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_organization_or_admin)
):
    event = db.query(Event).filter(
        Event.id == event_id
    ).first()

    if not event:
        raise HTTPException(
            status_code=404,
            detail="Event not found."
        )

    # An organization may delete only its own events; admins may delete any.
    if (
        current_user.role != "admin"
        and event.organization_id != current_user.id
    ):
        raise HTTPException(
            status_code=403,
            detail="You can only delete your own events."
        )

    db.delete(event)
    db.commit()

    return {
        "message": "Event deleted successfully."
    }
from datetime import datetime

from pydantic import BaseModel


class RentalCreate(BaseModel):
    user_id: int
    cultural_id: int
    start_date: str   # YYYY-MM-DD
    end_date: str     # YYYY-MM-DD
    phone: str
    note: str | None = None


# Used by admin when approving a rental request
class RentalApproval(BaseModel):
    pickup_location: str
    pickup_instructions: str | None = None


class RentalResponse(BaseModel):
    id: int
    user_id: int
    user_name: str | None = None

    cultural_id: int
    cultural_title: str | None = None

    start_date: str
    end_date: str

    phone: str
    note: str | None = None

    status: str

    # Pickup details provided by admin after approval
    pickup_location: str | None = None
    pickup_instructions: str | None = None

    created_at: datetime | None = None
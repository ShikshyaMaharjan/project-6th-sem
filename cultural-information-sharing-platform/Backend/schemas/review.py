from datetime import datetime

from pydantic import BaseModel, Field


class ReviewCreate(BaseModel):
    user_id: int
    cultural_id: int
    rating: int = Field(ge=1, le=5)
    comment: str | None = None


class ReviewResponse(BaseModel):
    id: int
    user_id: int
    user_name: str
    cultural_id: int
    rating: int
    comment: str | None = None
    created_at: datetime | None = None

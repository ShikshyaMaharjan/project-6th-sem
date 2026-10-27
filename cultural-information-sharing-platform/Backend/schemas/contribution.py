from pydantic import BaseModel


class ContributionCreate(BaseModel):
    user_id: int
    title: str
    category: str
    community: str
    location: str | None = None
    description: str
    significance: str | None = None
    image: str | None = None


class ContributionResponse(BaseModel):
    id: int
    user_id: int
    title: str
    category: str
    community: str
    location: str | None = None
    description: str
    significance: str | None = None
    image: str | None = None
    status: str
    admin_note: str | None = None

    class Config:
        from_attributes = True
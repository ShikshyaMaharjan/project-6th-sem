from pydantic import BaseModel


class CulturalCreate(BaseModel):
    title: str
    slug: str
    category: str
    community: str | None = None
    location: str | None = None
    description: str
    significance: str | None = None
    image: str | None = None
    is_rentable: bool = False


class CulturalResponse(BaseModel):
    id: int
    title: str
    slug: str
    category: str
    community: str | None = None
    location: str | None = None
    description: str
    significance: str | None = None
    image: str | None = None
    is_rentable: bool = False

    class Config:
        from_attributes = True
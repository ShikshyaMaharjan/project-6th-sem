from pydantic import BaseModel


class CulturalContentCreate(BaseModel):
    title: str
    category: str
    community: str | None = None
    location: str | None = None
    image: str | None = None
    description: str
    significance: str | None = None


class CulturalContentResponse(BaseModel):
    id: int
    slug: str
    title: str
    category: str
    community: str | None = None
    location: str | None = None
    image: str | None = None
    description: str
    significance: str | None = None

    class Config:
        from_attributes = True
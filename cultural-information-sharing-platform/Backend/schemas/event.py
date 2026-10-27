from pydantic import BaseModel


class EventCreate(BaseModel):
    organization_id: int
    slug: str
    title: str
    type: str
    date: str
    time: str
    location: str
    description: str
    about: str | None = None
    image: str | None = None


class EventResponse(BaseModel):
    id: int
    organization_id: int | None = None
    slug: str
    title: str
    type: str
    date: str
    time: str
    location: str
    description: str
    about: str | None = None
    image: str | None = None
    status: str

    class Config:
        from_attributes = True
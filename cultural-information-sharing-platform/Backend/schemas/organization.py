from pydantic import BaseModel


class OrganizationResponse(BaseModel):
    id: int
    name: str
    email: str
    phone: str | None = None
    role: str

    class Config:
        from_attributes = True
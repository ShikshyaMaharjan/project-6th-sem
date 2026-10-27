from pydantic import BaseModel, EmailStr


# =========================================================
# USER REGISTRATION
# =========================================================

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    phone: str
    password: str
    role: str = "user"


# =========================================================
# USER LOGIN
# =========================================================

class UserLogin(BaseModel):
    email: EmailStr
    password: str


# =========================================================
# USER RESPONSE
# Used when displaying users in the Admin dashboard
# =========================================================

class UserResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    phone: str | None = None
    role: str

    class Config:
        from_attributes = True
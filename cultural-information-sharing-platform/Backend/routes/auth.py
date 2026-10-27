from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from passlib.context import CryptContext

from schemas.user import UserCreate, UserLogin
from database import SessionLocal
from auth_utils import create_token
from models.user import User


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)


def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


# REGISTER
@router.post("/register")
def register(
    user: UserCreate,
    db: Session = Depends(get_db)
):
    if user.role not in ["user", "organization"]:
        raise HTTPException(
            status_code=400,
            detail="Invalid role. Choose user or organization."
        )

    existing_user = db.query(User).filter(
        User.email == user.email
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="An account with this email already exists."
        )

    if user.phone and db.query(User).filter(
        User.phone == user.phone
    ).first():
        raise HTTPException(
            status_code=400,
            detail="An account with this phone number already exists."
        )

    hashed_password = pwd_context.hash(user.password)

    new_user = User(
        name=user.name,
        email=user.email,
        phone=user.phone,
        password=hashed_password,
        role=user.role
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "message": "Account created successfully!",
        "user": {
            "id": new_user.id,
            "name": new_user.name,
            "email": new_user.email,
            "phone": new_user.phone,
            "role": new_user.role
        },
        "token": create_token(new_user)
    }


# LOGIN
@router.post("/login")
def login(
    user: UserLogin,
    db: Session = Depends(get_db)
):
    existing_user = db.query(User).filter(
        User.email == user.email
    ).first()

    if not existing_user:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password."
        )

    password_correct = pwd_context.verify(
        user.password,
        existing_user.password
    )

    if not password_correct:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password."
        )

    return {
        "message": "Login successful!",
        "user": {
            "id": existing_user.id,
            "name": existing_user.name,
            "email": existing_user.email,
            "phone": existing_user.phone,
            "role": existing_user.role
        },
        "token": create_token(existing_user)
    }
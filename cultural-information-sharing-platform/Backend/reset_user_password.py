from passlib.context import CryptContext

from database import SessionLocal
from models.user import User

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)

db = SessionLocal()

try:
    email = input("Enter the USER email: ").strip()
    new_password = input("Enter a new password: ")

    user = db.query(User).filter(
        User.email == email
    ).first()

    if not user:
        print("User not found.")
    elif user.role != "user":
        print("This account is not a normal user account.")
    else:
        user.password = pwd_context.hash(new_password)

        db.commit()

        print("User password updated successfully!")

finally:
    db.close()


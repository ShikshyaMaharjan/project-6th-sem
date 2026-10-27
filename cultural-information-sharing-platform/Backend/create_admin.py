from passlib.context import CryptContext

from database import SessionLocal
from models.user import User


pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)


db = SessionLocal()

try:
    admin_email = input("Enter admin email: ").strip()
    admin_name = input("Enter admin name: ").strip()
    admin_password = input("Enter admin password: ")

    existing_admin = db.query(User).filter(
        User.email == admin_email
    ).first()

    if existing_admin:
        # Update the existing account
        existing_admin.name = admin_name
        existing_admin.password = pwd_context.hash(admin_password)
        existing_admin.role = "admin"

        db.commit()

        print("Admin account updated successfully!")

    else:
        # Create a new admin account
        hashed_password = pwd_context.hash(admin_password)

        admin = User(
            name=admin_name,
            email=admin_email,
            password=hashed_password,
            role="admin"
        )

        db.add(admin)
        db.commit()

        print("Admin account created successfully!")

finally:
    db.close()
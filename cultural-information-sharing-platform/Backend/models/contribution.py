from sqlalchemy import Column, Integer, String, Text, ForeignKey

from database import Base


class Contribution(Base):
    __tablename__ = "contributions"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    user_id = Column(
        "submitted_by",
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    title = Column(
        String(150),
        nullable=False
    )

    category = Column(
        String(100),
        nullable=False
    )

    community = Column(
        String(100),
        nullable=False
    )

    location = Column(
        String(150),
        nullable=True
    )

    description = Column(
        Text,
        nullable=False
    )

    significance = Column(
        Text,
        nullable=True
    )

    image = Column(
        String(500),
        nullable=True
    )

    status = Column(
        String(20),
        default="pending",
        nullable=False
    )

    admin_note = Column(
        Text,
        nullable=True
    )
from sqlalchemy import (
    Column, Integer, Text, ForeignKey, DateTime, UniqueConstraint
)
from sqlalchemy.sql import func

from database import Base


class Review(Base):
    __tablename__ = "reviews"

    __table_args__ = (
        UniqueConstraint(
            "user_id",
            "cultural_id",
            name="uq_review_user_cultural"
        ),
    )

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )

    cultural_id = Column(
        Integer,
        ForeignKey("cultural_contents.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )

    # 1 to 5
    rating = Column(Integer, nullable=False)

    comment = Column(Text, nullable=True)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False
    )

from sqlalchemy import (
    Column, Integer, String, Text, ForeignKey, DateTime
)
from sqlalchemy.sql import func

from database import Base


class Rental(Base):
    """
    A request to rent a cultural item such as
    Traditional Attire or Jewelry.
    """

    __tablename__ = "rentals"

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

    # Rental dates
    start_date = Column(String(20), nullable=False)
    end_date = Column(String(20), nullable=False)

    # User information
    phone = Column(String(20), nullable=False)
    note = Column(Text, nullable=True)

    # pending / approved / rejected / returned
    status = Column(
        String(20),
        nullable=False,
        default="pending"
    )

    # Added by admin when approving the rental
    pickup_location = Column(
        String(255),
        nullable=True
    )

    pickup_instructions = Column(
        Text,
        nullable=True
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False
    )
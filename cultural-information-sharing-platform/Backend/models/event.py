from sqlalchemy import Column, Integer, String, Text, ForeignKey
from database import Base


class Event(Base):
    __tablename__ = "events"

    id = Column(Integer, primary_key=True, index=True)

    organization_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=True
    )

    slug = Column(String(150), unique=True, nullable=False, index=True)
    title = Column(String(150), nullable=False)
    type = Column(String(100), nullable=False)
    date = Column(String(100), nullable=False)
    time = Column(String(50), nullable=False)
    location = Column(String(150), nullable=False)
    description = Column(Text, nullable=False)
    about = Column(Text, nullable=True)
    image = Column(String(500), nullable=True)

    # Event approval status
    status = Column(
        String(20),
        nullable=False,
        default="pending"
    )
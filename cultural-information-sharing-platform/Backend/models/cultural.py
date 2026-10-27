from sqlalchemy import Column, Integer, String, Text, Boolean
from database import Base


class CulturalContent(Base):
    __tablename__ = "cultural_contents"

    id = Column(Integer, primary_key=True, index=True)

    title = Column(String(150), nullable=False)
    slug = Column(String(150), unique=True, nullable=False, index=True)

    category = Column(String(100), nullable=False)
    community = Column(String(100), nullable=False, index=True)

    location = Column(String(150), nullable=True)

    description = Column(Text, nullable=False)
    significance = Column(Text, nullable=True)

    image = Column(String(500), nullable=True)

    is_rentable = Column(Boolean, default=False, nullable=False)
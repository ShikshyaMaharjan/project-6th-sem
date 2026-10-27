from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

import os

# The DATABASE_URL environment variable overrides the default below.
# (If it is not set, the original local PostgreSQL URL is used.)
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql+psycopg://postgres:shikshya123@localhost:5432/cultural_preservation"
)

engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

Base = declarative_base()
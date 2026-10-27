from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy import text

from database import engine, Base
from auth_utils import require_admin
from fastapi import Depends

# Models
from models.user import User
from models.event import Event
from models.contribution import Contribution
from models.cultural import CulturalContent
from models.notification import Notification
from models.favorite import Favorite
from models.review import Review
from models.rental import Rental

# Routes
from routes.auth import router as auth_router
from routes.cultural import router as cultural_router
from routes.event import router as event_router
from routes.contribution import router as contribution_router
from routes.notification import router as notification_router
from routes.organization import router as organization_router
from routes.user import router as user_router
from routes.favorite import router as favorite_router
from routes.review import router as review_router
from routes.rental import router as rental_router



# =========================================================
# CREATE FASTAPI APP
# =========================================================

app = FastAPI(
    title="Cultural Information Sharing Platform"
)


# =========================================================
# CORS
# =========================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================================================
# ROUTES
# =========================================================

app.include_router(auth_router)
app.include_router(cultural_router)
app.include_router(event_router)
app.include_router(contribution_router)
app.include_router(notification_router)
app.include_router(organization_router)
app.include_router(user_router)
app.include_router(favorite_router)
app.include_router(review_router)
app.include_router(rental_router)


# =========================================================
# MEDIA (cultural images and uploaded contribution images)
# Files in Backend/media are served at http://127.0.0.1:8000/media/...
# =========================================================

MEDIA_DIR = Path(__file__).resolve().parent / "media"
(MEDIA_DIR / "cultural").mkdir(parents=True, exist_ok=True)
(MEDIA_DIR / "contributions").mkdir(parents=True, exist_ok=True)

app.mount(
    "/media",
    StaticFiles(directory=str(MEDIA_DIR)),
    name="media"
)


# =========================================================
# CREATE DATABASE TABLES
# =========================================================

Base.metadata.create_all(bind=engine)


# =========================================================
# HOME
# =========================================================

@app.get("/")
def home():
    return {
        "message": "Cultural Preservation Platform API is running!"
    }


# =========================================================
# TEST DATABASE
# =========================================================

@app.get("/test-db")
def test_db():
    try:
        with engine.connect():
            return {
                "database": "connected"
            }

    except Exception as e:
        return {
            "database": "connection failed",
            "error": str(e)
        }


# =========================================================
# DEBUG DATABASE
# =========================================================

@app.get("/debug-db")
def debug_db(admin=Depends(require_admin)):
    with engine.connect() as conn:

        result = conn.execute(
            text(
                "SELECT current_database(), current_schema()"
            )
        )

        row = result.fetchone()

        return {
            "database": row[0],
            "schema": row[1]
        }


# =========================================================
# DEBUG EVENTS COLUMNS
# =========================================================

@app.get("/debug-events-columns")
def debug_events_columns(admin=Depends(require_admin)):

    with engine.connect() as conn:

        result = conn.execute(
            text(
                """
                SELECT
                    table_schema,
                    column_name,
                    data_type
                FROM information_schema.columns
                WHERE table_name = 'events'
                ORDER BY
                    table_schema,
                    ordinal_position
                """
            )
        )

        return [
            dict(row._mapping)
            for row in result
        ]
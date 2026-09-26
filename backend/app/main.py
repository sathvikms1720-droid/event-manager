from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

from app.database import Base, engine

from app.models.client import Client
from app.models.event import Event
from app.models.reminder import Reminder
from app.models.settings import Settings
from app.models.user import User

from app.routers import auth
from app.routers import clients
from app.routers import dashboard
from app.routers import events

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Event Manager API",
    version="1.0.0"
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(clients.router)
app.include_router(events.router)
app.include_router(dashboard.router)
app.include_router(auth.router)

@app.get("/")
def home():
    return {
        "success": True,
        "message": "Backend Running 🚀"
    }

@app.get("/test-db")
def test_db():
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        return {"status": "Database Connected Successfully ✅"}
    except Exception as e:
        return {"error": str(e)}
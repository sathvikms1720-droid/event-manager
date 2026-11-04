from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from jose import jwt

from app.database import get_db
from app.models.reminder import Reminder
from app.models.event import Event
from app.models.client import Client
from app.models.user import User
from app.schemas.reminder import ReminderCreate, ReminderResponse
from app.config import SECRET_KEY, ALGORITHM


router = APIRouter(
    prefix="/reminders",
    tags=["Reminders"]
)

security = HTTPBearer()


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    try:
        token = credentials.credentials

        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        user_id = payload.get("sub")

        if not user_id:
            raise HTTPException(
                status_code=401,
                detail="Invalid token"
            )

        user = db.query(User).filter(
            User.id == int(user_id)
        ).first()

        if not user:
            raise HTTPException(
                status_code=401,
                detail="User not found"
            )

        return user

    except Exception:
        raise HTTPException(
            status_code=401,
            detail="Invalid authentication token"
        )


# ---------------------------------------------------------
# CREATE REMINDER
# ---------------------------------------------------------

@router.post("/", response_model=ReminderResponse)
def create_reminder(
    reminder: ReminderCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    event = (
        db.query(Event)
        .join(Client, Event.client_id == Client.id)
        .filter(
            Event.id == reminder.event_id,
            Client.user_id == current_user.id
        )
        .first()
    )

    if not event:
        raise HTTPException(
            status_code=404,
            detail="Event not found"
        )

    existing = db.query(Reminder).filter(
        Reminder.event_id == reminder.event_id
    ).first()

    if existing:
        existing.title = reminder.title
        existing.reminder_datetime = reminder.reminder_datetime
        existing.status = "Pending"

        db.commit()
        db.refresh(existing)

        return existing

    new_reminder = Reminder(
        event_id=reminder.event_id,
        title=reminder.title,
        reminder_datetime=reminder.reminder_datetime,
        status="Pending"
    )

    db.add(new_reminder)
    db.commit()
    db.refresh(new_reminder)

    return new_reminder


# ---------------------------------------------------------
# GET ALL REMINDERS
# ---------------------------------------------------------

@router.get("/", response_model=list[ReminderResponse])
def get_reminders(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    reminders = (
        db.query(Reminder)
        .join(Event, Reminder.event_id == Event.id)
        .join(Client, Event.client_id == Client.id)
        .filter(
            Client.user_id == current_user.id
        )
        .order_by(Reminder.reminder_datetime.asc())
        .all()
    )

    return reminders


# ---------------------------------------------------------
# GET SINGLE REMINDER
# ---------------------------------------------------------

@router.get("/{reminder_id}", response_model=ReminderResponse)
def get_reminder(
    reminder_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    reminder = (
        db.query(Reminder)
        .join(Event, Reminder.event_id == Event.id)
        .join(Client, Event.client_id == Client.id)
        .filter(
            Reminder.id == reminder_id,
            Client.user_id == current_user.id
        )
        .first()
    )

    if not reminder:
        raise HTTPException(
            status_code=404,
            detail="Reminder not found"
        )

    return reminder


# ---------------------------------------------------------
# UPDATE REMINDER
# ---------------------------------------------------------

@router.put("/{reminder_id}", response_model=ReminderResponse)
def update_reminder(
    reminder_id: int,
    reminder: ReminderCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    existing = (
        db.query(Reminder)
        .join(Event, Reminder.event_id == Event.id)
        .join(Client, Event.client_id == Client.id)
        .filter(
            Reminder.id == reminder_id,
            Client.user_id == current_user.id
        )
        .first()
    )

    if not existing:
        raise HTTPException(
            status_code=404,
            detail="Reminder not found"
        )

    existing.title = reminder.title
    existing.reminder_datetime = reminder.reminder_datetime

    db.commit()
    db.refresh(existing)

    return existing


# ---------------------------------------------------------
# DELETE REMINDER
# ---------------------------------------------------------

@router.delete("/{reminder_id}")
def delete_reminder(
    reminder_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    existing = (
        db.query(Reminder)
        .join(Event, Reminder.event_id == Event.id)
        .join(Client, Event.client_id == Client.id)
        .filter(
            Reminder.id == reminder_id,
            Client.user_id == current_user.id
        )
        .first()
    )

    if not existing:
        raise HTTPException(
            status_code=404,
            detail="Reminder not found"
        )

    db.delete(existing)
    db.commit()

    return {
        "message": "Reminder deleted successfully"
    }
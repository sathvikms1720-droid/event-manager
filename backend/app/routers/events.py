from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from jose import jwt

from app.database import get_db
from app.models.client import Client
from app.models.event import Event
from app.models.user import User
from app.schemas.event import EventCreate
from app.config import SECRET_KEY, ALGORITHM


router = APIRouter(
    prefix="/events",
    tags=["Events"]
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
# ADD EVENT
# ---------------------------------------------------------

@router.post("/")
def add_event(
    event: EventCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    # Find client ONLY inside the logged-in user's clients
    client = (
        db.query(Client)
        .filter(
            Client.phone == event.client_phone,
            Client.user_id == current_user.id
        )
        .first()
    )

    # Create client if it doesn't exist
    if not client:
        client = Client(
            user_id=current_user.id,
            name=event.client_name,
            phone=event.client_phone,
            email=event.client_email,
        )

        db.add(client)
        db.flush()

    # Create event for this user's client
    new_event = Event(
        client_id=client.id,
        event_name=event.event_name,
        event_type=event.event_type,
        event_date=event.event_date,
        event_time=event.event_time,
        venue=event.venue,
        guests=event.guests,
        budget=event.budget,
        advance_paid=event.advance_paid,
        remaining_amount=event.remaining_amount,
        status=event.status,
        notes=event.notes,
    )

    db.add(new_event)
    db.commit()
    db.refresh(new_event)

    return new_event


# ---------------------------------------------------------
# GET ALL EVENTS FOR CURRENT USER
# ---------------------------------------------------------

@router.get("/")
def get_events(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    events = (
        db.query(Event, Client)
        .join(Client, Event.client_id == Client.id)
        .filter(Client.user_id == current_user.id)
        .all()
    )

    result = []

    for event, client in events:
        result.append({
            "id": event.id,
            "client_id": event.client_id,
            "client_name": client.name,

            "event_name": event.event_name,
            "event_type": event.event_type,

            "event_date": event.event_date,
            "event_time": event.event_time,

            "venue": event.venue,
            "guests": event.guests,

            "budget": event.budget,
            "advance_paid": event.advance_paid,
            "remaining_amount": event.remaining_amount,

            "status": event.status,
            "notes": event.notes,

            "created_at": event.created_at,
            "updated_at": event.updated_at,
        })

    return result


# ---------------------------------------------------------
# GET SINGLE EVENT
# ---------------------------------------------------------

@router.get("/{event_id}")
def get_event(
    event_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    event = (
        db.query(Event)
        .join(Client, Event.client_id == Client.id)
        .filter(
            Event.id == event_id,
            Client.user_id == current_user.id
        )
        .first()
    )

    if not event:
        raise HTTPException(
            status_code=404,
            detail="Event not found"
        )

    return event


# ---------------------------------------------------------
# UPDATE EVENT
# ---------------------------------------------------------

@router.put("/{event_id}")
def update_event(
    event_id: int,
    event: EventCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    existing = (
        db.query(Event)
        .join(Client, Event.client_id == Client.id)
        .filter(
            Event.id == event_id,
            Client.user_id == current_user.id
        )
        .first()
    )

    if not existing:
        raise HTTPException(
            status_code=404,
            detail="Event not found"
        )

    existing.event_name = event.event_name
    existing.event_type = event.event_type
    existing.event_date = event.event_date
    existing.event_time = event.event_time
    existing.venue = event.venue
    existing.guests = event.guests
    existing.budget = event.budget
    existing.advance_paid = event.advance_paid
    existing.remaining_amount = event.remaining_amount
    existing.status = event.status
    existing.notes = event.notes

    db.commit()
    db.refresh(existing)

    return existing


# ---------------------------------------------------------
# DELETE EVENT
# ---------------------------------------------------------

@router.delete("/{event_id}")
def delete_event(
    event_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    event = (
        db.query(Event)
        .join(Client, Event.client_id == Client.id)
        .filter(
            Event.id == event_id,
            Client.user_id == current_user.id
        )
        .first()
    )

    if not event:
        raise HTTPException(
            status_code=404,
            detail="Event not found"
        )

    db.delete(event)
    db.commit()

    return {
        "message": "Event deleted successfully"
    }
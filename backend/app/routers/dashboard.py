from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from jose import jwt
from datetime import date

from app.database import get_db
from app.models.client import Client
from app.models.event import Event
from app.models.user import User
from app.config import SECRET_KEY, ALGORITHM

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)

security = HTTPBearer()


# AUTHENTICATE CURRENT USER
def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    try:
        payload = jwt.decode(
            credentials.credentials,
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

    except HTTPException:
        raise

    except Exception:
        raise HTTPException(
            status_code=401,
            detail="Invalid authentication token"
        )


def get_event_image(event_type):
    images = {
        "wedding": "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop&q=60",
        "birthday": "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&auto=format&fit=crop&q=60",
        "corporate": "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=60",
        "engagement": "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800&auto=format&fit=crop&q=60",
        "baby shower": "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=800&auto=format&fit=crop&q=60",
        "housewarming": "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&auto=format&fit=crop&q=60",
    }

    return images.get(
        (event_type or "").lower(),
        "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&auto=format&fit=crop&q=60"
    )


@router.get("/")
def dashboard(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    # Only clients belonging to the logged-in account
    user_clients = db.query(Client).filter(
        Client.user_id == current_user.id
    )

    # Only events belonging to those clients
    user_events = (
        db.query(Event)
        .join(Client, Event.client_id == Client.id)
        .filter(Client.user_id == current_user.id)
    )

    total_clients = user_clients.count()
    total_events = user_events.count()

    upcoming_events = user_events.filter(
        Event.event_date >= date.today()
    ).count()

    today_events = user_events.filter(
        Event.event_date == date.today()
    ).count()

    completed_events = user_events.filter(
        Event.status == "Completed"
    ).count()

    recent_events = (
        db.query(Event, Client)
        .join(Client, Event.client_id == Client.id)
        .filter(
            Client.user_id == current_user.id,
            Event.event_date >= date.today()
        )
        .order_by(Event.event_date)
        .limit(5)
        .all()
    )

    return {
        "total_clients": total_clients,
        "total_events": total_events,
        "upcoming_events": upcoming_events,
        "today_events": today_events,
        "completed_events": completed_events,

        "recent_events": [
            {
                "id": event.id,
                "day": event.event_date.strftime("%d"),
                "month": event.event_date.strftime("%b").upper(),

                "title": event.event_name,
                "client": client.name,

                "meta": (
                    f"{event.event_time.strftime('%I:%M %p')} • "
                    f"{event.venue or ''}"
                ),

                "image": get_event_image(event.event_type),

                "date": event.event_date.strftime("%d %B %Y"),
                "time": event.event_time.strftime("%I:%M %p"),
                "venue": event.venue,

                "guests": event.guests,
                "status": event.status,
            }
            for event, client in recent_events
        ]
    }
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import date

from app.database import get_db
from app.models.client import Client
from app.models.event import Event

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
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
        event_type.lower(),
        "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&auto=format&fit=crop&q=60"
    )


@router.get("/")
def dashboard(db: Session = Depends(get_db)):

    total_clients = db.query(Client).count()

    total_events = db.query(Event).count()

    upcoming_events = (
        db.query(Event)
        .filter(Event.event_date >= date.today())
        .count()
    )

    today_events = (
        db.query(Event)
        .filter(Event.event_date == date.today())
        .count()
    )

    completed_events = (
        db.query(Event)
        .filter(Event.status == "Completed")
        .count()
    )

    recent_events = (
        db.query(Event, Client)
        .join(Client, Event.client_id == Client.id)
        .filter(Event.event_date >= date.today())
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

                "meta": f"{event.event_time.strftime('%I:%M %p')} • {event.venue}",

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
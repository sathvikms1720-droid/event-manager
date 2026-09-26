from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from jose import jwt

from app.database import get_db
from app.models.client import Client
from app.models.event import Event
from app.schemas.client import ClientCreate
from app.models.user import User
from app.config import SECRET_KEY, ALGORITHM

router = APIRouter(prefix="/clients", tags=["Clients"])

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


@router.post("/")
def add_client(
    client: ClientCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    new_client = Client(
        user_id=current_user.id,
        name=client.name,
        phone=client.phone,
        email=client.email,
        address=client.address,
        notes=client.notes,
    )

    db.add(new_client)
    db.commit()
    db.refresh(new_client)

    return new_client

@router.get("/")
def get_clients(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    clients = db.query(Client).filter(
        Client.user_id == current_user.id
    ).all()

    result = []

    for client in clients:
        events = db.query(Event).filter(
            Event.client_id == client.id
        ).all()

        total_events = len(events)

        total_spent = sum(
            float(event.budget or 0)
            for event in events
        )

        upcoming_events = [
            event for event in events
            if event.event_date and event.event_time
        ]

        upcoming_events.sort(
            key=lambda event: (
                event.event_date,
                event.event_time
            )
        )

        next_event = upcoming_events[0] if upcoming_events else None

        result.append({
            "id": client.id,
            "user_id": client.user_id,
            "name": client.name,
            "phone": client.phone,
            "email": client.email,
            "address": client.address,
            "notes": client.notes,
            "created_at": client.created_at,

            "events": total_events,
            "spent": total_spent,

            "nextEvent": (
                next_event.event_name
                if next_event else None
            ),

            "nextDate": (
                f"{next_event.event_date}T{next_event.event_time}"
                if next_event else None
            ),
        })

    return result


@router.get("/{client_id}")
def get_client(
    client_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    client = db.query(Client).filter(
        Client.id == client_id,
        Client.user_id == current_user.id
    ).first()

    if not client:
        raise HTTPException(
            status_code=404,
            detail="Client not found"
        )

    return client


@router.put("/{client_id}")
def update_client(
    client_id: int,
    client: ClientCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    existing = db.query(Client).filter(
        Client.id == client_id,
        Client.user_id == current_user.id
    ).first()

    if not existing:
        raise HTTPException(
            status_code=404,
            detail="Client not found"
        )

    for key, value in client.model_dump().items():
        setattr(existing, key, value)

    db.commit()
    db.refresh(existing)

    return existing


@router.delete("/{client_id}")
def delete_client(
    client_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    client = db.query(Client).filter(
        Client.id == client_id,
        Client.user_id == current_user.id
    ).first()

    if not client:
        raise HTTPException(
            status_code=404,
            detail="Client not found"
        )

    # Delete all events belonging to this client first
    db.query(Event).filter(
        Event.client_id == client.id
    ).delete(synchronize_session=False)

    # Then delete the client
    db.delete(client)

    db.commit()

    return {
        "message": "Client and all related events deleted successfully"
    }
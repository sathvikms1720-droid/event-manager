from pydantic import BaseModel, EmailStr
from datetime import date, time
from decimal import Decimal
from typing import Optional


class EventCreate(BaseModel):
    client_name: str
    client_phone: str
    client_email: Optional[EmailStr] = None

    event_name: str
    event_type: str
    event_date: date
    event_time: time
    guests: int = 0

    venue: Optional[str] = None
    budget: Optional[Decimal] = None
    advance_paid: Optional[Decimal] = None
    remaining_amount: Optional[Decimal] = None

    status: str = "Upcoming"
    notes: Optional[str] = None
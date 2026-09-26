from pydantic import BaseModel
from datetime import datetime


class ReminderCreate(BaseModel):
    event_id: int
    title: str
    reminder_datetime: datetime


class ReminderResponse(ReminderCreate):
    id: int
    status: str

    class Config:
        from_attributes = True
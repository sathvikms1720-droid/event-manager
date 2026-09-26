from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.sql import func
from app.database import Base


class Reminder(Base):
    __tablename__ = "reminders"

    id = Column(Integer, primary_key=True, index=True)

    event_id = Column(Integer, ForeignKey("events.id"))

    title = Column(String(255))

    reminder_datetime = Column(DateTime)

    status = Column(String(20), default="Pending")

    created_at = Column(DateTime(timezone=True), server_default=func.now())
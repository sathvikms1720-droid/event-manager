from sqlalchemy import Column, Integer, String, Date, Time, DateTime, ForeignKey, Numeric
from sqlalchemy.sql import func
from app.database import Base


class Event(Base):
    __tablename__ = "events"

    id = Column(Integer, primary_key=True, index=True)

    client_id = Column(Integer, ForeignKey("clients.id"))

    event_name = Column(String(100), nullable=False)
    event_type = Column(String(50), nullable=False)

    event_date = Column(Date, nullable=False)
    event_time = Column(Time, nullable=False)
    guests = Column(Integer, default=0)
    
    venue = Column(String(255))

    budget = Column(Numeric(10, 2))
    advance_paid = Column(Numeric(10, 2))
    remaining_amount = Column(Numeric(10, 2))

    status = Column(String(30), default="Upcoming")

    notes = Column(String(500))

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
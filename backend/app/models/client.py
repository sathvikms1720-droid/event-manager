from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func

from app.database import Base


class Client(Base):
    __tablename__ = "clients"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, nullable=False)

    name = Column(String(100), nullable=False)

    phone = Column(String(20), nullable=False)

    email = Column(String(100), nullable=True)

    address = Column(String(255), nullable=True)

    notes = Column(String(500), nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
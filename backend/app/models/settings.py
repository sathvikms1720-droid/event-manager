from sqlalchemy import Column, Integer, String
from app.database import Base


class Settings(Base):
    __tablename__ = "settings"

    id = Column(Integer, primary_key=True, index=True)

    business_name = Column(String(100))
    owner_name = Column(String(100))
    phone = Column(String(20))
    email = Column(String(100))
    address = Column(String(255))
    language = Column(String(30))
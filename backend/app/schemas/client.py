from pydantic import BaseModel, EmailStr
from typing import Optional


class ClientCreate(BaseModel):
    name: str
    phone: str
    email: Optional[EmailStr] = None
    address: Optional[str] = None
    notes: Optional[str] = None

    # Client profile details
    avatar: Optional[str] = None
    gender: Optional[str] = None


class ClientResponse(ClientCreate):
    id: int

    class Config:
        from_attributes = True
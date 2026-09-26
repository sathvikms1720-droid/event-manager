from pydantic import BaseModel


class SettingsSchema(BaseModel):
    business_name: str
    owner_name: str
    phone: str
    email: str
    address: str
    language: str

    class Config:
        from_attributes = True
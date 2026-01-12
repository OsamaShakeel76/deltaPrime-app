from pydantic import BaseModel, EmailStr, validator
from typing import Optional

class ContactForm(BaseModel):
    name: str
    email: EmailStr
    message: str
    
    @validator('name')
    def name_length(cls, v):
        if len(v) < 2:
            raise ValueError('Name must be at least 2 characters')
        return v
    
    @validator('message')
    def message_length(cls, v):
        if len(v) < 10:
            raise ValueError('Message must be at least 10 characters')
        return v

class ChatRequest(BaseModel):
    message: str
    session_id: str

class ServiceInquiry(BaseModel):
    name: str
    email: EmailStr
    service_type: str
    message: str
    
    @validator('service_type')
    def validate_service_type(cls, v):
        allowed = ["web_dev", "app_dev", "ai_dev", "qa", "devops"]
        if v not in allowed:
            raise ValueError(f'Service type must be one of: {", ".join(allowed)}')
        return v


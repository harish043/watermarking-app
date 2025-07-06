from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class UserBase(BaseModel):
    email: EmailStr
    username: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    created_at: datetime
    is_active: bool
    
    class Config:
        from_attributes = True

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

class WatermarkEmbedRequest(BaseModel):
    watermark_text: str

class WatermarkExtractRequest(BaseModel):
    pass

class WatermarkResponse(BaseModel):
    message: str
    filename: Optional[str] = None
    psnr: Optional[float] = None
    ssim: Optional[float] = None
    mse: Optional[float] = None
    extracted_text: Optional[str] = None 
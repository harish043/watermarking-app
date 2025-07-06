from sqlalchemy import Column, Integer, String, DateTime, Text, Float
from sqlalchemy.sql import func
from .core.database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    is_active = Column(Integer, default=1)

class WatermarkOperation(Base):
    __tablename__ = "watermark_operations"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True)
    operation_type = Column(String)  # "embed" or "extract"
    original_filename = Column(String)
    watermarked_filename = Column(String, nullable=True)
    watermark_text = Column(Text, nullable=True)
    psnr = Column(Float, nullable=True)
    ssim = Column(Float, nullable=True)
    mse = Column(Float, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now()) 
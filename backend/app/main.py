from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
import uvicorn
import os
import uuid
from pathlib import Path

from .routers import watermark, auth, users
from .core.config import settings
from .core.database import engine
from .models import Base

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Watermarking API",
    description="A full-stack invisible watermarking application for academic assignments",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],  # React frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(users.router, prefix="/api/users", tags=["Users"])
app.include_router(watermark.router, prefix="/api/watermark", tags=["Watermarking"])

@app.get("/")
async def root():
    return {"message": "Watermarking API is running!"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    ) 
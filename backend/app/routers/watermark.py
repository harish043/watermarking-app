from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Depends
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from typing import Optional
import os

from ..core.database import get_db
from ..services.watermark_service import WatermarkService
from ..schemas import WatermarkResponse
from ..models import WatermarkOperation, User
from ..routers.auth import get_current_user

router = APIRouter()
watermark_service = WatermarkService()

@router.post("/embed", response_model=WatermarkResponse)
async def embed_watermark(
    file: UploadFile = File(...),
    watermark_text: str = Form(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Embed a watermark in an uploaded image."""
    if not file.content_type.startswith('image/'):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    try:
        # Read file content
        content = await file.read()
        
        # Process watermark embedding
        result = watermark_service.embed_watermark(content, watermark_text)
        
        # Save operation to database
        db_operation = WatermarkOperation(
            user_id=current_user.id,
            operation_type="embed",
            original_filename=file.filename,
            watermarked_filename=result["filename"],
            watermark_text=watermark_text,
            psnr=result["metrics"]["psnr"],
            ssim=result["metrics"]["ssim"],
            mse=result["metrics"]["mse"]
        )
        db.add(db_operation)
        db.commit()
        
        return WatermarkResponse(
            message="Watermark embedded successfully",
            filename=result["filename"],
            psnr=result["metrics"]["psnr"],
            ssim=result["metrics"]["ssim"],
            mse=result["metrics"]["mse"]
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/extract", response_model=WatermarkResponse)
async def extract_watermark(
    watermarked_file: UploadFile = File(...),
    original_file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Extract a watermark from a watermarked image."""
    if not watermarked_file.content_type.startswith('image/') or not original_file.content_type.startswith('image/'):
        raise HTTPException(status_code=400, detail="Files must be images")
    
    try:
        # Read file contents
        watermarked_content = await watermarked_file.read()
        original_content = await original_file.read()
        
        # Process watermark extraction
        result = watermark_service.extract_watermark(watermarked_content, original_content)
        
        # Save operation to database
        db_operation = WatermarkOperation(
            user_id=current_user.id,
            operation_type="extract",
            original_filename=original_file.filename,
            watermarked_filename=watermarked_file.filename
        )
        db.add(db_operation)
        db.commit()
        
        return WatermarkResponse(
            message="Watermark extracted successfully",
            extracted_text=result["extracted_text"]
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/download/{filename}")
async def download_file(filename: str):
    """Download a processed image file."""
    file_path = os.path.join("uploads", filename)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")
    
    return FileResponse(file_path, filename=filename)

@router.get("/history")
async def get_watermark_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get watermark operation history for the current user."""
    operations = db.query(WatermarkOperation).filter(
        WatermarkOperation.user_id == current_user.id
    ).order_by(WatermarkOperation.created_at.desc()).all()
    
    return operations 
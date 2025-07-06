from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..core.database import get_db
from ..models import User
from ..schemas import User as UserSchema
from ..routers.auth import get_current_user

router = APIRouter()

@router.get("/profile", response_model=UserSchema)
async def get_user_profile(current_user: User = Depends(get_current_user)):
    """Get current user's profile."""
    return current_user

@router.get("/users", response_model=list[UserSchema])
async def get_users(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get list of users (admin only)."""
    # In a real app, you'd check if current_user is admin
    users = db.query(User).offset(skip).limit(limit).all()
    return users 
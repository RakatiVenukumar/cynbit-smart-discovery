from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import timedelta
from app.db.session import get_db
from app.schemas.auth import LoginRequest, TokenResponse, AdminResponse
from app.repositories.admin_repo import get_admin_by_email
from app.core.security import verify_password, create_access_token
from app.core.config import settings
from app.api.deps import get_current_admin

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    admin = get_admin_by_email(db, str(payload.email))
    if not admin or not admin.is_active:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    if not verify_password(payload.password, admin.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    token = create_access_token(
        data={"sub": str(admin.id)},
        expires_delta=timedelta(minutes=settings.access_token_expire_minutes),
    )
    return TokenResponse(access_token=token)


@router.get("/me", response_model=AdminResponse)
def get_me(admin=Depends(get_current_admin)):
    return AdminResponse(id=str(admin.id), email=admin.email, is_active=admin.is_active)

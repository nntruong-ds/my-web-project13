from fastapi import APIRouter, Depends, Header
from sqlalchemy.orm import Session
from app.schemas.auth_schema import LoginRequest, LoginResponse, ForgotPasswordRequest, ResetPasswordRequest
from app.configs.database import get_db
from app.services import auth_service

router = APIRouter()

@router.post("/login", response_model=LoginResponse)
def login(data: LoginRequest, db: Session = Depends(get_db)):
    return auth_service.login(data, db)

@router.post("/logout")
def logout(authorization: str = Header(None)):
    if not authorization:
        return {"message": "Token không hợp lệ"}
    token = authorization.replace("Bearer ", "")
    return auth_service.logout(token)

@router.post("/forgot-password")
def forgot_password(data: ForgotPasswordRequest, db: Session = Depends(get_db)):
    return auth_service.forgot_password(data, db)

@router.post("/reset-password")
def reset_password(data: ResetPasswordRequest, db: Session = Depends(get_db)):
    return auth_service.reset_password(data, db)

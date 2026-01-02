# routers/auth_router.py

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.configs.database import get_db
from app.schemas.auth_schema import (
    LoginRequest,
    ForgotPasswordRequest,
    ResetPasswordRequest
)
from app.controllers.auth_controller import (
    login_controller, logout_controller,
    forgot_password_controller, reset_password_controller
)

router = APIRouter()

@router.post("/login")
def login(data: LoginRequest, db: Session = Depends(get_db)):
    return login_controller(data, db)

@router.post("/logout")
def logout(token: str):
    return logout_controller(token)

@router.post("/forgot-password")
def forgot_password(data: ForgotPasswordRequest, db: Session = Depends(get_db)):
    return forgot_password_controller(data, db)

@router.post("/reset-password")
def reset_password(data: ResetPasswordRequest, db: Session = Depends(get_db)):
    return reset_password_controller(data, db)

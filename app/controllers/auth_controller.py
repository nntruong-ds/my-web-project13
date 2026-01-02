from fastapi import HTTPException
from sqlalchemy.orm import Session
from app.services.auth_service import (
    login_service, logout_service,
    forgot_password_service, reset_password_service
)

def login_controller(data, db: Session):
    if not data.username or not data.password:
        raise HTTPException(400, "Thiếu username hoặc password")
    return login_service(data, db)

def logout_controller(token: str):
    if not token:
        raise HTTPException(400, "Thiếu token")
    return logout_service(token)

def forgot_password_controller(data, db: Session):
    if not data.username:
        raise HTTPException(400, "Thiếu username")
    return forgot_password_service(data, db)

def reset_password_controller(data, db: Session):
    if not data.username or not data.otp or not data.new_password:
        raise HTTPException(400, "Thiếu dữ liệu đặt lại mật khẩu")
    return reset_password_service(data, db)

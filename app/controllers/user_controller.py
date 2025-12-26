from sqlalchemy.orm import Session
from fastapi import HTTPException

from app.services.user_service import UserService
from app.schemas.user_schema import *
from app.utils.jwt_handler import JWTUtils

class UserController:
    
    @staticmethod
    def register(db: Session, request: UserCreate):
        try:
            return UserService.create_user(db, request)
        except ValueError as e:
            raise HTTPException(status_code=400, detail=str(e))

    @staticmethod
    def login(db: Session, request: UserLogin):
        user = UserService.authenticate(db, request)
        if not user:
            raise HTTPException(status_code=401, detail="Sai tên đăng nhập hoặc mật khẩu")
        
        # Tạo token
        access_token = JWTUtils.create_access_token(subject=user.username)
        
        # Trả về đúng format Token Schema
        return {
            "access_token": access_token,
            "token_type": "bearer"
        }
    
    @staticmethod
    def forgot_password(db: Session, request: ForgotPasswordRequest):
        try:
            return UserService.forgot_password(db, request)
        except ValueError as e:
            raise HTTPException(status_code=400, detail=str(e))

    @staticmethod
    def reset_password(db: Session, request: ResetPasswordRequest):
        try:
            return UserService.reset_password(db, request)
        except ValueError as e:
            raise HTTPException(status_code=400, detail=str(e))

    @staticmethod
    def change_password(db: Session, username: str, request: ChangePasswordRequest):
        try:
            return UserService.change_password(db, username, request)
        except ValueError as e:
            # Nếu sai pass cũ -> Trả về lỗi 400 Bad Request
            raise HTTPException(status_code=400, detail=str(e))
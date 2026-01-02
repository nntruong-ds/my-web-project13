from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.configs.database import get_db
from app.controllers.user_controller import UserController
from app.schemas.user_schema import *
from app.schemas.token_schema import Token
from app.utils.dependencies import get_current_user
from app.models.user import User

router = APIRouter(prefix="/users", tags=["Users - Tài khoản"])

@router.post("/register", response_model=UserResponse)
def register(request: UserCreate, db: Session = Depends(get_db)):
    """Đăng ký tài khoản mới (Mật khẩu sẽ được mã hóa)"""
    return UserController.register(db, request)

@router.post("/login", response_model=Token)
def login(request: UserLogin, db: Session = Depends(get_db)):
    """Đăng nhập hệ thống"""
    return UserController.login(db, request)

# API Test bảo mật (Phải có Token mới gọi được)
@router.get("/me", response_model=UserResponse)
def read_users_me(current_user: User = Depends(get_current_user)):
    """Trả về thông tin của chính người đang đăng nhập"""
    return current_user

@router.post("/forgot-password")
def forgot_password(request: ForgotPasswordRequest, db: Session = Depends(get_db)):
    """Bước 1: Nhập User + Email -> Nhận Token (giả lập gửi mail)"""
    return UserController.forgot_password(db, request)

@router.post("/reset-password")
def reset_password(request: ResetPasswordRequest, db: Session = Depends(get_db)):
    """Bước 2: Nhập Token + Pass mới -> Đổi mật khẩu"""
    return UserController.reset_password(db, request)

@router.post("/change-password")
def change_password(
    request: ChangePasswordRequest, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user) # Bắt buộc phải có Token
):
    """
    Đổi mật khẩu cho người dùng đang đăng nhập.
    - Yêu cầu: Token (Header), Mật khẩu cũ, Mật khẩu mới.
    """
    # Lấy username từ current_user (do Token giải mã ra) để đảm bảo chính chủ
    return UserController.change_password(db, current_user.username, request)
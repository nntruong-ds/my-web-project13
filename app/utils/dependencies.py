from fastapi import Depends, HTTPException, status
from fastapi.security import APIKeyHeader
from jose import jwt, JWTError
from sqlalchemy.orm import Session
from typing import List

from app.configs.database import get_db
from app.configs.settings import settings
from app.models.user import User
from app.models.enums import VaiTro
from app.utils.jwt_handler import JWTUtils

# Chỉ định đường dẫn API Login để Swagger UI biết nơi lấy token
oauth2_scheme = APIKeyHeader(name="Authorization")

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Token không hợp lệ hoặc đã hết hạn",
        headers={"WWW-Authenticate": "Bearer"},
    )

    # --- XỬ LÝ CHUỖI BEARER ---
    # Nếu người dùng gửi "Bearer eyJ...", ta cần cắt bỏ chữ "Bearer " đi chỉ lấy phần mã
    if token.startswith("Bearer "):
        token = token.replace("Bearer ", "")
    
    try:
        # Giải mã Token
        payload = JWTUtils.verify_token(token)
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except (JWTError, AttributeError):
        raise credentials_exception
        
    # Kiểm tra user trong DB
    user = db.query(User).filter(User.username == username).first()
    if user is None:
        raise credentials_exception
        
    return user

class RoleChecker:
    def __init__(self, allowed_roles: List[VaiTro]):
        """
        Khởi tạo bộ lọc với danh sách các vai trò được phép.
        Ví dụ: RoleChecker([VaiTro.TGD, VaiTro.GDCN])
        """
        self.allowed_roles = allowed_roles

    def __call__(self, user: User = Depends(get_current_user)):
        """
        Logic kiểm tra chạy mỗi khi gọi API.
        - user: Tự động lấy từ hàm get_current_user (đã xác thực Token)
        """
        if user.role not in self.allowed_roles:
            # Lỗi 403: Forbidden (Biết là ai rồi, nhưng không có quyền)
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN, 
                detail="Bạn không có quyền thực hiện chức năng này!"
            )
        return user
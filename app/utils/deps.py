from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from sqlalchemy import text

from app.configs.database import get_db
from app.utils.jwt_handler import verify_access_token

security = HTTPBearer()   # 🔑 QUAN TRỌNG


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    token = credentials.credentials   # chỉ lấy token, bỏ "Bearer"

    payload = verify_access_token(token)

    ma_nhan_vien = payload.get("ma_nhan_vien")
    if not ma_nhan_vien:
        raise HTTPException(status_code=401, detail="Token thiếu ma_nhan_vien")

    user = db.execute(
        text("SELECT * FROM users WHERE TenDangNhap=:u"),
        {"u": ma_nhan_vien}
    ).fetchone()

    if not user:
        raise HTTPException(status_code=401, detail="User không tồn tại")

    return user

from fastapi import HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.utils.hash_md5 import hash_password, verify_password
from app.utils.jwt_handler import create_access_token
from app.utils.email_sender import send_reset_email
import random

otp_cache = {}
token_blocklist = set()

def login_service(data, db: Session):
    user = db.execute(
        text("SELECT * FROM users WHERE TenDangNhap=:username"),
        {"username": data.username}
    ).fetchone()

    if not user or not verify_password(data.password, user.MatKhau):
        raise HTTPException(401, "Sai tên đăng nhập hoặc mật khẩu")

    token = create_access_token({
        "ma_nhan_vien": user.TenDangNhap,
        "role": user.VaiTro
    })

    return {"access_token": token, "role": user.VaiTro}

def logout_service(token: str):
    token_blocklist.add(token)
    return {"message": "Đăng xuất thành công"}

def forgot_password_service(data, db: Session):
    user = db.execute(
        text("SELECT * FROM users WHERE TenDangNhap=:username"),
        {"username": data.username}
    ).fetchone()

    if not user:
        raise HTTPException(404, "Không tìm thấy người dùng")

    nhanvien = db.execute(
        text("SELECT email FROM nhan_vien WHERE ma_nhan_vien=:ma"),
        {"ma": data.username}
    ).fetchone()

    if not nhanvien or not nhanvien.email:
        raise HTTPException(404, "Không tìm thấy email nhân viên")

    otp = str(random.randint(100000, 999999))
    otp_cache[user.TenDangNhap] = otp

    send_reset_email(nhanvien.email, otp, debug=False)
    return {"message": "OTP đã được gửi đến email"}

def reset_password_service(data, db: Session):
    otp_saved = otp_cache.get(data.username)
    if otp_saved != data.otp:
        raise HTTPException(400, "OTP không hợp lệ")

    hashed_new = hash_password(data.new_password)

    db.execute(
        text("UPDATE users SET MatKhau=:newpass WHERE TenDangNhap=:username"),
        {"newpass": hashed_new, "username": data.username}
    )
    
    db.commit()
    del otp_cache[data.username]

    return {"message": "Đặt lại mật khẩu thành công"}

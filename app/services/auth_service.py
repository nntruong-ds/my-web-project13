from fastapi import HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.utils.hash_md5 import hash_password, verify_password
from app.utils.jwt_handler import create_access_token
from app.utils.email_sender import send_reset_email
from datetime import datetime, timedelta
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
        text("SELECT * FROM users WHERE TenDangNhap=:u"),
        {"u": data.username}
    ).fetchone()

    if not user:
        raise HTTPException(404, "Không tìm thấy người dùng")

    nhanvien = db.execute(
        text("""
            SELECT email
            FROM nhan_vien
            WHERE ma_nhan_vien = :ma
        """),
        {"ma": data.username}
    ).fetchone()

    if not nhanvien or not nhanvien.email:
        raise HTTPException(404, "Nhân viên chưa có email")

    # So khớp email
    if nhanvien.email.lower() != data.email.lower():
        raise HTTPException(400, "Email không khớp với hệ thống")

    # Tạo OTP (6 số)
    otp = str(random.randint(100000, 999999))
    key = user.TenDangNhap.upper()

    # OTP sống 1 phút
    otp_cache[key] = {
        "otp": otp,
        "expire_at": datetime.utcnow() + timedelta(minutes=1)
    }

    print("OTP CACHE AFTER SEND:", otp_cache)  # debug

    send_reset_email(nhanvien.email, otp, debug=False)

    return {"message": "OTP đã được gửi đến email (hiệu lực 1 phút)"}


def reset_password_service(data, db: Session):
    key = data.username.upper()
    record = otp_cache.get(key)

    print("OTP CACHE WHEN RESET:", otp_cache)  # debug
    print("KEY:", key)
    print("OTP INPUT:", data.otp)

    # Không tồn tại OTP
    if not record:
        raise HTTPException(400, "OTP không tồn tại hoặc đã hết hạn")

    #  Hết hạn OTP
    if datetime.utcnow() > record["expire_at"]:
        del otp_cache[key]
        raise HTTPException(400, "OTP đã hết hạn")

    #  Sai OTP
    if record["otp"] != str(data.otp):
        raise HTTPException(400, "OTP không hợp lệ")

    # 🔎 Lấy mật khẩu cũ
    user = db.execute(
        text("SELECT MatKhau FROM users WHERE TenDangNhap=:u"),
        {"u": key}
    ).fetchone()

    if not user:
        raise HTTPException(404, "Người dùng không tồn tại")

    #  Mật khẩu mới trùng cũ
    if verify_password(data.new_password, user.MatKhau):
        raise HTTPException(400, "Mật khẩu mới không được trùng mật khẩu cũ")

    # Hash & update mật khẩu
    hashed_new = hash_password(data.new_password)

    db.execute(
        text("""
            UPDATE users
            SET MatKhau = :newpass
            WHERE TenDangNhap = :username
        """),
        {
            "newpass": hashed_new,
            "username": key
        }
    )

    db.commit()

    # Xóa OTP sau khi dùng
    del otp_cache[key]

    return {"message": "Đặt lại mật khẩu thành công"}

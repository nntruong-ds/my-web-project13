from sqlalchemy import text
from app.schemas.email_schema import InternalEmailRequest

# ===============================
# GỬI EMAIL NỘI BỘ
# ===============================
def send_internal_email_service(data: InternalEmailRequest, user, db):
    sender_ma_nv = user.TenDangNhap

    # kiểm tra NV nhận có tồn tại không
    receiver = db.execute(
        text("""
            SELECT ma_nhan_vien
            FROM nhan_vien
            WHERE ma_nhan_vien = :ma
        """),
        {"ma": data.receiver_ma_nv}
    ).fetchone()

    if not receiver:
        raise Exception("Nhân viên nhận không tồn tại")

    # lưu vào inbox nội bộ
    db.execute(
        text("""
            INSERT INTO email_logs
            (sender_ma_nv, receiver_ma_nv, subject, content)
            VALUES (:s, :r, :sub, :c)
        """),
        {
            "s": sender_ma_nv,
            "r": data.receiver_ma_nv,
            "sub": data.subject,
            "c": data.content
        }
    )
    db.commit()

    return {
        "message": "Gửi email nội bộ thành công",
        "from": sender_ma_nv,
        "to": data.receiver_ma_nv
    }


# ===============================
# INBOX CỦA NHÂN VIÊN
# ===============================
def inbox_service(user, db):
    ma_nv = user.TenDangNhap

    emails = db.execute(
        text("""
            SELECT id, sender_ma_nv, subject, content, created_at, is_read
            FROM email_logs
            WHERE receiver_ma_nv = :ma
            ORDER BY created_at DESC
        """),
        {"ma": ma_nv}
    ).fetchall()

    return {
        "total": len(emails),
        "emails": [
            {
                "id": e.id,
                "from": e.sender_ma_nv,
                "subject": e.subject,
                "content": e.content,
                "time": e.created_at,
                "is_read": e.is_read
            } for e in emails
        ]
    }


# ===============================
# ĐÁNH DẤU ĐÃ ĐỌC
# ===============================
def mark_as_read_service(email_id: int, user, db):
    ma_nv = user.TenDangNhap

    result = db.execute(
        text("""
            UPDATE email_logs
            SET is_read = TRUE
            WHERE id = :id AND receiver_ma_nv = :ma
        """),
        {"id": email_id, "ma": ma_nv}
    )

    db.commit()

    if result.rowcount == 0:
        raise Exception("Email không tồn tại hoặc không có quyền")

    return {"message": "Đã đánh dấu email là đã đọc"}

def sent_items_service(user, db):
    ma_nv = user.TenDangNhap

    emails = db.execute(
        text("""
            SELECT id, receiver_ma_nv, subject, content, created_at
            FROM email_logs
            WHERE sender_ma_nv = :ma
            ORDER BY created_at DESC
        """),
        {"ma": ma_nv}
    ).fetchall()

    return {
        "total": len(emails),
        "emails": [
            {
                "id": e.id,
                "to": e.receiver_ma_nv,
                "subject": e.subject,
                "content": e.content,
                "time": e.created_at
            } for e in emails
        ]
    }

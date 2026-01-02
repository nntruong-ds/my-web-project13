from sqlalchemy.orm import Session
from sqlalchemy import text


def get_qua_trinh_cong_tac(
    db: Session,
    ma_nhan_vien: str
):
    rows = db.execute(
        text("""
            SELECT
                phong_ban_id,
                chuc_vu,
                tu_ngay,
                den_ngay,
                chi_nhanh,
                dia_diem,
                thang
            FROM qua_trinh_cong_tac
            WHERE ma_nhan_vien = :ma
            ORDER BY tu_ngay DESC
        """),
        {"ma": ma_nhan_vien}
    ).fetchall()

    if not rows:
        return {
            "message": "Chưa có dữ liệu quá trình công tác",
            "data": []
        }

    return {
        "message": "Lấy quá trình công tác thành công",
        "data": [
            {
                "phong_ban_id": r.phong_ban_id,
                "chuc_vu": r.chuc_vu,
                "tu_ngay": r.tu_ngay,
                "den_ngay": r.den_ngay,
                "chi_nhanh": r.chi_nhanh,
                "dia_diem": r.dia_diem,
                "thang": r.thang
            }
            for r in rows
        ]
    }

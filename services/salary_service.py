from sqlalchemy.orm import Session
from sqlalchemy import text

def get_salary(db: Session, ma_nv: str, thang: int, nam: int):
    row = db.execute(
        text("""
            SELECT 
                ma_nhan_vien,
                thang,
                nam,
                luong_co_ban,
                phu_cap,
                thuong,
                luong_no_thang_truoc,
                tong_luong,
                he_so_luong,
                bhyt,
                bhxh,
                phat
            FROM luong
            WHERE ma_nhan_vien = :ma
              AND thang = :thang
              AND nam = :nam
        """),
        {
            "ma": ma_nv,
            "thang": thang,
            "nam": nam
        }
    ).fetchone()

    if not row:
        raise ValueError("Chưa có dữ liệu lương tháng này")

    # ✅ CONVERT ROW → DICT (FASTAPI SERIALIZE ĐƯỢC)
    return {
        "ma_nhan_vien": row.ma_nhan_vien,
        "thang": row.thang,
        "nam": row.nam,
        "luong_co_ban": row.luong_co_ban,
        "phu_cap": row.phu_cap,
        "thuong": row.thuong,
        "luong_no_thang_truoc": row.luong_no_thang_truoc,
        "tong_luong": row.tong_luong,
        "he_so_luong": row.he_so_luong,
        "bhyt": row.bhyt,
        "bhxh": row.bhxh,
        "phat": row.phat
    }

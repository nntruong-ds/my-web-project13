from sqlalchemy.orm import Session
from sqlalchemy import text

def get_salary(db: Session, ma_nv: str, thang: int, nam: int):
    row = db.execute(
        text("""
            SELECT 
                l.ma_nhan_vien,
                nv.ho_ten,
                nv.chuc_vu_id,
                l.thang,
                l.nam,
                l.luong_co_ban,
                l.phu_cap,
                l.thuong,
                l.luong_no_thang_truoc,
                l.tong_luong,
                l.he_so_luong,
                l.bhyt,
                l.bhxh,
                l.phat
            FROM luong l
            JOIN nhan_vien nv 
                ON l.ma_nhan_vien = nv.ma_nhan_vien
            WHERE l.ma_nhan_vien = :ma
              AND l.thang = :thang
              AND l.nam = :nam
        """),
        {
            "ma": ma_nv,
            "thang": thang,
            "nam": nam
        }
    ).fetchone()

    if not row:
        raise ValueError("Chưa có dữ liệu lương tháng này")

    return {
        "ma_nhan_vien": row.ma_nhan_vien,
        "ho_ten": row.ho_ten,
        "chuc_vu_id": row.chuc_vu_id,
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

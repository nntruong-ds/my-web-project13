from sqlalchemy.orm import Session
from sqlalchemy import text

def get_thuong_kpi_theo_thang(
    db: Session,
    thang: int,
    nam: int
):
    rows = db.execute(
        text("""
            SELECT
                ma_nhan_vien,
                ngay,
                so_tien,
                ly_do
            FROM khen_thuong_ky_luat
            WHERE loai = 'Khen thưởng'
              AND hinh_thuc = 'Thưởng KPI'
              AND thang = :thang
        """),
        {"thang": thang}
    ).fetchall()

    return [
        {
            "ma_nhan_vien": r.ma_nhan_vien,
            "ngay": r.ngay,
            "so_tien": r.so_tien,
            "ly_do": r.ly_do
        }
        for r in rows
    ]


def get_thuong_kpi_me(
    db: Session,
    ma_nhan_vien: str,
    thang: int
):
    row = db.execute(
        text("""
            SELECT
                so_tien,
                ngay,
                ly_do
            FROM khen_thuong_ky_luat
            WHERE ma_nhan_vien = :ma
              AND loai = 'Khen thưởng'
              AND hinh_thuc = 'Thưởng KPI'
              AND thang = :thang
        """),
        {"ma": ma_nhan_vien, "thang": thang}
    ).fetchone()

    if not row:
        return {"dat_kpi": False}

    return {
        "dat_kpi": True,
        "so_tien": row.so_tien,
        "ngay": row.ngay,
        "ly_do": row.ly_do
    }

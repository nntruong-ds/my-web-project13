from sqlalchemy.orm import Session
from sqlalchemy import text

def get_upcoming_birthdays(db: Session):
    sql = text("""
        SELECT 
            ho_ten,
            DATE_FORMAT(ngay_sinh, '%d/%m') AS sinh_nhat,
            ma_nhan_vien
        FROM nhan_vien
        WHERE MONTH(ngay_sinh) = MONTH(CURDATE())
        ORDER BY DAY(ngay_sinh);
    """)
    
    result = db.execute(sql).fetchall()

    return [
        {
            "ho_ten": row[0],
            "sinh_nhat": row[1],
            "ma_nhan_vien": row[2]
        }
        for row in result
    ]

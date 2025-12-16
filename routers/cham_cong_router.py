from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.configs.database import get_db
from app.schemas.cham_cong_schema import CheckInSchema, CheckOutSchema
from app.services.cham_cong_service import check_in, check_out
from app.services.bang_cong_service import tinh_bang_cong

router = APIRouter(prefix="/attendance", tags=["Attendance"])

@router.post("/checkin")
def api_check_in(data: CheckInSchema, db: Session = Depends(get_db)):
    return check_in(db, data.ma_nhan_vien)

@router.post("/checkout")
def api_check_out(data: CheckOutSchema, db: Session = Depends(get_db)):
    return check_out(db, data.ma_nhan_vien)

@router.get("/summary")
def api_summary(ma_nhan_vien: str, month: int, year: int, db: Session = Depends(get_db)):
    return tinh_bang_cong(db, ma_nhan_vien, month, year)

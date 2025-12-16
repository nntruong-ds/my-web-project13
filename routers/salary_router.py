from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.configs.database import get_db
from app.services.salary_service import tinh_luong

router = APIRouter(prefix="/salary", tags=["Salary"])

@router.get("/calculate")
def calculate_salary(ma_nhan_vien: str, month: int, year: int, db: Session = Depends(get_db)):
    return tinh_luong(db, ma_nhan_vien, month, year)

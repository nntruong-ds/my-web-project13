from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.configs.database import get_db
from app.utils.deps import get_current_user
from app.services.salary_service import get_salary

router = APIRouter(prefix="/salary", tags=["Salary"])


@router.get("")
def get_salary_api(
    ma_nhan_vien: str,
    thang: int,
    nam: int,
    db: Session = Depends(get_db)
):
    try:
        return get_salary(db, ma_nhan_vien, thang, nam)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.get("/me")
def get_salary_me(
    thang: int,
    nam: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    try:
        return get_salary(db, current_user.TenDangNhap, thang, nam)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

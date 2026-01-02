from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.configs.database import get_db
from app.utils.deps import get_current_user
from app.services.reward_service import (
    get_thuong_kpi_theo_thang,
    get_thuong_kpi_me
)

router = APIRouter(prefix="/reward", tags=["Khen thưởng"])


# ADMIN
@router.get("/kpi")
def get_thuong_kpi_admin(
    thang: int,
    nam: int,
    db: Session = Depends(get_db)
):
    return get_thuong_kpi_theo_thang(db, thang, nam)


# NHÂN VIÊN
@router.get("/me")
def get_thuong_kpi_me_api(
    thang: int,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    ma_nv = current_user.TenDangNhap
    return get_thuong_kpi_me(db, ma_nv, thang)

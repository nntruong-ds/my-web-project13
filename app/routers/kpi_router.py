from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.configs.database import get_db
from app.utils.deps import get_current_user
from app.services.kpi_service import (
    get_kpi_nhan_vien,
    update_kpi_chuyen_can
)

router = APIRouter(prefix="/kpi", tags=["KPI"])

@router.get("/admin")
def get_kpi_admin(
    ma_nhan_vien: str,
    thang: int,
    nam: int,
    db: Session = Depends(get_db)
):
    return get_kpi_nhan_vien(db, ma_nhan_vien, thang, nam)

@router.get("/me")
def get_kpi_me(
    thang: int,
    nam: int,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    ma_nv = current_user.TenDangNhap
    return get_kpi_nhan_vien(db, ma_nv, thang, nam)

@router.post("/update/chuyen-can")
def update_kpi_chuyen_can_api(
    ma_nhan_vien: str,
    thang: int,
    nam: int,
    ghi_chu: str | None = None,
    db: Session = Depends(get_db)
):
    return update_kpi_chuyen_can(
        db=db,
        ma_nhan_vien=ma_nhan_vien,
        thang=thang,
        nam=nam,
        ghi_chu=ghi_chu
    )

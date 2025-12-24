from fastapi import APIRouter, Depends, HTTPException, Header
from app.utils.jwt_handler import verify_access_token
from sqlalchemy.orm import Session

from app.configs.database import get_db
from app.utils.deps import get_current_user
from app.services.cham_cong_service import (
    check_in,
    check_out,
    get_cham_cong
)

router = APIRouter(prefix="/cham-cong", tags=["ChamCong"])


@router.post("/check-in")
def check_in_api(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    try:
        return check_in(db, current_user.TenDangNhap)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/check-out")
def check_out_api(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    try:
        return check_out(db, current_user.TenDangNhap)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("")
def get_cham_cong_api(
    ma_nhan_vien: str,
    thang: int,
    nam: int,
    db: Session = Depends(get_db)
):
    return get_cham_cong(db, ma_nhan_vien, thang, nam)

@router.get("/me")
def get_cham_cong_me(
    thang: int,
    nam: int,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    ma_nv = current_user.TenDangNhap
    return get_cham_cong(db, ma_nv, thang, nam)


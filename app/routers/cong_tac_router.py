from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.configs.database import get_db
from app.utils.deps import get_current_user
from app.services.cong_tac_service import get_qua_trinh_cong_tac

router = APIRouter(
    prefix="/qua-trinh-cong-tac",
    tags=["Quá trình công tác"]
)


# =====================================================
# ADMIN – XEM QUÁ TRÌNH CÔNG TÁC CỦA NHÂN VIÊN
# =====================================================
@router.get("/admin")
def get_qua_trinh_cong_tac_admin(
    ma_nhan_vien: str,
    db: Session = Depends(get_db)
):
    return get_qua_trinh_cong_tac(db, ma_nhan_vien)


# =====================================================
# NHÂN VIÊN – XEM QUÁ TRÌNH CÔNG TÁC CỦA CHÍNH MÌNH
# =====================================================
@router.get("/me")
def get_qua_trinh_cong_tac_me(
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    ma_nv = current_user.TenDangNhap
    return get_qua_trinh_cong_tac(db, ma_nv)

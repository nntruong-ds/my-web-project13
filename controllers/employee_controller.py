from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.configs.database import get_db
from app.services import employee_service
from app.schemas.employee_schema import EmployeeProfile, EmployeeUpdateRequest

router = APIRouter(prefix="/employee", tags=["Employee"])

# Xem hồ sơ cá nhân
@router.get("/profile", response_model=EmployeeProfile)
def view_profile(username: str, db: Session = Depends(get_db)):
    profile = employee_service.get_profile(db, username)
    if not profile:
        raise HTTPException(status_code=404, detail="Không tìm thấy nhân viên")
    return profile

# Cập nhật hồ sơ cá nhân
@router.put("/profile", response_model=EmployeeProfile)
def edit_profile(username: str, data: EmployeeUpdateRequest, db: Session = Depends(get_db)):
    return employee_service.update_profile(
        db=db,
        username=username,
        email=data.email,
        so_dien_thoai=data.so_dien_thoai,
        dia_chi=data.dia_chi
    )

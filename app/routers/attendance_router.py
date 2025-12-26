from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from app.configs.database import get_db
from app.controllers.attendance_controller import AttendanceController
from app.schemas.attendance_schema import *

router = APIRouter(prefix="/attendance", tags=["Attendance - Chấm công"])

# API Check-in
@router.post("/check-in", response_model=AttendanceResponse)
def check_in(
    request: CheckInRequest, 
    db: Session = Depends(get_db)
):
    """
    Nhân viên bấm nút Check-in.
    - Input: Mã nhân viên (trong body JSON)
    - Output: Thông tin dòng chấm công vừa tạo
    """
    return AttendanceController.check_in(db, request)

# API Check-out
@router.post("/check-out", response_model=AttendanceResponse)
def check_out(
    request: CheckOutRequest, 
    db: Session = Depends(get_db)
):
    """
    Nhân viên bấm nút Check-out.
    - Input: Mã nhân viên
    - Output: Thông tin chấm công đã cập nhật giờ ra, giờ làm, lỗi vi phạm...
    """
    return AttendanceController.check_out(db, request)

# API Xem lịch sử
@router.get("/", response_model=List[AttendanceResponse])
def get_history(
    ma_nhan_vien: Optional[str] = Query(None, description="Lọc theo mã nhân viên"),
    thang: Optional[int] = Query(None, description="Lọc theo tháng (1-12)"),
    nam: Optional[int] = Query(None, description="Lọc theo năm"),
    db: Session = Depends(get_db)
):
    """
    Xem lịch sử chấm công.
    - Có thể lọc theo Mã NV, Tháng, Năm.
    - Nếu không truyền gì sẽ lấy toàn bộ.
    """
    return AttendanceController.get_history(db, ma_nhan_vien, thang, nam)

# API sửa chấm công
@router.post("/admin/update", response_model=AttendanceResponse)
def admin_update_attendance(
    request: AttendanceUpdate, 
    db: Session = Depends(get_db)
):
    """
    Admin sửa công hoặc thêm công bổ sung cho nhân viên.
    """
    return AttendanceController.admin_update(db, request)

# API Xóa (DELETE)
@router.delete("/delete", status_code=200)
def delete_attendance(
    ma_nhan_vien: str = Query(..., description="Mã nhân viên cần xóa"),
    ngay: date = Query(..., description="Ngày cần xóa (YYYY-MM-DD)"),
    db: Session = Depends(get_db)
):
    """
    Xóa một dòng chấm công cụ thể.
    - Cần cung cấp Mã NV và Ngày.
    - Hành động này sẽ xóa vĩnh viễn khỏi Database.
    """
    return AttendanceController.delete_attendance(db, ma_nhan_vien, ngay)
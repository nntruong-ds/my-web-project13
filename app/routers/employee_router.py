from fastapi import APIRouter, Depends, Query
from typing import Optional
from sqlalchemy.orm import Session
from app.configs.database import get_db
from app.controllers.employee_controller import EmployeeController
from app.schemas.employee_schema import *

# Tạo router riêng cho employee
router = APIRouter(prefix="/employees", tags=["Employees"])

# API: Lấy thông tin chi tiết 1 nhân viên
@router.get("/{ma_nhan_vien}", response_model=EmployeeResponse)
def get_employee_detail(id: str, db: Session = Depends(get_db)):
    return EmployeeController.get_employee(db, id)

# API Lấy danh sách (Search & Filter)
# URL sẽ dạng: /employees?macn=1&keyword=Nguyen
@router.get("/", response_model=list[EmployeeResponse])
def get_employees(
    macn: Optional[int] = Query(None, description="Lọc theo ID Chi nhánh"),
    mapb: Optional[str] = Query(None, description="Lọc theo ID Phòng ban"),
    chucvu: Optional[str] = Query(None, description="Lọc theo Mã chức vụ"),
    keyword: Optional[str] = Query(None, description="Tìm kiếm theo Tên hoặc Mã NV"),
    db: Session = Depends(get_db)
):
    return EmployeeController.get_list(db, macn, mapb, chucvu, keyword)

# API Tạo mới (POST)
@router.post("/", response_model=EmployeeResponse)
def create_employee(data: EmployeeCreate, db: Session = Depends(get_db)):
    return EmployeeController.create(db, data)

# API: Cập nhật thông tin nhân viên
@router.put("/{ma_nhan_vien}", response_model=EmployeeResponse)
def update_employee(id: str, data: EmployeeUpdate, db: Session = Depends(get_db)):
    return EmployeeController.update_employee(db, id, data)

# API Xóa (DELETE)
@router.delete("/{ma_nhan_vien}")
def delete_employee(ma_nhan_vien: str, db: Session = Depends(get_db)):
    return EmployeeController.delete(db, ma_nhan_vien)
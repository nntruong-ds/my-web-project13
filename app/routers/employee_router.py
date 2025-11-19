from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.configs.database import get_db
from app.controllers.employee_controller import EmployeeController
from app.schemas.employee_schema import EmployeeResponse, EmployeeUpdate

# Tạo router riêng cho employee
router = APIRouter(prefix="/employees", tags=["Employees"])

# API: Lấy thông tin chi tiết 1 nhân viên
@router.get("/{ma_nhan_vien}", response_model=EmployeeResponse)
def get_employee_detail(id: str, db: Session = Depends(get_db)):
    return EmployeeController.get_profile_employee(db, id)

# API: Cập nhật thông tin nhân viên
@router.put("/{ma_nhan_vien}", response_model=EmployeeResponse)
def update_employee(id: str, data: EmployeeUpdate, db: Session = Depends(get_db)):
    return EmployeeController.update_employee(db, id, data)
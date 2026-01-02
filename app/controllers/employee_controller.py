from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.services.employee_service import EmployeeService
from app.schemas.employee_schema import *

class EmployeeController:
    @staticmethod
    def create(db: Session, data: EmployeeCreate):
        return EmployeeService.create_employee(db, data)

    @staticmethod
    def update_employee(db: Session, id: str, data: EmployeeUpdate):
        # Service sẽ raise ValueError nếu dữ liệu sai (lỗi 400) -> Global Handler lo
        employee = EmployeeService.update_profile_employee(db, id, data)
        
        # Controller chỉ lo trường hợp Không tìm thấy (lỗi 404)
        if employee is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Nhân viên không tồn tại"
            )
        return employee

    @staticmethod
    def delete(db: Session, manv: str):
        result = EmployeeService.delete_employee(db, manv)
        if not result:
            raise HTTPException(status_code=404, detail="Nhân viên không tồn tại")
        return {"message": "Xóa nhân viên thành công"}
    
    @staticmethod
    def get_employee(db: Session, id: str):
        employee = EmployeeService.get_employee_by_id(db, id)
        if not employee:
            raise HTTPException(
                status_code=404,
                detail=f"Không tìm thấy nhân viên {id}")
        return employee
    
    @staticmethod
    def get_list(db: Session, macn: int = None, mapb: str = None, chucvu: str = None, keyword: str = None):
        return EmployeeService.get_list_employees(db, macn, mapb, chucvu, keyword)
    
    @staticmethod
    def import_excel(db: Session, file_content: bytes):
        return EmployeeService.import_from_excel(db, file_content)
from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from app.services.employee_service import EmployeeService
from app.schemas.employee_schema import *

class EmployeeController:
    @staticmethod
    def get_employee(db: Session, id: str):
        employee = EmployeeService.get_employee_by_id(db, id)

        if not employee:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Không tìm thấy nhân viên có mã {id}"
            )
        
        return employee

    @staticmethod
    def update_employee(db: Session, id: str, data: EmployeeUpdate):
        try:
            employee = EmployeeService.update_profile_employee(db, id, data)
            
            if employee is None:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Nhân viên không tồn tại"
                )
                
            return employee

        except ValueError as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=str(e)
            )
        
    @staticmethod
    def get_list(db: Session, macn: int = None, mapb: str = None, chucvu: str = None, keyword: str = None):
        return EmployeeService.get_list_employees(db, macn, mapb, chucvu, keyword)

    @staticmethod
    def create(db: Session, data: EmployeeCreate):
        try:
            return EmployeeService.create_employee(db, data)
        except ValueError as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, 
                detail=str(e))

    @staticmethod
    def delete(db: Session, manv: str):
        result = EmployeeService.delete_employee(db, manv)
        if not result:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Nhân viên không tồn tại")
        
        return {"message": "Xóa nhân viên thành công"}
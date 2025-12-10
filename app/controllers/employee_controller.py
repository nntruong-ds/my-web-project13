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
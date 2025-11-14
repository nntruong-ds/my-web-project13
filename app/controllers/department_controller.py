from sqlalchemy.orm import Session
from app.services.department_service import DepartmentService
from app.schemas.department_schema import DepartmentCreate, DepartmentResponse

class DepartmentController:
    @staticmethod
    def  create_department(db: Session, data: DepartmentCreate) -> DepartmentResponse:
        try:
            return DepartmentService.create_department(db, data)
        except ValueError as e:
            raise Exception(str(e))
        
    @staticmethod
    def get_all_departments(db: Session):
        return DepartmentService.get_all_departments(db)
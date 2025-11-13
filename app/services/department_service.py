from sqlalchemy.orm import Session
from app.models.department import Department
from app.schemas.department_schema import DepartmentCreate, DepartmentResponse

class DepartmentService:
    @staticmethod
    def create_department(db: Session, dept_data: DepartmentCreate) -> DepartmentResponse:
        department = Department(department_name = dept_data.department_name)
        db.add(department)
        db.commit()
        db.refresh(department)
        return DepartmentResponse.from_orm(department)
    
    @staticmethod
    def get_all_departments(db: Session):
        departments = db.query(Department).all()
        return [DepartmentResponse.from_orm(d) for d in departments]
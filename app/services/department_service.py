from sqlalchemy.orm import Session
from app.models.department import Department
from app.schemas.department_schema import DepartmentCreate, DepartmentResponse

class DepartmentService:

    # Tạo phòng ban mới
    @staticmethod
    def create_department(db: Session, data: DepartmentCreate) -> DepartmentResponse:
        department = Department(department_id = data.department_id, 
                                department_name = data.department_name,
                                # head_id = data.head_id,
                                branch_id = data.branch_id)
    
        db.add(department)
        db.commit()
        db.refresh(department)
        return DepartmentResponse.from_orm(department)
    
    # Lấy danh sách phòng ban
    @staticmethod
    def get_all_departments(db: Session):
        departments = db.query(Department).all()
        return [DepartmentResponse.from_orm(d) for d in departments]
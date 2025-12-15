from sqlalchemy.orm import Session
from app.models.branch import Branch
from app.models.department import Department
from app.models.employee import Employee
from app.schemas.department_schema import *
from app.services.branch_service import BranchService
from sqlalchemy.orm import joinedload

class DepartmentService:
    # Lấy danh sách phòng ban
    @staticmethod
    def get_all_departments(db: Session, macn: int = None):
        query = db.query(Department)
        query = query.options(
            joinedload(Department.truong_phong), 
            joinedload(Department.ds_nhan_vien)
        )        

        if macn is not None:
            query = query.filter(Department.ma_cn == macn)
        
        departments = query.all()
        return [DepartmentResponse.model_validate(d) for d in departments]
    
    # Lấy thông tin phòng ban
    @staticmethod
    def get_department_by_id(db: Session, id: str):
        department = DepartmentService.get_department_orm(db, id)
        if not department:
            return None
        return DepartmentResponse.model_validate(department)

    # Thêm phòng ban mới
    @staticmethod
    def create_department(db: Session, data: DepartmentCreate):
        # Check chi nhánh tồn tại
        if not BranchService.get_branch_by_id(db, data.ma_cn):
            raise ValueError(f"Chi nhánh {data.ma_cn} không tồn tại!")

        # Check phòng ban đã tồn tại chưa
        department = DepartmentService.get_department_orm(db, data.mapb)
        if department:
            raise ValueError(f"Phòng {department.mapb} đã tồn tại!")

        # Check Trưởng phòng tồn tại (nếu có nhập)
        if data.truong_phong_id:
            # Lấy thông tin của nhân viên được chỉ định làm trưởng phòng
            manager = db.query(Employee).filter(Employee.ma_nhan_vien == data.truong_phong_id).first()

            # Check tồn tại
            if not manager:
                raise ValueError(f"Nhân viên {data.truong_phong_id} không tồn tại!")
            
            # Check xem nhân viên có thuộc chi nhánh này không
            if manager.chinhanh_id != data.ma_cn:
                raise ValueError(f"Nhân viên {manager.ho_ten} thuộc chi nhánh khác (ID: {manager.chinhanh_id}), không thể làm trưởng phòng tại chi nhánh này (ID: {data.ma_cn})!")
            
            # Check xem Trưởng phòng đã quản lý phòng ban nào chưa
            head = db.query(Department).filter(Department.truong_phong_id == data.truong_phong_id).first()
            if head:
                raise ValueError(f"Ông {head.ten_truong_phong} đang làm Trưởng phòng tại phòng '{head.ten_phong}'. Một người không thể quản lý 2 phòng ban!")
    
        # Tạo mới
        new_department = Department(**data.model_dump())
        db.add(new_department)
        db.commit()
        db.refresh(new_department)
        return DepartmentResponse.model_validate(new_department)

    # Cập nhật thông tin phòng ban
    @staticmethod
    def update_department(db: Session, mapb: str, data: DepartmentUpdate):
        department = DepartmentService.get_department_orm(db, mapb)
        if not department:
            return None
                
        # Nếu người dùng gửi mã chi nhánh mới thì dùng mã chi nhánh mới, không thì dùng mã chi nhánh cũ
        target_branch_id = data.ma_cn if data.ma_cn is not None else department.ma_cn
        
        # Nếu người dùng gửi mã trưởng phòng mới thì dùng mã trưởng phòng mới, không thì dùng mã trưởng phòng cũ
        target_manager_id = data.truong_phong_id if data.truong_phong_id is not None else department.truong_phong_id

        # Nếu có sự thay đổi về Chi nhánh hoặc Trưởng phòng, ta cần check lại tính hợp lệ
        if data.ma_cn is not None or data.truong_phong_id is not None:
            
            # Check chi nhánh tồn tại (nếu có gửi lên)
            if data.ma_cn is not None:
                if not BranchService.get_branch_by_id(db, data.ma_cn):
                    raise ValueError(f"Chi nhánh '{data.ma_cn}' không tồn tại.")

            # Check logic Trưởng phòng thuộc Chi nhánh
            if target_manager_id: # Nếu phòng ban này có trưởng phòng
                manager = db.query(Employee).filter(Employee.ma_nhan_vien == target_manager_id).first()

                # Check trưởng phòng tồn tại
                if not manager:
                     raise ValueError(f"Nhân viên {target_manager_id} không tồn tại!")
                
                # Check trưởng phòng mới đã cùng chi nhánh với phòng ban chưa
                if manager.chinhanh_id != target_branch_id:
                     raise ValueError(f"Mâu thuẫn: Nhân viên {manager.ho_ten} thuộc chi nhánh {manager.chinhanh_id}, nhưng phòng ban lại thuộc chi nhánh {target_branch_id}.")

                # Check trùng trưởng phòng (Chỉ check nếu bổ nhiệm người MỚI)
                if data.truong_phong_id is not None: 
                    # Tìm xem ông này có làm trưởng phòng ở đâu khác không (trừ chính phòng này ra)
                    head = db.query(Department).filter(
                        Department.truong_phong_id == target_manager_id,
                        Department.mapb != mapb # Trừ bản thân phòng đang sửa
                    ).first()
                    
                    if head:
                        raise ValueError(f"Ông {head.ten_truong_phong} đang làm Trưởng phòng bên '{head.ten_phong}'.")

        # Cập nhật dữ liệu
        if data.ma_cn is not None: department.ma_cn = data.ma_cn
        if data.ten_phong is not None: department.ten_phong = data.ten_phong
        if data.truong_phong_id is not None: department.truong_phong_id = data.truong_phong_id
        if data.ngay_tao is not None: department.ngay_tao = data.ngay_tao

        db.commit()
        db.refresh(department)
        return DepartmentResponse.model_validate(department)
    
    # Xóa phòng ban
    @staticmethod
    def delete_department(db: Session, mapb: str):
        department = DepartmentService.get_department_orm(db, mapb)
        if not department:
            return False
        
        db.delete(department)
        db.commit()
        return True

    # Truy vấn phòng ban theo mapb
    @staticmethod
    def get_department_orm(db: Session, id: str):
        return db.query(Department).filter(Department.mapb == id).first()
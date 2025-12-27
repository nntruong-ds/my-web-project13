from sqlalchemy.orm import Session, joinedload

from app.models.branch import Branch
from app.models.department import Department
from app.models.employee import Employee
from app.schemas.department_schema import *
from app.services.branch_service import BranchService

class DepartmentService:
    # Truy vấn phòng ban theo mapb
    @staticmethod
    def get_department_orm(db: Session, id: str):
        return db.query(Department).filter(Department.mapb == id).first()
    
    # Lấy thông tin phòng ban
    @staticmethod
    def get_department_by_id(db: Session, id: str):
        department = DepartmentService.get_department_orm(db, id)
        if not department:
            return None
        return DepartmentResponse.model_validate(department)

    # Lấy danh sách phòng ban
    @staticmethod
    def get_all_departments(db: Session, macn: int = None):
        query = db.query(Department)

        # Hiển thị tên trưởng phòng và số lượng nhân viên
        query = query.options(
            joinedload(Department.truong_phong), 
            joinedload(Department.ds_nhan_vien)
        )        

        if macn is not None:
            query = query.filter(Department.ma_cn == macn)
        
        departments = query.all()
        return [DepartmentResponse.model_validate(d) for d in departments]
    
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
        
        # lưu lại mã trưởng phòng hiện tại (Trước khi bị ghi đè bởi data mới)
        current_manager_id = department.truong_phong_id

        # Lấy dict các trường có gửi lên (loại bỏ các trường None)
        # exclude_unset=True: Chỉ lấy những gì user gửi
        update_data = data.model_dump(exclude_unset=True)
                
        # Nếu người dùng gửi mã mới thì dùng mã chi nhánh mới, không thì dùng mã cũ
        target_branch_id = update_data.get("ma_cn", department.ma_cn)
        target_manager_id = update_data.get("truong_phong_id", department.truong_phong_id)

        # Kiểm tra Chi nhánh tồn tại (nếu có cập nhật chi nhánh mới)
        if "ma_cn" in update_data:
            if not BranchService.get_branch_by_id(db, target_branch_id):
                raise ValueError(f"Chi nhánh '{target_branch_id}' không tồn tại.")

        # Kiểm tra logic Trưởng phòng (nếu có thay đổi Trưởng phòng HOẶC Chi nhánh)
        if "truong_phong_id" in update_data or "ma_cn" in update_data:
            if target_manager_id:
                manager = db.query(Employee).filter(Employee.ma_nhan_vien == target_manager_id).first()
                
                # Check trưởng phòng tồn tại
                if not manager:
                    raise ValueError(f"Nhân viên '{target_manager_id}' không tồn tại.")
                
                # Check Trưởng phòng phải thuộc cùng Chi nhánh với phòng ban
                if manager.chinhanh_id != target_branch_id:
                    raise ValueError(f"Nhân viên {manager.ho_ten} thuộc chi nhánh {manager.chinhanh_id}, không cùng chi nhánh với phòng ban ({target_branch_id}).")

                # Check trùng trưởng phòng (Chỉ check nếu bổ nhiệm người MỚI)
                if "truong_phong_id" in update_data:
                    # Tìm xem ông này có làm trưởng phòng ở đâu khác không (trừ chính phòng này ra)
                    head = db.query(Department).filter(
                        Department.truong_phong_id == target_manager_id,
                        Department.mapb != mapb
                    ).first()
                    if head:
                        raise ValueError(f"Ông/Bà {head.ten_truong_phong} đang làm Trưởng phòng tại '{head.ten_phong}'.")

        # LOGIC ĐỒNG BỘ CHỨC VỤ (MỚI THÊM)
        if "truong_phong_id" in update_data:
            new_manager_id = update_data["truong_phong_id"]

            # Nếu có sự thay đổi người lãnh đạo
            if new_manager_id != current_manager_id:
                
                # Thăng chức cho người MỚI (lên Trưởng phòng)
                if new_manager_id:
                    new_emp = db.query(Employee).filter(Employee.ma_nhan_vien == new_manager_id).first()
                    if new_emp:
                        new_emp.chuc_vu_id = "TP"

                        if new_emp.phong_ban_id != mapb:
                            new_emp.phong_ban_id = mapb

                # Giáng chức người CŨ (về Nhân viên)
                if current_manager_id:
                    old_emp = db.query(Employee).filter(Employee.ma_nhan_vien == current_manager_id).first()
                    if old_emp:
                        old_emp.chuc_vu_id = "NV"

        # Cập nhật dữ liệu
        for key, value in update_data.items():
            setattr(department, key, value)

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
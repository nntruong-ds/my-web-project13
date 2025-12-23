from sqlalchemy.orm import Session
from app.models.branch import Branch
from app.models.employee import Employee
from app.schemas.branch_schema import BranchCreate, BranchUpdate, BranchResponse

class BranchService:
    # Truy vấn chi nhánh theo ma_chi_nhanh
    @staticmethod
    def get_branch_orm(db: Session, macn: int):
        return db.query(Branch).filter(Branch.ma_chi_nhanh == macn).first()

    # Lấy thông tin chi nhánh
    @staticmethod
    def get_branch_by_id(db: Session, id: str):
        branch = BranchService.get_branch_orm(db, id)
        if not branch:
            return None
        return BranchResponse.model_validate(branch)

    # Lấy danh sách chi nhánh
    @staticmethod
    def get_all_branches(db: Session):
        return [BranchResponse.model_validate(b) for b in db.query(Branch).all()]

    # Thêm chi nhánh mới
    @staticmethod
    def create_branch(db: Session, data: BranchCreate):
        # Check chi nhánh đã tồn tại chưa
        branch = BranchService.get_branch_orm(db, data.ma_chi_nhanh)
        if branch:
            raise ValueError(f"Chi nhánh {branch.ten_chi_nhanh} đã tồn tại!")

        # Check Giám đốc tồn tại (nếu có nhập)
        if data.id_gdoc:
            if not db.query(Employee).filter(Employee.ma_nhan_vien == data.id_gdoc).first():
                raise ValueError(f"Giám đốc {data.id_gdoc} không tồn tại!")
            # Check giám đốc có quản lý chi nhánh nào chưa
            director = db.query(Branch).filter(Branch.id_gdoc == data.id_gdoc).first()
            if director:
                raise ValueError(f"Ông {director.ten_giam_doc} đang làm Giám đốc tại chi nhánh '{director.ten_chi_nhanh}'. Một người không thể quản lý 2 chi nhánh!")
        

        # Tạo mới
        new_branch = Branch(**data.model_dump())
        db.add(new_branch)
        db.commit()
        db.refresh(new_branch)
        return BranchResponse.model_validate(new_branch)

    # Cập nhật thông tin chi nhánh
    @staticmethod
    def update_branch(db: Session, branch_id: int, data: BranchUpdate):
        # Check chi nhánh có tồn tại không
        branch = BranchService.get_branch_orm(db, branch_id)
        if not branch:
            return None
        
        # Lấy dữ liệu thực tế người dùng gửi lên
        update_data = data.model_dump(exclude_unset=True)

        # LOGIC KIỂM TRA
        if "id_gdoc" in update_data:
            new_gdoc_id = update_data["id_gdoc"]
            if new_gdoc_id is not None:
                # Kiểm tra Giám đốc tồn tại
                if not db.query(Employee).filter(Employee.ma_nhan_vien == new_gdoc_id).first():
                    raise ValueError(f"Mã giám đốc {new_gdoc_id} không tồn tại!")
                
                # Kiểm tra tính duy nhất (1 người chỉ quản lý 1 chi nhánh)
                director = db.query(Branch).filter(
                    Branch.id_gdoc == new_gdoc_id,
                    Branch.ma_chi_nhanh != branch_id
                ).first()

                if director:
                    raise ValueError(f"Ông/Bà {director.ten_giam_doc} đang làm Giám đốc tại chi nhánh '{director.ten_chi_nhanh}'.")

        # CẬP NHẬT TỰ ĐỘNG
        for key, value in update_data.items():
            setattr(branch, key, value)

        db.commit()
        db.refresh(branch)
        return BranchResponse.model_validate(branch)
    
    # Xóa chi nhánh
    @staticmethod
    def delete_branch(db: Session, branch_id: int):
        branch = BranchService.get_branch_orm(db, branch_id)

        if not branch:
            return False
        
        db.delete(branch)
        db.commit()
        return True
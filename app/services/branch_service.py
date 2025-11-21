from sqlalchemy.orm import Session
from app.models.branch import Branch
from app.models.employee import Employee
from app.schemas.branch_schema import BranchCreate, BranchUpdate, BranchResponse

class BranchService:
    # Lấy danh sách chi nhánh
    @staticmethod
    def get_all_branches(db: Session):
        return [BranchResponse.model_validate(b) for b in db.query(Branch).all()]

    # Truy vấn chi nhánh theo ma_chi_nhanh
    @staticmethod
    def get_branch_orm(db: Session, macn: int):
        return db.query(Branch).filter(Branch.ma_chi_nhanh == macn).first()
    
    # Lấy thông tin chi nhánh
    @staticmethod
    def get_department_by_id(db: Session, id: str):
        department = BranchService.get_branch_orm(db, id)
        if not department:
            return None
        return BranchResponse.model_validate(department)

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

    @staticmethod
    def update_branch(db: Session, branch_id: int, data: BranchUpdate):
        # Check chi nhánh có tồn tại không
        branch = BranchService.get_branch_orm(db, branch_id)
        if not branch:
            return None

        # Check giám đốc mới nếu có update
        if data.id_gdoc is not None:
            # Check giám đốc có tồn tại không
            if not db.query(Employee).filter(Employee.ma_nhan_vien == data.id_gdoc).first():
                raise ValueError(f"Mã giám đốc {data.id_gdoc} không tồn tại!")
            
            # Check người này đã quản lý chi nhánh nào khác chưa
            director = db.query(Branch).filter(
                Branch.id_gdoc == data.id_gdoc,
                Branch.ma_chi_nhanh != branch_id #Bỏ bản thân người đang check
            ).first()

            if director:
                raise ValueError(f"Ông {director.ten_giam_doc} đang làm Giám đốc tại chi nhánh khác ({director.ten_chi_nhanh}). Một người không thể quản lý 2 chi nhánh!!")

            branch.id_gdoc = data.id_gdoc

        if data.ten_chi_nhanh is not None: branch.ten_chi_nhanh = data.ten_chi_nhanh
        if data.dia_chi is not None: branch.dia_chi = data.dia_chi
        if data.so_dien_thoai is not None: branch.so_dien_thoai = data.so_dien_thoai
        if data.email is not None: branch.email = data.email
        if data.ngay_thanh_lap is not None: branch.ngay_thanh_lap = data.ngay_thanh_lap

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
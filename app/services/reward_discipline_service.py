from sqlalchemy.orm import Session, contains_eager
from sqlalchemy import or_, extract, cast, String
import pandas as pd
from io import BytesIO

from app.models.reward_discipline import RewardDiscipline
from app.models.enums import ThuongPhat
from app.models.employee import Employee
from app.schemas.reward_discipline_schema import RewardDisciplineCreate, RewardDisciplineUpdate

class RewardDisciplineService:

    # Tìm kiếm (Lọc theo Loại để dùng cho cả 2 màn hình Khen thưởng & Kỷ luật)
    @staticmethod
    def search(db: Session, keyword=None, thang=None, nam=None, loai=None, mapb=None, macn=None):
        # Join các bảng để lấy thông tin hiển thị
        query = db.query(RewardDiscipline).join(RewardDiscipline.nhan_vien)\
                  .options(contains_eager(RewardDiscipline.nhan_vien))\
                  .outerjoin(Employee.phong_truc_thuoc)\
                  .outerjoin(Employee.chi_nhanh_lam_viec)

        # Filter theo Loại (Khen thưởng / Kỷ luật)
        if loai: 
            query = query.filter(RewardDiscipline.loai == loai)

        # Filter theo thời gian
        if thang: 
            query = query.filter(extract('month', RewardDiscipline.ngay) == thang)
        if nam: 
            query = query.filter(extract('year', RewardDiscipline.ngay) == nam)

        # Filter theo Tổ chức (Phòng ban / Chi nhánh)
        if mapb: 
            query = query.filter(Employee.phong_ban_id == mapb)
        if macn: 
            query = query.filter(Employee.chinhanh_id == macn)
        
        # Tìm kiếm tổng hợp (ID, Mã NV, Tên NV, Lý do)
        if keyword:
            key = f"%{keyword}%"
            # Logic: Tìm ID (chuyển sang string để like) HOẶC Mã NV HOẶC Tên
            query = query.filter(or_(
                cast(RewardDiscipline.id, String).ilike(key), # Tìm theo ID
                Employee.ma_nhan_vien.ilike(key),             # Tìm theo Mã NV
                Employee.ho_ten.ilike(key),                   # Tìm theo Tên
            ))
            
        return query.order_by(RewardDiscipline.ngay.desc()).all()

    # Tạo mới
    @staticmethod
    def create(db: Session, data: RewardDisciplineCreate):
        new_record = RewardDiscipline(**data.model_dump())
        db.add(new_record)
        db.commit()
        db.refresh(new_record)
        return new_record

    # Cập nhật
    @staticmethod
    def update(db: Session, id: int, data: RewardDisciplineUpdate):
        record = db.query(RewardDiscipline).filter(RewardDiscipline.id == id).first()
        if not record:
            raise ValueError("Không tìm thấy quyết định này!")
            
        update_data = data.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(record, key, value)
            
        db.commit()
        db.refresh(record)
        return record

    # Xóa
    @staticmethod
    def delete(db: Session, id: int):
        record = db.query(RewardDiscipline).filter(RewardDiscipline.id == id).first()
        if not record:
            raise ValueError("Không tìm thấy quyết định này!")
        
        db.delete(record)
        db.commit()
        return {"message": "Đã xóa thành công"}
        
    # Xuất Excel
    @staticmethod
    def export_excel(db: Session, keyword, thang, nam, loai, mapb, macn):
        # Lấy dữ liệu (Tái sử dụng hàm search để đảm bảo filter đúng)
        records = RewardDisciplineService.search(db, keyword, thang, nam, loai, mapb, macn)

        # Chuyển đổi sang list dictionary
        data_list = []
        for r in records:
            data_list.append({
                "ID": r.id,
                "Mã NV": r.ma_nhan_vien,
                "Tên NV": r.ten_nhan_vien or "",
                "Phòng Ban": r.ten_phong_ban or "",
                "Loại Quyết Định": r.loai.value, # Lấy giá trị Enum
                "Ngày QĐ": r.ngay.strftime("%d/%m/%Y"), # Format ngày tháng năm
                "Hình Thức": r.hinh_thuc,
                "Lý Do": r.ly_do,
                "Số Tiền": round(r.so_tien, 2),

                # Tính tháng tự động từ ngày để hiển thị vào Excel
                "Tháng Hạch Toán": r.ngay.month, 
                "Năm": r.ngay.year
            })

        # Tạo DataFrame
        df = pd.DataFrame(data_list)
        output = BytesIO()

        # Ghi vào Excel bằng thư viện openpyxl
        with pd.ExcelWriter(output, engine='openpyxl') as writer:
            # Đặt tên sheet linh động
            sheet_name = "DanhSach"
            if loai == ThuongPhat.KHEN_THUONG: sheet_name = "KhenThuong"
            elif loai == ThuongPhat.KY_LUAT: sheet_name = "KyLuat"
            
            df.to_excel(writer, index=False, sheet_name=sheet_name)
            
            # Format độ rộng cột cho đẹp
            worksheet = writer.sheets[sheet_name]
            for column_cells in worksheet.columns:
                length = max(len(str(cell.value)) for cell in column_cells)
                # Giới hạn độ rộng tối đa là 50 để không bị quá rộng
                worksheet.column_dimensions[column_cells[0].column_letter].width = min(length + 5, 50)

        output.seek(0)
        return output
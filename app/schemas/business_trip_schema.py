from pydantic import BaseModel, Field, model_validator, ConfigDict
from datetime import date
from typing import Optional, Any

# Schema cơ bản
class BusinessTripBase(BaseModel):
    phong_ban_id: str
    chuc_vu_id: str
    tu_ngay: date
    den_ngay: Optional[date] = None
    chi_nhanh: Optional[str] = None
    dia_diem: Optional[str] = None
    thang: int = Field(..., description="Tháng ghi nhận công tác")

# Dùng để Tạo mới (Cần đủ thông tin khóa chính)
class BusinessTripCreate(BusinessTripBase):
    ma_nhan_vien: str

# Dùng để Update (Chỉ cho phép sửa thông tin phụ, KHÔNG sửa khóa chính)
class BusinessTripUpdate(BaseModel):
    den_ngay: Optional[date] = None
    chi_nhanh: Optional[str] = None
    dia_diem: Optional[str] = None
    thang: Optional[int] = None

# Dùng để hiển thị
class BusinessTripResponse(BusinessTripBase):
    ma_nhan_vien: str

    class Config:
        from_attributes = True

# Schema hiển thị ra bảng (Table)
class BusinessTripDetailResponse(BaseModel):
    # Cấu hình để Pydantic hiểu được object ORM (SQLAlchemy)
    model_config = ConfigDict(from_attributes=True)

    # Các trường hiển thị ra bảng
    ma_nhan_vien: str
    ten_nhan_vien: str = "" # Mặc định rỗng, sẽ được điền tự động
    ten_phong_ban: str = ""
    ten_chuc_vu: str = ""
    
    chi_nhanh: Optional[str] = None
    dia_diem: Optional[str] = None
    tu_ngay: date
    den_ngay: Optional[date] = None
    thang: int

    @model_validator(mode='before')
    @classmethod
    def flatten_nested_objects(cls, v: Any):
        """
        Tự động lấy tên từ các bảng quan hệ (nhan_vien, phong_ban, chuc_vu)
        để điền vào các trường ten_...
        """
        # Nếu v là object ORM (có thuộc tính nhan_vien)
        if hasattr(v, 'nhan_vien'):
            # Chúng ta trả về một từ điển chứa dữ liệu đã làm phẳng
            return {
                "ma_nhan_vien": v.ma_nhan_vien,
                "chi_nhanh": v.chi_nhanh,
                "dia_diem": v.dia_diem,
                "tu_ngay": v.tu_ngay,
                "den_ngay": v.den_ngay,
                "thang": v.thang,
                
                # Logic lấy tên (Flatten)
                "ten_nhan_vien": v.nhan_vien.ho_ten if v.nhan_vien else "N/A",
                "ten_phong_ban": v.phong_ban.ten_phong if v.phong_ban else "N/A",
                "ten_chuc_vu": v.chuc_vu.ten_chuc_vu if v.chuc_vu else "N/A",
            }
        return v
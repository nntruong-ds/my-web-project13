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
    ten_nhan_vien: str
    ten_phong_ban: str
    ten_chuc_vu: str
    
    chi_nhanh: Optional[str] = None
    dia_diem: Optional[str] = None
    tu_ngay: date
    den_ngay: Optional[date] = None
    thang: int
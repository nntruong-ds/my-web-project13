from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import date
from app.models.enums import TrangThaiNhanVien

# Schema Base
class EmployeeBase(BaseModel):
    ma_nhan_vien: str
    ho_ten: str
    email: str
    chuc_vu_id: str
    trang_thai: TrangThaiNhanVien = TrangThaiNhanVien.DANG_LAM
    chinhanh_id: int

# Schema khi tạo mới (request)
class EmployeeCreate(EmployeeBase):
    phong_ban_id: str | None = None
    ngay_vao_lam: date | None = None

# Schema khi cập nhật (request)
class EmployeeUpdate(BaseModel):
    ho_ten: Optional[str] = None
    email: Optional[str] = None
    phong_ban_id: Optional[str] = None
    chuc_vu_id: Optional[str] = None
    ngay_vao_lam: Optional[date] = None
    trang_thai: Optional[TrangThaiNhanVien] = TrangThaiNhanVien.DANG_LAM
    chinhanh_id: Optional[int] = None

# Schema khi trả dữ liệu ra (response)
class EmployeeResponse(EmployeeBase):
    phong_ban_id: Optional[str] = None
    ngay_vao_lam: Optional[date] = None

    class Config:
        from_attributes = True
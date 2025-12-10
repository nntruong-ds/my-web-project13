from pydantic import BaseModel
from typing import Optional
from datetime import date

# Schema Base
class BranchBase(BaseModel):
    ma_chi_nhanh: int
    ten_chi_nhanh: str
    dia_chi: Optional[str] = None
    so_dien_thoai: Optional[str] = None
    email: Optional[str] = None
    ngay_thanh_lap: Optional[date] = None

# Schema khi tạo mới (request)
class BranchCreate(BranchBase):
    id_gdoc: Optional[str] = None

# Schema khi cập nhật (request)
class BranchUpdate(BaseModel):
    ten_chi_nhanh: Optional[str] = None
    dia_chi: Optional[str] = None
    so_dien_thoai: Optional[str] = None
    email: Optional[str] = None
    id_gdoc: Optional[str] = None
    ngay_thanh_lap: Optional[date] = None

# Schema khi trả dữ liệu ra (response)
class BranchResponse(BranchBase):    
    id_gdoc: Optional[str] = None

    # Hiển thị tên giám đốc
    ten_giam_doc: Optional[str] = None

    # Hiển thị số lượng phòng ban của chi nhánh
    so_luong_phong_ban: int

    # Hiển thị số lượng nhân viên của chi nhánh
    so_luong_nhan_vien: int

    class Config:
        from_attributes = True
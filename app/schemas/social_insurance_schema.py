from pydantic import BaseModel, ConfigDict, Field
from datetime import date
from typing import Optional

from app.models.enums import TrangThaiBHXH

# Schema cơ bản
class SocialInsuranceBase(BaseModel):
    ma_nhan_vien: str
    so_so_bhxh: str
    thang_nam: date
    thang: int

# Create (Cần mã NV)
class SocialInsuranceCreate(SocialInsuranceBase):
    trang_thai: Optional[TrangThaiBHXH] = TrangThaiBHXH.HOAT_DONG

# Update (Chỉ cho phép sửa trạng thái, vì các cột kia là khóa chính)
class SocialInsuranceUpdate(SocialInsuranceBase):
    trang_thai: TrangThaiBHXH

# Schema response
class SocialInsuranceResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    ma_nhan_vien: str
    ten_nhan_vien: Optional[str] = None
    ten_phong_ban: Optional[str] = None
    ten_chi_nhanh: Optional[str] = None
    so_so_bhxh: str
    thang_nam: date
    thang: int
    trang_thai: TrangThaiBHXH
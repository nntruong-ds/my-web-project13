from pydantic import BaseModel
from typing import Optional
from datetime import date

class EmployeeProfile(BaseModel):
    ma_nhan_vien: str
    ho_ten: Optional[str]
    email: Optional[str]
    phong_ban_id: Optional[int]
    chuc_vu_id: Optional[str]
    ngay_vao_lam: Optional[date]
    trang_thai: Optional[str]
    chinhanh_id: Optional[int]

    class Config:
        from_attributes = True


class EmployeeUpdate(BaseModel):
    ho_ten: Optional[str] = None
    email: Optional[str] = None
    phong_ban_id: Optional[int] = None
    trang_thai: Optional[str] = None



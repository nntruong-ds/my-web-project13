from pydantic import BaseModel, EmailStr
from typing import Optional

# Thông tin hồ sơ nhân viên trả về cho frontend
class EmployeeProfile(BaseModel):
    ma_nhan_vien: str
    ho_ten: Optional[str]
    email: Optional[EmailStr]
    so_dien_thoai: Optional[str]
    dia_chi: Optional[str]
    vai_tro: Optional[str]

    class Config:
        orm_mode = True  # Cho phép đọc từ SQLAlchemy hoặc dict


# Thông tin cập nhật hồ sơ
class EmployeeUpdateRequest(BaseModel):
    email: Optional[EmailStr] = None
    so_dien_thoai: Optional[str] = None
    dia_chi: Optional[str] = None

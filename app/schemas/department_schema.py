from pydantic import BaseModel, field_validator
from typing import Optional, List, Union
from datetime import datetime

# Schema Base
class DepartmentBase(BaseModel):
    mapb: str
    ten_phong: str
    ma_cn: int

# Schema khi tạo mới (request)
class DepartmentCreate(DepartmentBase):
    truong_phong_id: Optional[str] = None

# Schema khi cập nhật (request)
class DepartmentUpdate(BaseModel):
    ten_phong: Optional[str] = None
    truong_phong_id: Optional[str] = None
    ngay_tao: Optional[datetime] = None
    ma_cn: Optional[int] = None

# SChema khi trả dữ liệu ra (response)
class DepartmentResponse(DepartmentBase):
    truong_phong_id: Optional[str] = None
    ngay_tao: Union[datetime, str]
    so_luong_nhan_vien: int

    class Config:
        from_attributes = True
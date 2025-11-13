from pydantic import BaseModel
from typing import Optional, List

# Base schema chung
# class DepartmentBase(BaseModel):
#     department_name: str
#     describe: Optional[str] = None

# Schema khi tạo mới (request)
class DepartmentCreate(BaseModel):
    department_name: str
    describe: Optional[str] = None

# Schema khi cập nhật (request)
class DepartmentUpdate(BaseModel):
    department_name: Optional[str] = None
    describe: Optional[str] = None

# Dùng khi trả dữ liệu ra (response)
class DepartmentResponse(BaseModel):
    department_id: int
    department_name: str
    describe: Optional[str] = None

    class Config:
        from_attributes = True
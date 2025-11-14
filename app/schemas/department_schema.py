from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

# Schema khi tạo mới (request)
class DepartmentCreate(BaseModel):
    department_id: str
    department_name: str
    # head_id: Optional[str] = None
    branch_id: int

# Schema khi cập nhật (request)
class DepartmentUpdate(BaseModel):
    department_name: Optional[str] = None
    # head_id: Optional[str] = None
    branch_id: Optional[int] = None

# Dùng khi trả dữ liệu ra (response)
class DepartmentResponse(BaseModel):
    department_id: str
    department_name: str
    # head_id: Optional[str] = None
    date_of_creation: datetime
    branch_id: int

    class Config:
        from_attributes = True
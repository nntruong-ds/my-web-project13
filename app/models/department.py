from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.configs.database import Base

class Department(Base):
    __tablename__ = "phong_ban"

    department_id = Column(Integer, primary_key=True, index=True)
    department_name = Column(String(100), unique=True, nullable=False)
    describe = Column(String(255), default="")

    # Quan hệ 1-n: 1 phòng ban có nhiều nhân viên
    # nhanviens = relationship("nhanvien", back_populates="phongban")
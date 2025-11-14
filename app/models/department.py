from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, func
from sqlalchemy.orm import relationship
from app.configs.database import Base

class Department(Base):
    __tablename__ = "phong_ban"

    department_id = Column(String(20), primary_key=True, index=True)
    department_name = Column(String(100), unique=True, nullable=False)
    # head_id = Column(String(11), ForeignKey("nhan_vien.manv"), nullable=True)
    date_of_creation = Column(DateTime, server_default=func.now(), nullable=False)
    branch_id = Column(Integer, nullable=False)

    # head_department = relationship("Employee", back_populates="phong_quan_ly", lazy="joined")

    def __repr__(self):
        return f"<PhongBan(mapb='{self.department_id}', ten_phong='{self.department_name}')>"
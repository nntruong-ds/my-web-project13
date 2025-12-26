from sqlalchemy import Column, String, Integer, DECIMAL
from sqlalchemy.orm import relationship
from app.configs.database import Base

class Position(Base):
    __tablename__ = "chuc_vu"

    # Ánh xạ đúng theo SQL
    chucvu_id = Column(String(11), primary_key=True)
    ten_chuc_vu = Column(String(100), nullable=False)
    luong_co_ban = Column(DECIMAL(15, 2), default=0.00)
    he_so_luong = Column(Integer, default=1)

    # Relationship ngược về nhân viên (One-to-Many)
    # Một chức vụ có nhiều nhân viên
    ds_nhan_vien = relationship("Employee", back_populates="chuc_vu")